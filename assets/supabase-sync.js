/* =====================================================================
   ClearSpace — Dashboard Cloud Sync (optional, powered by Supabase)
   =====================================================================
   WHAT IT DOES: backs up your whole dashboard to the cloud and lets you
   load it on another device — so your phone and laptop can share data,
   and nothing is lost if a browser clears.

   HOW TO TURN IT ON (one-time): paste your two Supabase values below.
   Get them from Supabase → Project Settings → API:
     • Project URL   → SUPABASE_URL
     • anon public key → SUPABASE_ANON_KEY
   Until BOTH are filled in, this file does NOTHING — the dashboard works
   exactly as before, on local storage only. It is safe to leave blank.
   ===================================================================== */
(function () {
  "use strict";

  var SUPABASE_URL = "https://pshxdewfqowrkkpmqfdj.supabase.co";
  var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzaHhkZXdmcW93cmtrcG1xZmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0MzIxMTcsImV4cCI6MjA5ODAwODExN30.ezifjkirOi8U1G4pRJ6h-VWeLWPDrbWgTBmHqLCdtR8";

  var STATE_KEY = "clearspace_v4";   // the app's local-storage key (do not change)
  var enabled = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

  // If not configured, expose a no-op API and stop. Dashboard is untouched.
  if (!enabled) {
    window.ClearSpaceSync = { onSave: function () {}, init: function () {}, enabled: false };
    return;
  }

  var sb = null, session = null, pushTimer = null, lastPushed = "", libPromise = null;

  // Load the Supabase JS library from CDN only when sync is actually enabled.
  function loadLib() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("Couldn't load the cloud library (offline?).")); };
      document.head.appendChild(s);
    });
    return libPromise;
  }

  function localState() { try { return localStorage.getItem(STATE_KEY) || ""; } catch (e) { return ""; } }

  // Canonical JSON (keys sorted) so we can compare a local copy against the
  // cloud copy fairly — Postgres/jsonb reorders object keys, which would
  // otherwise make identical data look "different".
  function stable(v) {
    if (v === null || typeof v !== "object") return JSON.stringify(v);
    if (Array.isArray(v)) return "[" + v.map(stable).join(",") + "]";
    return "{" + Object.keys(v).sort().map(function (k) { return JSON.stringify(k) + ":" + stable(v[k]); }).join(",") + "}";
  }
  function sameData(aObj, bStr) {
    try { return stable(aObj) === stable(JSON.parse(bStr)); } catch (e) { return false; }
  }

  function client() {
    if (sb) return sb;
    if (!window.supabase || !window.supabase.createClient) throw new Error("Supabase library didn't load.");
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return sb;
  }

  async function refreshSession() {
    var res = await client().auth.getSession();
    session = res.data ? res.data.session : null;
    return session;
  }

  async function signIn(email, password) {
    var res = await client().auth.signInWithPassword({ email: email, password: password });
    if (res.error) throw res.error;
    session = res.data.session;
    return session;
  }
  async function signOut() { try { await client().auth.signOut(); } catch (e) {} session = null; }

  async function push() {
    if (!session) return;
    var raw = localState();
    if (!raw || raw === lastPushed) return;
    var row = { user_id: session.user.id, state: JSON.parse(raw), updated_at: new Date().toISOString() };
    var res = await client().from("dashboard_state").upsert(row, { onConflict: "user_id" });
    if (res.error) throw res.error;
    lastPushed = raw;
  }

  async function pull() {
    if (!session) return null;
    var res = await client().from("dashboard_state").select("state,updated_at").eq("user_id", session.user.id).maybeSingle();
    if (res.error) throw res.error;
    return res.data || null;
  }

  // Called by the app's Store.save() — debounced, fire-and-forget backup.
  function onSave() {
    if (!session) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { push().then(setStatus).catch(function (e) { setStatus(null, e); }); }, 1200);
  }

  /* ---------------- tiny UI (injected; on-brand emerald) ---------------- */
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  }
  // Turn raw Supabase errors into plain-language guidance.
  function friendly(e) {
    var msg = (e && (e.message || e.error_description || e.error)) || "Something went wrong.";
    var code = e && e.code;
    if (code === "PGRST205" || /Could not find the table/i.test(msg))
      return "Cloud isn't set up yet — run supabase-schema.sql in Supabase (see docs/backend-setup.md).";
    if (/Invalid login credentials/i.test(msg)) return "Wrong email or password.";
    if (/Email not confirmed/i.test(msg)) return "Confirm your email, or turn off email confirmation in Supabase → Auth.";
    if (/Failed to fetch|NetworkError|load the cloud library/i.test(msg)) return "Can't reach the cloud (offline?). Try again.";
    return "⚠ " + msg;
  }
  var panel, statusEl;
  function setStatus(_, errObj) {
    if (!statusEl) return;
    if (errObj) { statusEl.textContent = friendly(errObj); statusEl.style.color = "#b45309"; return; }
    statusEl.style.color = "#065f46";
    statusEl.textContent = session ? "☁ Signed in — auto-backup is on." : "Not signed in.";
  }

  function renderPanelBody() {
    if (!panel) return;
    var body = panel.querySelector(".cs-body");
    if (session) {
      body.innerHTML =
        '<div class="cs-status" id="csStatus"></div>' +
        '<button class="cs-btn cs-primary" id="csBackup">⬆ Back up this device now</button>' +
        '<button class="cs-btn" id="csRestore">⬇ Load cloud copy here <span style="opacity:.7">(replaces this device)</span></button>' +
        '<button class="cs-btn cs-ghost" id="csOut">Sign out of cloud</button>';
      statusEl = body.querySelector("#csStatus"); setStatus();
      body.querySelector("#csBackup").onclick = function () { push().then(function () { setStatus(); }).catch(function (e) { setStatus(null, e); }); };
      body.querySelector("#csRestore").onclick = async function () {
        try {
          var row = await pull();
          if (!row) { setStatus(null, { message: "No cloud copy found yet. Back up first." }); return; }
          if (!confirm("Replace this device's dashboard with the cloud copy? This can't be undone.")) return;
          localStorage.setItem(STATE_KEY, JSON.stringify(row.state));
          location.reload();
        } catch (e) { setStatus(null, e); }
      };
      body.querySelector("#csOut").onclick = function () { signOut().then(renderPanelBody); };
    } else {
      body.innerHTML =
        '<div class="cs-status" id="csStatus">Sign in to back up &amp; sync your dashboard.</div>' +
        '<input class="cs-in" id="csEmail" type="email" placeholder="email" autocomplete="username">' +
        '<input class="cs-in" id="csPass" type="password" placeholder="password" autocomplete="current-password">' +
        '<button class="cs-btn cs-primary" id="csIn">Sign in to cloud</button>';
      statusEl = body.querySelector("#csStatus");
      body.querySelector("#csIn").onclick = function () {
        var em = body.querySelector("#csEmail").value.trim(), pw = body.querySelector("#csPass").value;
        setStatus(); statusEl.textContent = "Signing in…";
        signIn(em, pw).then(function () { renderPanelBody(); maybeOfferCloud(); }).catch(function (e) { setStatus(null, e); });
      };
    }
  }

  function injectUI() {
    var style = el("style", null,
      ".cs-fab{position:fixed;right:16px;bottom:16px;z-index:5000;background:linear-gradient(135deg,#22c55e,#065f46);color:#fff;border:none;border-radius:999px;padding:11px 16px;font-weight:700;font-family:Segoe UI,Arial,sans-serif;box-shadow:0 6px 18px rgba(2,44,34,.3);cursor:pointer}" +
      ".cs-panel{position:fixed;right:16px;bottom:66px;z-index:5000;width:290px;background:#fff;border:1px solid #dcebe3;border-radius:16px;box-shadow:0 18px 50px rgba(2,44,34,.25);padding:16px;font-family:Segoe UI,Arial,sans-serif;display:none}" +
      ".cs-panel.open{display:block}" +
      ".cs-panel h4{font-size:1rem;color:#065f46;margin:0 0 4px}.cs-panel .cs-sub{font-size:.78rem;color:#5c6f67;margin-bottom:12px}" +
      ".cs-status{font-size:.82rem;color:#065f46;margin-bottom:10px;min-height:18px}" +
      ".cs-in{width:100%;border:1.5px solid #dcebe3;border-radius:10px;padding:9px 11px;margin-bottom:8px;font-size:.9rem}" +
      ".cs-btn{width:100%;border:1.5px solid #dcebe3;background:#fff;border-radius:10px;padding:10px;margin-bottom:8px;font-weight:700;font-size:.88rem;cursor:pointer;color:#0b1f18}" +
      ".cs-btn.cs-primary{background:linear-gradient(135deg,#22c55e,#047857);color:#fff;border:none}.cs-btn.cs-ghost{color:#5c6f67}");
    document.head.appendChild(style);
    var fab = el("button", { class: "cs-fab", title: "Cloud sync" }, "☁ Cloud");
    panel = el("div", { class: "cs-panel" },
      '<h4>☁ Cloud sync</h4><div class="cs-sub">Back up your dashboard &amp; share it across devices.</div><div class="cs-body"></div>');
    document.body.appendChild(fab); document.body.appendChild(panel);
    fab.onclick = function () { panel.classList.toggle("open"); };
    renderPanelBody();
  }

  async function maybeOfferCloud() {
    try {
      var row = await pull();
      var local = localState();
      if (row && !sameData(row.state, local)) {
        // Cloud has a genuinely different copy — never auto-overwrite; let the
        // owner choose (⬇ load it here, or ⬆ push this device up).
        panel.classList.add("open");
        if (statusEl) { statusEl.style.color = "#b45309"; statusEl.textContent = "A different cloud copy exists — use ⬇ to load it here, or ⬆ to overwrite the cloud with this device."; }
      } else if (!row) {
        // No cloud copy yet — save this device up as the first backup.
        push().then(setStatus).catch(function () {});
      } else {
        // Already in sync.
        lastPushed = local; setStatus();
      }
    } catch (e) { setStatus(null, e); }
  }

  async function init() {
    injectUI();
    try {
      await loadLib();
      await refreshSession();
      renderPanelBody();
      if (session) maybeOfferCloud();
    } catch (e) { setStatus(null, e); }
  }

  window.ClearSpaceSync = { onSave: onSave, init: init, enabled: true };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
