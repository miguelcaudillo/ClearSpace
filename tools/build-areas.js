#!/usr/bin/env node
/* Builds the areas/*.html local SEO pages. Run after editing content:
     node tools/build-areas.js
   Prices shown on these pages are pulled from pricing-config.js at page
   load (data-price-from spans) — never hardcoded here. */
"use strict";

var fs = require("fs");
var path = require("path");

var OUT = path.join(__dirname, "..", "areas");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT);

/* ---------- Unique, locally specific content ---------- */
/* h = house cleaning page, m = move-out page. `intro` and `body` are the
   unique prose; `bullets` are locally flavored selling points. */
var CITIES = [
  {
    slug: "west-jordan", name: "West Jordan",
    h: {
      title: "House Cleaning in West Jordan, UT",
      intro: "ClearSpace is based right here in West Jordan — when you book us, the crew isn't driving in from across the valley, we're your neighbors. From the established family streets around Gardner Village to the newer builds climbing toward the Oquirrh foothills near Copper Hills, we clean the homes we drive past every day.",
      body: "West Jordan homes work hard. Most of the houses we clean here are busy family homes — three or four bedrooms, kids' bathrooms that see real traffic, and kitchens that cook seven nights a week. Our standard clean keeps that machine running week to week, and our deep clean handles what the west-side wind blows in: the fine Oquirrh-bench dust that settles on baseboards, blinds, and ceiling-fan blades faster than most people expect. Because we're local, we can often fit West Jordan homes into same-week openings, and recurring customers here keep the same crew visit after visit.",
      bullets: [
        "Home base advantage — shortest drive in our whole service area means flexible scheduling",
        "Deep cleans tuned for bench dust: baseboards, vents, blinds, and fan blades",
        "Busy-family standard cleans: kitchens, kids' bathrooms, and floors that reset weekly",
        "Same crew every visit for recurring homes near Jordan Landing, Copper Hills, and Gardner Village"
      ]
    },
    m: {
      title: "Move-Out Cleaning in West Jordan, UT",
      intro: "Handing back keys in West Jordan? Whether it's an apartment near Jordan Landing or a family house you've sold near Ron Wood Park, our move-out clean is built to survive the walkthrough — inside cabinets, inside appliances, closets, baseboards, and windows.",
      body: "Landlords and buyers check the same dozen places every time, so that's exactly where we go: the oven and the fridge interior, under the kitchen sink, cabinet shelves, closet rods and shelving, bathroom descaling, and the wall scuffs that moving furniture always leaves behind. We photograph the finished home room by room so you have proof of condition — useful for deposits, and just as useful when you're the seller closing on a family home. If the timing is tight between your moving truck and your walkthrough, tell us the deadline and we'll build the visit around it."
    }
  },
  {
    slug: "salt-lake-city", name: "Salt Lake City",
    h: {
      title: "House Cleaning in Salt Lake City, UT",
      intro: "Salt Lake City housing is wonderfully inconsistent — a 1910 Avenues bungalow, a Sugar House cottage, a Liberty Wells four-square, and a downtown high-rise condo all clean completely differently. We adjust the checklist to the home instead of forcing every home through the same routine.",
      body: "Older SLC homes have character that needs care: original hardwood that wants a proper mop rather than a soaking, radiators and picture rails that collect a century's worth of dust, and grout in vintage bathrooms that deserves patience instead of harsh scraping. Newer condos and townhomes downtown are the opposite problem — compact spaces where kitchen grease and shower film build fast. Canyon winds push fine dust across the east benches most of the year, so our deep cleans in the city lean hard on window sills, tracks, blinds, and vents. English or Spanish, one-time or recurring — the price is flat and you'll see it before you book.",
      bullets: [
        "Century-home experience: hardwood, radiators, vintage tile, and trim-heavy rooms",
        "Condo and townhome cleans sized (and priced) for compact downtown spaces",
        "East-bench dust control: sills, tracks, vents, and blinds on every deep clean",
        "Flat-rate pricing you see online first — no hourly guessing for older homes"
      ]
    },
    m: {
      title: "Move-Out Cleaning in Salt Lake City, UT",
      intro: "Salt Lake City is a renter's town, and deposits here are real money. Our move-out clean covers the exact list property managers walk with — from U of U-area rentals to Sugar House apartments to downtown high-rise units.",
      body: "The difference between \"cleaned it myself\" and a professional move-out spec is what's inside things: the oven, the fridge, the cabinets, the closets, the medicine cabinet. That's where checkout inspections are won and lost, so it's the core of our spec — plus full descaling of tubs and showers that hard Utah water has been working on all lease long, interior windows, and wall-mark removal where paint allows. We finish with a photo walkthrough you can forward straight to your property manager. Handing off between tenants as a landlord? We do turnover cleans on a schedule, too."
    }
  },
  {
    slug: "south-jordan", name: "South Jordan",
    h: {
      title: "House Cleaning in South Jordan, UT",
      intro: "South Jordan homes trend big — Daybreak's master-planned streets and the newer builds east of Bangerter give us some of the largest floor plans in our service area. Big homes are exactly where flat-rate pricing earns its keep: you see your exact price online before we ever knock.",
      body: "A 3,000-square-foot Daybreak home is a different job than a valley average, and our pricing calculator accounts for it honestly — square footage, bedrooms, bathrooms, done. What stays the same is the checklist: every kitchen surface, every bathroom, every floor, signed by the crew lead before we leave. Lots of South Jordan families run recurring service with us because the same-crew model fits HOA-tidy neighborhoods where the standard is high and guests are frequent. And when the Oquirrh Lake breeze leaves a film of fine dust on shutters and stair rails, the deep clean resets it all.",
      bullets: [
        "Honest flat rates for larger floor plans — calculator-priced by square footage, not vibes",
        "Recurring service with the same crew, popular across Daybreak villages",
        "Deep cleans that handle plantation shutters, stair rails, and open-plan dust",
        "Two-story homes done fully: both levels, every bathroom, every time"
      ]
    },
    m: {
      title: "Move-Out Cleaning in South Jordan, UT",
      intro: "Between Daybreak turnover and new construction closings, South Jordan moves fast. Our move-out clean gets homes to walkthrough condition — and our move-IN clean gets brand-new or just-purchased homes actually clean before your boxes arrive.",
      body: "Selling or leaving a rental, we run the empty-home spec: inside every cabinet and closet, oven and fridge interiors, full bathroom descale, baseboards, interior windows, and a photo walkthrough for the file. Moving in, the job is different but just as real — builder dust from new construction hides in cabinet corners, window tracks, and vents long after the final walkthrough, and a pre-move-in clean is the only time your home will ever be this easy to detail. Either direction, you'll see a flat price on the calculator first."
    }
  },
  {
    slug: "sandy", name: "Sandy",
    h: {
      title: "House Cleaning in Sandy, UT",
      intro: "Sandy runs from established east-bench neighborhoods up against the Cottonwood canyons to newer family streets out west — and we clean across all of it. If your weekends belong to the canyons, the trail, or the slopes, the last thing they should belong to is a mop.",
      body: "East-bench Sandy homes deal with genuine canyon weather: spring winds that push grit onto every sill, winter road sand tracked into entryways, and mudroom floors that take a beating from November through April. Our standard clean keeps entry zones, kitchens, and bathrooms honest week to week; our deep clean goes after what the seasons leave behind — window tracks, blinds, baseboards, and the fine dust layer on everything above eye level. Families near Alta View and the South Town area use us most for bi-weekly service, same crew every visit, at a discounted flat rate.",
      bullets: [
        "Mudroom and entryway attention — built for ski-season grit and trail dust",
        "Deep cleans that reset window tracks and sills after canyon wind seasons",
        "Bi-weekly same-crew service popular with east-bench families",
        "Flat-rate pricing online in 30 seconds, no in-home estimate needed"
      ]
    },
    m: {
      title: "Move-Out Cleaning in Sandy, UT",
      intro: "Sandy rentals — from apartments near South Town to single-family homes on the bench — get inspected closely, and hard-water buildup is usually the line item that costs people. Our move-out spec descales everything before the walkthrough does.",
      body: "Utah water is hard, and Sandy showers show it: glass, fixtures, and tile all carry mineral film that a normal clean won't touch. Our move-out clean descales tubs, showers, and faucets, then runs the full empty-home list — inside cabinets, closets, oven, fridge, baseboards, interior windows, and wall scuffs where paint allows. You get a room-by-room photo record when we're done. Landlords between tenants: we also do turnover cleans on short notice when a unit needs to show well by the weekend."
    }
  },
  {
    slug: "riverton", name: "Riverton",
    h: {
      title: "House Cleaning in Riverton, UT",
      intro: "Riverton still has real yards — bigger lots, animals next door, gardens out back — and homes here live closer to the outdoors than most of the valley. More outdoors means more of it ends up on your floors, and that's where we come in.",
      body: "The homes we clean around Riverton City Park and the newer western streets share a pattern: hardworking kitchens, boot-traffic entryways, and floors that collect what big lots and busy kids bring inside. Our standard clean is built around exactly that — thorough floor work, kitchens, and bathrooms on a schedule that keeps up. Deep cleans add the once-a-season layer: baseboards, ceiling fans, blinds, vents, and the window sills that summer field dust loves. We're a bilingual, family-run crew based one city over in West Jordan, so Riverton scheduling is easy and the drive never inflates your price.",
      bullets: [
        "Floor-heavy standard cleans built for big-lot, in-and-out family living",
        "Seasonal deep cleans: fans, vents, blinds, sills, and baseboards reset",
        "Based next door in West Jordan — easy scheduling, no travel surcharge",
        "English/Spanish service from a family-run local crew"
      ]
    },
    m: {
      title: "Move-Out Cleaning in Riverton, UT",
      intro: "Riverton moves tend to be family-sized — bigger homes, more bedrooms, more closets, and a walkthrough that covers all of it. Our move-out clean runs the full empty-home spec so the handoff, sale, or deposit goes smoothly.",
      body: "More square footage means more places an inspection can snag: every closet shelf, every cabinet interior, the oven, the fridge, the under-sink cabinets, and bathroom fixtures carrying years of hard-water film. We work the list room by room, sign it, and photograph the results. Selling a family home you've lived in for a decade? A professional empty-house clean is the cheapest staging money can buy — buyers walk into rooms that smell neutral and shine at the corners. Tell us your closing or key-return date and we'll schedule backwards from it."
    }
  },
  {
    slug: "herriman", name: "Herriman",
    h: {
      title: "House Cleaning in Herriman, UT",
      intro: "Herriman is the newest corner of our service area — young neighborhoods, big new builds, and construction still active on the next street over. New homes are wonderful to live in and sneaky-hard to keep clean, because construction dust keeps arriving long after the builders leave.",
      body: "If your home is within a few years old, you already know: the fine white drywall-and-grading dust from nearby builds settles on ledges, blinds, and window tracks weekly. Our recurring cleans around Blackridge and Juniper Canyon keep it from ever accumulating, and our deep clean is the right reset if it already has. New builds also mean big glass, tall entries, and open-plan great rooms — we bring the extension dusters so ledges and high sills actually get cleaned instead of admired from below. Flat-rate pricing by square footage means your bigger new build is priced honestly, up front, online.",
      bullets: [
        "Construction-dust control for neighborhoods that are still building out",
        "High-reach dusting for tall entries, ledges, and open-plan great rooms",
        "Recurring schedules that keep new builds looking new",
        "Square-footage flat rates — see your exact price before booking"
      ]
    },
    m: {
      title: "Move-Out Cleaning in Herriman, UT",
      intro: "Herriman handoffs come in two flavors: leaving a rental or newer home you've outgrown, and moving INTO a just-finished build. We do both — the deposit-grade move-out spec, and the builder-dust move-in clean that new homes quietly need.",
      body: "For move-outs, we run the empty-home list end to end: cabinet and closet interiors, oven and fridge, full bathroom descale, baseboards, interior windows, and a photo walkthrough for your records. For move-ins, we chase what builders leave behind — drywall dust inside cabinets and closets, stickers and film residue, window tracks full of grit, and vents that blow fine powder the first month you run them. Booking the clean for the empty days between key exchange and moving truck is the single best-timed clean a home ever gets."
    }
  },
  {
    slug: "taylorsville", name: "Taylorsville",
    h: {
      title: "House Cleaning in Taylorsville, UT",
      intro: "Taylorsville is one of the valley's most established neighborhoods — solid brick ramblers and split-levels from the '70s and '80s that have hosted generations of families. Homes with that much history clean differently than new builds, and we clean a lot of them.",
      body: "Established homes come with real wood cabinets that want conditioning rather than stripping, textured ceilings that shed dust onto everything below, vintage tile and grout that reward patience, and basements that double the floor area people forget to count. Our crews work with the home's age instead of against it. Taylorsville's central location also makes it easy for us to schedule — we're minutes away, and many of our recurring customers here are longtime homeowners and multi-generation households who want the same trusted faces every visit, in English or Spanish.",
      bullets: [
        "Experience with established homes: wood cabinetry, vintage tile, textured ceilings",
        "Basement levels included in the flat rate — the whole home, not just the main floor",
        "Same trusted crew for recurring visits; bilingual service throughout",
        "Minutes from our West Jordan base — flexible weekly and bi-weekly slots"
      ]
    },
    m: {
      title: "Move-Out Cleaning in Taylorsville, UT",
      intro: "With one of the valley's biggest mixes of rentals, basement apartments, and long-held family homes, Taylorsville sees constant turnover — and every one of those handoffs goes better after a professional move-out clean.",
      body: "Rental deposits here hinge on the classics: oven interiors, fridge interiors, bathroom mineral buildup, and the cabinet and closet interiors people run out of energy for on moving day. That's the core of our spec, along with baseboards, interior windows, blinds, and scuff removal. Older homes get extra attention where decades of living show — grout lines, cabinet shelf liner residue, and utility rooms. We finish with photos, room by room. Landlords with a unit to turn: we can usually fit Taylorsville turnovers within the week."
    }
  },
  {
    slug: "murray", name: "Murray",
    h: {
      title: "House Cleaning in Murray, UT",
      intro: "Murray sits at the crossroads of the whole valley — and its housing shows it: original mid-century cottages near Murray Park, brand-new townhomes along the TRAX line, and everything in between. Whatever you live in, the price is flat and you'll see it before you book.",
      body: "Murray's mix is why our pricing calculator asks about your actual home instead of guessing: a two-bed townhome near Fireclay and a four-bed family home off Vine Street are different jobs, priced honestly by size and rooms. Busy medical-community schedules around Intermountain Medical Center make recurring service popular here — homes that reset on a bi-weekly rhythm without anyone having to think about it. Standard cleans keep kitchens, bathrooms, and floors on schedule; deep cleans reset blinds, baseboards, vents, and the window film that valley-center traffic slowly deposits.",
      bullets: [
        "Fair, size-based flat rates across Murray's cottage-to-townhome housing mix",
        "Bi-weekly autopilot cleans popular with hospital-schedule households",
        "Deep cleans for valley-center window film, blinds, and vents",
        "Townhome and condo cleans priced for compact spaces — no minimum-size penalty"
      ]
    },
    m: {
      title: "Move-Out Cleaning in Murray, UT",
      intro: "Murray's townhome and apartment turnover is constant — Fireclay, the TRAX corridor, and the complexes around the medical campus hand keys back every month. Our move-out clean is built to pass those inspections the first time.",
      body: "Property managers in newer Murray complexes work from tight checklists, and ours mirrors them: appliance interiors, cabinet and closet interiors, full bathroom descale, baseboards, blinds, interior windows, and scuff removal. Compact units don't take us long, and the flat rate reflects that — you're not paying a house price for a two-bedroom walkthrough. Leaving one of Murray's older cottages instead? The same spec applies, with extra care for original cabinets and tile. Photos at the end, deposit conversation made easy."
    }
  }
];

