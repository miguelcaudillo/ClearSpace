/* =====================================================================
   ClearSpace — PRICING & BUSINESS CONFIG (the ONE place to edit rates)
   =====================================================================
   Everything customer-facing pulls numbers from THIS file:
     - the landing page  (index.html   → "from $X" service prices)
     - the calculator    (pricing.html → live estimates)
     - the quote engine  (tools/quote-engine.js → SMS/email messages)

   HOW TO EDIT: change the numbers, save, commit, push. Never edit
   prices inside the other files — they all read from here.

   All default numbers below were carried over from the original
   ClearSpace app (the $120/$220/$280 bases, room fees, discounts).
   Adjust to taste — nothing else needs to change.
   ===================================================================== */

var CLEARSPACE_CONFIG = {

  /* ---------- BUSINESS INFO (shown on every page & message) ---------- */
  business: {
    name: "ClearSpace Home Cleaning",
    phone: "(801) 433-7342",
    email: "ClearSpaceCleaning113@gmail.com",
    bookingUrl: "https://miguelcaudillo.github.io/ClearSpace/pricing.html",
    reviewUrl: "[YOUR GOOGLE REVIEW LINK]", // from Google Business Profile → "Ask for reviews"
    serviceCities: [
      "West Jordan", "Salt Lake City", "South Jordan", "Sandy",
      "Riverton", "Herriman", "Taylorsville", "Murray"
    ],
    // Any ZIP starting with one of these passes the service-area check.
    // 840xx / 841xx covers the Salt Lake valley.
    zipPrefixes: ["840", "841"]
  },

  /* ---------- PRICING ---------- */
  pricing: {
    // Base price for a STANDARD clean. Covers a home up to
    // `includedSqFt` square feet with 1 bedroom and 1 bathroom.
    baseVisit: 120,
    includedSqFt: 1000,

    // Per square foot ABOVE includedSqFt.
    // (≈ the size brackets on the original site: 2,000 ft² home ≈ +$70)
    perSqFt: 0.07,

    // Per room BEYOND the first of each.
    perBedroom: 25,
    perBathroom: 30,

    // Service types. `mult` scales ONLY the base visit price
    // (1.833 × $120 = $220 deep, 2.333 × $120 = $280 move-out —
    //  same as the original site's bases).
    services: {
      standard: { mult: 1.0,   en: "Standard Clean",    es: "Limpieza Estándar" },
      deep:     { mult: 1.833, en: "Deep Clean",        es: "Limpieza Profunda" },
      moveout:  { mult: 2.333, en: "Move-In/Out Clean", es: "Limpieza de Mudanza" }
    },

    // Recurring discounts, applied to the whole visit price.
    frequencies: {
      onetime:  { disc: 0,    en: "One-time",  es: "Una sola vez" },
      monthly:  { disc: 0.10, en: "Monthly",   es: "Mensual" },
      biweekly: { disc: 0.15, en: "Bi-weekly", es: "Quincenal" },
      weekly:   { disc: 0.20, en: "Weekly",    es: "Semanal" }
    },

    // Optional add-ons (flat prices).
    addons: [
      { id: "fridge",   price: 35, en: "Inside fridge",    es: "Interior del refrigerador" },
      { id: "oven",     price: 35, en: "Inside oven",      es: "Interior del horno" },
      { id: "windows",  price: 45, en: "Interior windows", es: "Ventanas interiores" },
      { id: "laundry",  price: 30, en: "Laundry",          es: "Lavandería" },
      { id: "pet",      price: 40, en: "Pet-hair detail",  es: "Detalle de pelo de mascota" },
      { id: "cabinets", price: 40, en: "Inside cabinets",  es: "Interior de gabinetes" }
    ]

    // NOTE: Home Organizing is quoted in person, so it intentionally
    // has NO price here — the site says "custom quote".
  }
};

/* =====================================================================
   QUOTE MATH — you should not need to edit below this line.
   quote = round(baseVisit × service mult) + sq-ft over included × perSqFt
           + extra bedrooms + extra bathrooms + add-ons, then frequency
           discount off the whole thing.
   ===================================================================== */
function clearspaceQuote(input) {
  var p = CLEARSPACE_CONFIG.pricing;
  var svc = p.services[input.service] || p.services.standard;
  var freq = p.frequencies[input.frequency] || p.frequencies.onetime;

  var base = Math.round(p.baseVisit * svc.mult);
  var sqftAdd = Math.round(Math.max(0, (input.sqft || 0) - p.includedSqFt) * p.perSqFt);
  var bedAdd = Math.max(0, (input.bedrooms || 1) - 1) * p.perBedroom;
  var bathAdd = Math.max(0, (input.bathrooms || 1) - 1) * p.perBathroom;

  var addons = [];
  var addonTotal = 0;
  (input.addons || []).forEach(function (id) {
    p.addons.forEach(function (a) {
      if (a.id === id) { addons.push(a); addonTotal += a.price; }
    });
  });

  var subtotal = base + sqftAdd + bedAdd + bathAdd + addonTotal;
  var discount = Math.round(subtotal * freq.disc);
  var total = subtotal - discount;

  return {
    base: base, sqftAdd: sqftAdd, bedAdd: bedAdd, bathAdd: bathAdd,
    addons: addons, addonTotal: addonTotal,
    subtotal: subtotal, discountPct: freq.disc, discount: discount,
    total: total, service: svc, frequency: freq
  };
}

/* Make it work both in the browser (script tag) and in Node (require). */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { CLEARSPACE_CONFIG: CLEARSPACE_CONFIG, clearspaceQuote: clearspaceQuote };
}
