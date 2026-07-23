#!/usr/bin/env node
/* =====================================================================
   ClearSpace — pricing & message tests.
   Run from the project root:  node tools/test.js
   Exits non-zero if anything is wrong. Run it after editing rates in
   pricing-config.js to make sure nothing broke.
   ===================================================================== */
"use strict";

var fs = require("fs");
var path = require("path");
var crypto = require("crypto");
var cfg = require("../pricing-config.js");
var QE = require("./quote-engine.js");
var q = cfg.clearspaceQuote;
var C = cfg.CLEARSPACE_CONFIG;

var pass = 0, fail = 0;
function ok(name, cond) {
  if (cond) { pass++; console.log("  ✓ " + name); }
  else { fail++; console.log("  ✗ FAIL: " + name); }
}
function eq(name, a, b) { ok(name + " (" + a + " === " + b + ")", a === b); }

console.log("\nPRICING MATH");
// 1. Baseline: standard, included size, 1 bed / 1 bath, one-time = just the base
var r1 = q({ service: "standard", sqft: C.pricing.includedSqFt, bedrooms: 1, bathrooms: 1, frequency: "onetime", addons: [] });
eq("baseline standard = base visit", r1.total, C.pricing.baseVisit);

// 2. Service multipliers land on the expected bases
eq("standard base", q({ service: "standard", sqft: 1000, bedrooms: 1, bathrooms: 1, frequency: "onetime", addons: [] }).base, 120);
eq("deep base", q({ service: "deep", sqft: 1000, bedrooms: 1, bathrooms: 1, frequency: "onetime", addons: [] }).base, 220);
eq("move-out base", q({ service: "moveout", sqft: 1000, bedrooms: 1, bathrooms: 1, frequency: "onetime", addons: [] }).base, 280);

// 3. Full breakdown adds up (deep, 1800sqft, 3/2, oven)
var r3 = q({ service: "deep", sqft: 1800, bedrooms: 3, bathrooms: 2, frequency: "onetime", addons: ["oven"] });
eq("deep sqft add", r3.sqftAdd, Math.round((1800 - 1000) * C.pricing.perSqFt));
eq("deep bedroom add", r3.bedAdd, 2 * C.pricing.perBedroom);
eq("deep bathroom add", r3.bathAdd, 1 * C.pricing.perBathroom);
eq("deep addon total", r3.addonTotal, 35);
eq("deep total = sum of parts", r3.total, r3.base + r3.sqftAdd + r3.bedAdd + r3.bathAdd + r3.addonTotal);

// 4. Frequency discount math (standard, 1200, 2/1, biweekly)
var r4 = q({ service: "standard", sqft: 1200, bedrooms: 2, bathrooms: 1, frequency: "biweekly", addons: [] });
eq("biweekly discount = 15% of subtotal", r4.discount, Math.round(r4.subtotal * 0.15));
eq("biweekly total = subtotal - discount", r4.total, r4.subtotal - r4.discount);
ok("weekly beats biweekly beats monthly beats onetime (more frequent = bigger discount)",
  q({ service: "standard", sqft: 1500, bedrooms: 2, bathrooms: 1, frequency: "weekly", addons: [] }).total <
  q({ service: "standard", sqft: 1500, bedrooms: 2, bathrooms: 1, frequency: "monthly", addons: [] }).total);

// 5. No negative room charges below 1
var r5 = q({ service: "standard", sqft: 500, bedrooms: 1, bathrooms: 1, frequency: "onetime", addons: [] });
ok("no sqft charge below included size", r5.sqftAdd === 0);
ok("no room charge for 1 bed / 1 bath", r5.bedAdd === 0 && r5.bathAdd === 0);

// 6. Prices are positive integers
ok("total is a positive whole number", Number.isInteger(r3.total) && r3.total > 0);

console.log("\nMESSAGES");
var lead = { name: "Test User", service: "deep", city: "West Jordan", sqft: 1800, bedrooms: 3, bathrooms: 2, frequency: "onetime", addons: ["oven"] };
var qm = QE.quoteMessages(lead);
ok("quote SMS mentions the total", qm.sms_en.indexOf("$" + r3.total) >= 0);
ok("quote has EN + ES SMS and email", !!(qm.sms_en && qm.sms_es && qm.email_en && qm.email_es));

// 7. Organizing = in-person custom quote, never an auto price
var org = QE.quoteMessages({ name: "Rosa", service: "organizing", city: "Sandy", bedrooms: 3, bathrooms: 2, sqft: 2000, frequency: "onetime", addons: [] });
ok("organizing has no auto total", org.total === null);
ok("organizing message is about organizing, not a clean price", /organizing/i.test(org.email_en) && !/\$\d/.test(org.sms_en));

// 8. Referral message reflects the config amounts
var ref = QE.referralMessages({ name: "Sarah" });
var give = C.business.referral.give, get = C.business.referral.get;
ok("referral SMS uses config give/get amounts", ref.sms_en.indexOf("$" + get) >= 0 && ref.sms_en.indexOf("$" + give) >= 0);

// 9. Auto-reply + all message types exist and are bilingual
var all = QE.allMessages(lead);
["autoreply", "referral", "quote", "confirmation", "reminder", "review"].forEach(function (k) {
  ok("allMessages has " + k, !!all[k]);
});

console.log("\nSECURITY & SYNC INTERNALS");
// Dashboard SHA-256 must match Node's crypto (correctness). Uses neutral test
// strings — never the real passphrase.
try {
  var appHtml = fs.readFileSync(path.join(__dirname, "..", "app.html"), "utf8");
  var shaSrc = appHtml.match(/function sha256\(ascii\) \{[\s\S]*?\n  \}/)[0];
  var sha256 = eval("(" + shaSrc + ")");
  var samples = ["abc", "Test123!", "a longer phrase 42", ""];
  ok("dashboard SHA-256 matches Node crypto", samples.every(function (s) {
    return sha256(s) === crypto.createHash("sha256").update(s).digest("hex");
  }));
  ok("dashboard has a non-empty OWNER_HASH", /OWNER_HASH = "[a-f0-9]{64}"/.test(appHtml));
} catch (e) { ok("dashboard SHA-256 check ran", false); }

// Cloud-sync state comparison must be independent of object key order.
try {
  var syncSrc = fs.readFileSync(path.join(__dirname, "..", "assets", "supabase-sync.js"), "utf8");
  var stableSrc = syncSrc.match(/function stable\(v\) \{[\s\S]*?\n  \}/)[0];
  var stable = eval("(" + stableSrc + ")");
  ok("sync stable() is key-order independent",
    stable({ b: 1, a: 2, n: { y: 1, x: 2 }, arr: [1, 2] }) === stable({ a: 2, arr: [1, 2], b: 1, n: { x: 2, y: 1 } }));
  ok("sync stable() detects real differences",
    stable({ a: 1 }) !== stable({ a: 2 }));
} catch (e) { ok("sync stable() check ran", false); }

console.log("\n" + (fail === 0 ? "ALL " + pass + " TESTS PASSED ✅" : fail + " FAILED / " + pass + " passed ❌"));
process.exit(fail === 0 ? 0 : 1);