/* Structured data: breadcrumb trail + the specific service offered here.
   Helps Google understand each page and can enrich the search listing. */
function structuredData(c, type) {
  var base = "https://miguelcaudillo.github.io/ClearSpace";
  var isHouse = type === "house";
  var pageUrl = base + "/areas/" + type + "-cleaning-" + c.slug + ".html";
  var serviceName = (isHouse ? "House Cleaning" : "Move-Out Cleaning") + " in " + c.name;
  var data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": base + "/" },
          { "@type": "ListItem", "position": 2, "name": "Service areas", "item": base + "/#areas" },
          { "@type": "ListItem", "position": 3, "name": c.name, "item": pageUrl }
        ]
      },
      {
        "@type": "Service",
        "serviceType": serviceName,
        "provider": { "@type": "HouseCleaningService", "name": "ClearSpace Home Cleaning", "telephone": "(801) 433-7342", "areaServed": c.name + ", UT" },
        "areaServed": { "@type": "City", "name": c.name + ", Utah" },
        "url": pageUrl,
        "availableLanguage": ["English", "Spanish"]
      }
    ]
  };
  return '<script type="application/ld+json">\n' + JSON.stringify(data) + "\n</script>\n";
}

/* ---------- Template ---------- */
function head(title, desc, extraHead) {
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
  "<title>" + title + " — ClearSpace Home Cleaning</title>\n" +
  '<meta name="description" content="' + desc + '">\n' +
  '<meta name="theme-color" content="#059669">\n' +
  '<meta property="og:type" content="website">\n' +
  '<meta property="og:site_name" content="ClearSpace Home Cleaning">\n' +
  '<meta property="og:title" content="' + title + '">\n' +
  '<meta property="og:description" content="' + desc + '">\n' +
  '<meta property="og:image" content="https://miguelcaudillo.github.io/ClearSpace/assets/img/og-image.jpg">\n' +
  '<meta name="twitter:card" content="summary_large_image">\n' +
  '<meta name="twitter:image" content="https://miguelcaudillo.github.io/ClearSpace/assets/img/og-image.jpg">\n' +
  '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Crect width=\'100\' height=\'100\' rx=\'24\' fill=\'%23059669\'/%3E%3Ctext x=\'50\' y=\'68\' font-size=\'52\' text-anchor=\'middle\' fill=\'white\' font-family=\'Arial\'%3E%E2%9C%A6%3C/text%3E%3C/svg%3E">\n' +
  '<link rel="stylesheet" href="../assets/site.css">\n' +
  (extraHead || "") +
  '</head>\n<body>\n' +
  '<header class="site-header"><div class="wrap header-in">\n' +
  '<a href="../index.html" class="brand"><span class="brand-mark">✦</span><span>Clear<b>Space</b><i class="brand-sub">HOME CLEANING</i></span></a>\n' +
  '<nav class="header-nav"><a href="../index.html#services" class="hide-m">Services</a><a href="../index.html#areas" class="hide-m">Areas</a><a href="../pricing.html" class="hide-m">Pricing</a>' +
  '<a class="btn btn-primary btn-sm" href="../index.html#quote">Free quote</a></nav>\n' +
  "</div></header>\n";
}

