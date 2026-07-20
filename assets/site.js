/* ClearSpace — shared site JS: EN/ES toggle, config-driven prices, quote form. */
"use strict";

/* ---------- Language toggle ----------
   Any element with a data-es attribute swaps its text when Spanish is on.
   data-es-html swaps innerHTML (for text containing <br> etc.).
   data-es-ph swaps an input's placeholder. Choice persists in localStorage. */
var Lang = (function () {
  var KEY = "clearspace_lang";
  var current = "en";

  function apply(lang) {
    current = lang;
    document.documentElement.lang = lang === "es" ? "es" : "en";
    document.querySelectorAll("[data-es],[data-es-html],[data-es-ph]").forEach(function (el) {
      if (el.hasAttribute("data-es")) {
        if (!el.hasAttribute("data-en")) el.setAttribute("data-en", el.textContent);
        el.textContent = lang === "es" ? el.getAttribute("data-es") : el.getAttribute("data-en");
      }
      if (el.hasAttribute("data-es-html")) {
        if (!el.hasAttribute("data-en-html")) el.setAttribute("data-en-html", el.innerHTML);
        el.innerHTML = lang === "es" ? el.getAttribute("data-es-html") : el.getAttribute("data-en-html");
      }
      if (el.hasAttribute("data-es-ph")) {
        if (!el.hasAttribute("data-en-ph")) el.setAttribute("data-en-ph", el.getAttribute("placeholder") || "");
        el.setAttribute("placeholder", lang === "es" ? el.getAttribute("data-es-ph") : el.getAttribute("data-en-ph"));
      }
    });
    document.querySelectorAll(".lang-toggle button").forEach(function (b) {
      b.classList.toggle("active", b.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  function init() {
    var saved = "en";
    try { saved = localStorage.getItem(KEY) || "en"; } catch (e) {}
    apply(saved);
  }

  return { init: init, set: apply, get: function () { return current; } };
})();

/* ---------- Config-driven "from $X" prices ----------
   Elements with data-price-from="standard|deep|moveout" get the computed
   starting price from pricing-config.js so the site never hardcodes rates. */
function renderConfigPrices() {
  if (typeof CLEARSPACE_CONFIG === "undefined") return;
  var p = CLEARSPACE_CONFIG.pricing;
  document.querySelectorAll("[data-price-from]").forEach(function (el) {
    var svc = p.services[el.getAttribute("data-price-from")];
    if (svc) el.textContent = "$" + Math.round(p.baseVisit * svc.mult);
  });
  var maxDisc = 0;
  Object.keys(p.frequencies).forEach(function (k) {
    if (p.frequencies[k].disc > maxDisc) maxDisc = p.frequencies[k].disc;
  });
  document.querySelectorAll("[data-max-discount]").forEach(function (el) {
    el.textContent = Math.round(maxDisc * 100) + "%";
  });
  var phone = CLEARSPACE_CONFIG.business.phone;
  var telHref = "tel:" + phone.replace(/[^0-9+]/g, "");
  document.querySelectorAll("[data-biz-phone]").forEach(function (el) {
    el.textContent = phone;
    if (el.tagName === "A") el.setAttribute("href", telHref);
  });
  document.querySelectorAll("[data-biz-email]").forEach(function (el) {
    el.textContent = CLEARSPACE_CONFIG.business.email;
  });
}

/* ---------- Quote request form ----------
   No backend needed for launch: leads are saved to localStorage
   (key clearspace_leads) AND — if FORM_ENDPOINT is set to a form service
   URL (e.g. Formspree) — POSTed there so you get an email. */
var FORM_ENDPOINT = "https://formspree.io/f/mpqvrogw"; // Formspree → ClearSpaceCleaning113@gmail.com

function submitQuoteForm(formEl, errEl, okEl) {
  var data = {};
  formEl.querySelectorAll("input,select,textarea").forEach(function (f) {
    if (f.name) data[f.name] = f.value.trim();
  });

  var missing = [];
  ["name", "phone", "address", "service"].forEach(function (k) {
    if (!data[k]) missing.push(k);
  });
  if (missing.length) {
    errEl.style.display = "block";
    errEl.textContent = Lang.get() === "es"
      ? "Por favor completa: nombre, teléfono, dirección y tipo de servicio."
      : "Please fill in: name, phone, address, and service type.";
    return false;
  }
  errEl.style.display = "none";

  data.submitted = new Date().toISOString();
  data.lang = Lang.get();
  try {
    var leads = JSON.parse(localStorage.getItem("clearspace_leads") || "[]");
    leads.push(data);
    localStorage.setItem("clearspace_leads", JSON.stringify(leads));
  } catch (e) {}

  if (FORM_ENDPOINT) {
    // Formspree-friendly extras: subject line + reply-to the customer.
    var payload = {};
    Object.keys(data).forEach(function (k) { payload[k] = data[k]; });
    payload._subject = "New ClearSpace quote request — " + (data.name || "") + " (" + (data.service || "") + ")";
    if (data.email) payload._replyto = data.email;
    fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload)
    }).catch(function () {});
  }

  formEl.style.display = "none";
  okEl.style.display = "block";
  okEl.scrollIntoView({ behavior: "smooth", block: "center" });
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  Lang.init();
  renderConfigPrices();
});