var FOOT = '\n<footer class="site-footer"><div class="wrap foot-in">' +
  '<a href="../index.html" class="brand"><span class="brand-mark">✦</span><span>Clear<b>Space</b></span></a>' +
  "<p>© 2026 ClearSpace Home Cleaning · West Jordan, UT</p></div></footer>\n" +
  '<script src="../pricing-config.js"></script><script src="../assets/site.js"></script>\n</body>\n</html>\n';

var CTA = '<div class="cta-band" style="margin:50px 0">' +
  "<h2>See your exact price in 30 seconds</h2>" +
  "<p>Flat-rate, no phone call needed — adjust size, rooms, and frequency and watch the price update.</p>" +
  '<a class="btn btn-primary" href="../pricing.html">Open the price calculator →</a></div>';

function pricesRow() {
  return '<div class="badge-row" style="margin:22px 0">' +
    '<span class="trust-badge">🧹 Standard from <b>&nbsp;<span data-price-from="standard">$—</span></b></span>' +
    '<span class="trust-badge">✨ Deep from <b>&nbsp;<span data-price-from="deep">$—</span></b></span>' +
    '<span class="trust-badge">📦 Move-out from <b>&nbsp;<span data-price-from="moveout">$—</span></b></span>' +
    '<span class="trust-badge">🔁 Recurring save up to <b>&nbsp;<span data-max-discount>—</span></b></span></div>';
}

/* Internal-linking block: links to the other cities' pages of the same type.
   Good for SEO (crawl depth) and keeps visitors moving between areas. */
function nearby(current, type) {
  var others = CITIES.filter(function (x) { return x.slug !== current.slug; });
  var links = others.map(function (x) {
    return '<a class="area-chip" href="' + type + '-cleaning-' + x.slug + '.html"><span>📍</span>' + x.name + "</a>";
  }).join("");
  var label = type === "house" ? "House cleaning nearby" : "Move-out cleaning nearby";
  return '<h2>' + label + "</h2><div class=\"area-grid\" style=\"margin-bottom:50px\">" + links + "</div>";
}

function housePage(c) {
  var desc = "Flat-rate house cleaning in " + c.name + ", Utah. Standard, deep, and recurring cleaning from a local bilingual crew. See your exact price online.";
  var bullets = c.h.bullets.map(function (b) { return "<li>" + b + "</li>"; }).join("");
  return head(c.h.title, desc, structuredData(c, "house")) +
    '<div class="wrap prose">' +
    '<p class="breadcrumb"><a href="../index.html">Home</a> › <a href="../index.html#areas">Service areas</a> › ' + c.name + "</p>" +
    "<h1>" + c.h.title + "</h1>" +
    "<p><b>" + c.h.intro + "</b></p>" +
    pricesRow() +
    "<p>" + c.h.body + "</p>" +
    "<h2>Why " + c.name + " homes choose ClearSpace</h2><ul>" + bullets + "</ul>" +
    "<h2>Every clean, guaranteed</h2>" +
    "<p>Every visit follows a written room-by-room checklist signed by the crew lead, service is available in English and Spanish, and if anything isn't right we re-clean it free within 48 hours. Prefer to talk it through? <a href='../index.html#quote'>Request a free quote</a> and we'll reply the same day.</p>" +
    CTA +
    '<p style="margin-bottom:34px">Moving instead? See our <a href="move-out-cleaning-' + c.slug + '.html">move-out cleaning in ' + c.name + "</a>, or explore all our <a href='../index.html#areas'>Salt Lake valley service areas</a>.</p>" +
    nearby(c, "house") +
    "</div>" + FOOT;
}

function movePage(c) {
  var desc = "Deposit-grade move-out and move-in cleaning in " + c.name + ", Utah. Inside cabinets, appliances, and closets — with a photo walkthrough. Flat-rate pricing online.";
  return head(c.m.title, desc, structuredData(c, "move-out")) +
    '<div class="wrap prose">' +
    '<p class="breadcrumb"><a href="../index.html">Home</a> › <a href="../index.html#areas">Service areas</a> › ' + c.name + "</p>" +
    "<h1>" + c.m.title + "</h1>" +
    "<p><b>" + c.m.intro + "</b></p>" +
    pricesRow() +
    "<p>" + c.m.body + "</p>" +
    "<h2>What the move-out spec covers</h2>" +
    "<ul><li>Inside all cabinets, drawers, and closets</li><li>Inside the oven and refrigerator</li><li>Full bathroom descale — tub, shower, glass, and fixtures</li><li>Baseboards, doors, frames, and switch plates</li><li>Interior windows, sills, tracks, and blinds</li><li>Wall scuff removal where paint allows</li><li>All floors vacuumed, mopped, and corner-detailed</li><li>Room-by-room photo walkthrough when we finish</li></ul>" +
    CTA +
    '<p style="margin-bottom:34px">Staying put? See our <a href="house-cleaning-' + c.slug + '.html">house cleaning in ' + c.name + "</a> for standard, deep, and recurring service.</p>" +
    nearby(c, "move-out") +
    "</div>" + FOOT;
}

var count = 0;
CITIES.forEach(function (c) {
  fs.writeFileSync(path.join(OUT, "house-cleaning-" + c.slug + ".html"), housePage(c));
  fs.writeFileSync(path.join(OUT, "move-out-cleaning-" + c.slug + ".html"), movePage(c));
  count += 2;
});
console.log("Built " + count + " area pages in " + OUT);
