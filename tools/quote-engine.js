#!/usr/bin/env node
/* =====================================================================
   ClearSpace — Quote & Customer-Comms Engine
   =====================================================================
   Turns a lead into ready-to-send messages, in four flavors each:
   SMS + email, English + Spanish.

   Message types:
     quote        — personalized price quote
     confirmation — booking confirmed
     reminder     — day-before reminder
     review       — post-clean review request

   ALL dollar amounts come from ../pricing-config.js — edit rates there,
   never in this file.

   Usage:
     node tools/quote-engine.js            → runs the 3 built-in sample leads
     node tools/quote-engine.js lead.json  → runs a lead from a JSON file

   A lead looks like:
     { "name": "Sarah", "sqft": 1800, "bedrooms": 3, "bathrooms": 2,
       "service": "deep", "frequency": "onetime", "city": "West Jordan",
       "addons": ["oven"], "date": "July 24", "window": "9:00–11:00 AM" }
   ===================================================================== */
"use strict";

var cfg = require("../pricing-config.js");
var CONFIG = cfg.CLEARSPACE_CONFIG;
var quoteFor = cfg.clearspaceQuote;
var BIZ = CONFIG.business;

function usd(n) { return "$" + n; }
function firstName(name) { return String(name || "").trim().split(/\s+/)[0] || "there"; }

/* Frequency phrasing used inside sentences. */
var FREQ_PHRASE = {
  onetime:  { en: "one-time",   es: "una sola vez" },
  weekly:   { en: "weekly",     es: "semanal" },
  biweekly: { en: "bi-weekly",  es: "quincenal" },
  monthly:  { en: "monthly",    es: "mensual" }
};

function addonList(q, lang) {
  return q.addons.map(function (a) { return a[lang] + " (" + usd(a.price) + ")"; }).join(", ");
}

/* ---------- 1. QUOTE ---------- */
function quoteMessages(lead) {
  var q = quoteFor(lead);
  var fn = firstName(lead.name);
  var freqEn = (FREQ_PHRASE[lead.frequency] || FREQ_PHRASE.onetime).en;
  var freqEs = (FREQ_PHRASE[lead.frequency] || FREQ_PHRASE.onetime).es;
  var recurring = q.discountPct > 0;

  var breakdownEn =
    "  " + q.service.en + " base: " + usd(q.base) + "\n" +
    (q.sqftAdd ? "  Home size (" + lead.sqft + " sq ft): +" + usd(q.sqftAdd) + "\n" : "") +
    (q.bedAdd ? "  Extra bedrooms: +" + usd(q.bedAdd) + "\n" : "") +
    (q.bathAdd ? "  Extra bathrooms: +" + usd(q.bathAdd) + "\n" : "") +
    (q.addonTotal ? "  Add-ons — " + addonList(q, "en") + "\n" : "") +
    (recurring ? "  " + q.frequency.en + " discount (" + Math.round(q.discountPct * 100) + "%): −" + usd(q.discount) + "\n" : "") +
    "  Total per visit: " + usd(q.total);

  var breakdownEs =
    "  " + q.service.es + " base: " + usd(q.base) + "\n" +
    (q.sqftAdd ? "  Tamaño del hogar (" + lead.sqft + " pies²): +" + usd(q.sqftAdd) + "\n" : "") +
    (q.bedAdd ? "  Recámaras adicionales: +" + usd(q.bedAdd) + "\n" : "") +
    (q.bathAdd ? "  Baños adicionales: +" + usd(q.bathAdd) + "\n" : "") +
    (q.addonTotal ? "  Extras — " + addonList(q, "es") + "\n" : "") +
    (recurring ? "  Descuento " + q.frequency.es.toLowerCase() + " (" + Math.round(q.discountPct * 100) + "%): −" + usd(q.discount) + "\n" : "") +
    "  Total por visita: " + usd(q.total);

  return {
    total: q.total,
    sms_en: "Hi " + fn + ", it's " + BIZ.name + "! For your " + lead.bedrooms + " bed / " + lead.bathrooms +
      " bath home in " + lead.city + " (" + lead.sqft + " sq ft), a " + freqEn + " " + q.service.en.toLowerCase() +
      " comes to " + usd(q.total) + " per visit" + (recurring ? " (that includes your " + Math.round(q.discountPct * 100) + "% " + freqEn + " discount)" : "") +
      ". Want to grab a day this week? Reply YES and we'll get you scheduled. – " + BIZ.name + " " + BIZ.phone,
    sms_es: "Hola " + fn + ", ¡somos " + BIZ.name + "! Para su hogar de " + lead.bedrooms + " recámaras / " + lead.bathrooms +
      " baños en " + lead.city + " (" + lead.sqft + " pies²), una " + q.service.es.toLowerCase() + " " + freqEs +
      " le queda en " + usd(q.total) + " por visita" + (recurring ? " (ya incluye su descuento " + freqEs + " del " + Math.round(q.discountPct * 100) + "%)" : "") +
      ". ¿Le gustaría agendar esta semana? Responda SÍ y le apartamos su día. – " + BIZ.name + " " + BIZ.phone,
    email_subject_en: "Your ClearSpace quote: " + usd(q.total) + " per visit",
    email_en: "Hi " + fn + ",\n\n" +
      "Thanks for reaching out to " + BIZ.name + "! Here's your personalized quote for your home in " + lead.city + ":\n\n" +
      breakdownEn + "\n\n" +
      "That price is flat — no hourly surprises, and it includes our full room-by-room checklist " +
      "(kitchen, bathrooms, bedrooms, floors, and a final walkthrough).\n\n" +
      "Ready to pick a day? Just reply to this email or text us at " + BIZ.phone +
      " and we'll find a time that works for you.\n\n" +
      "You can also fine-tune your estimate anytime here: " + BIZ.bookingUrl + "\n\n" +
      "Talk soon,\n" + BIZ.name + "\n" + BIZ.phone + " · " + BIZ.email,
    email_subject_es: "Su cotización de ClearSpace: " + usd(q.total) + " por visita",
    email_es: "Hola " + fn + ":\n\n" +
      "¡Gracias por contactar a " + BIZ.name + "! Aquí está su cotización personalizada para su hogar en " + lead.city + ":\n\n" +
      breakdownEs + "\n\n" +
      "El precio es fijo — sin sorpresas por hora, e incluye nuestra lista completa cuarto por cuarto " +
      "(cocina, baños, recámaras, pisos y un recorrido final).\n\n" +
      "¿Le gustaría elegir un día? Responda a este correo o envíenos un mensaje al " + BIZ.phone +
      " y encontramos el horario que mejor le convenga.\n\n" +
      "También puede ajustar su estimado cuando guste aquí: " + BIZ.bookingUrl + "\n\n" +
      "Hasta pronto,\n" + BIZ.name + "\n" + BIZ.phone + " · " + BIZ.email
  };
}

/* ---------- 2. BOOKING CONFIRMATION ---------- */
function confirmationMessages(lead) {
  var q = quoteFor(lead);
  var fn = firstName(lead.name);
  var date = lead.date || "[DATE]";
  var win = lead.window || "[ARRIVAL WINDOW]";

  return {
    sms_en: "You're booked, " + fn + "! 🎉 " + q.service.en + " on " + date + ", arrival window " + win +
      ". Total: " + usd(q.total) + ". We'll text you the day before to confirm. Need to change anything? Just reply here. – " + BIZ.name,
    sms_es: "¡Su cita está confirmada, " + fn + "! 🎉 " + q.service.es + " el " + date + ", ventana de llegada " + win +
      ". Total: " + usd(q.total) + ". Le escribimos un día antes para confirmar. ¿Necesita cambiar algo? Responda a este mensaje. – " + BIZ.name,
    email_subject_en: "Booking confirmed — " + q.service.en + " on " + date,
    email_en: "Hi " + fn + ",\n\n" +
      "Your cleaning is officially on the calendar. Here are the details:\n\n" +
      "  Service: " + q.service.en + "\n" +
      "  Date: " + date + "\n" +
      "  Arrival window: " + win + "\n" +
      "  Total: " + usd(q.total) + "\n\n" +
      "Before we arrive:\n" +
      "  • Please secure any pets that aren't comfortable with visitors.\n" +
      "  • Let us know about gate codes, parking, or entry instructions.\n" +
      "  • Picking up loose items ahead of time lets us spend every minute cleaning.\n\n" +
      "Need to reschedule? Reply to this email or text " + BIZ.phone + " — no fees, we just appreciate a heads-up.\n\n" +
      "See you soon,\n" + BIZ.name,
    email_subject_es: "Cita confirmada — " + q.service.es + " el " + date,
    email_es: "Hola " + fn + ":\n\n" +
      "Su limpieza ya está en el calendario. Estos son los detalles:\n\n" +
      "  Servicio: " + q.service.es + "\n" +
      "  Fecha: " + date + "\n" +
      "  Ventana de llegada: " + win + "\n" +
      "  Total: " + usd(q.total) + "\n\n" +
      "Antes de que lleguemos:\n" +
      "  • Por favor asegure a las mascotas que no se sientan cómodas con visitas.\n" +
      "  • Avísenos de códigos de portón, estacionamiento o instrucciones de entrada.\n" +
      "  • Recoger objetos sueltos con anticipación nos permite dedicar cada minuto a limpiar.\n\n" +
      "¿Necesita reagendar? Responda a este correo o mande mensaje al " + BIZ.phone + " — sin cargos, solo agradecemos el aviso.\n\n" +
      "Nos vemos pronto,\n" + BIZ.name
  };
}

/* ---------- 3. DAY-BEFORE REMINDER ---------- */
function reminderMessages(lead) {
  var q = quoteFor(lead);
  var fn = firstName(lead.name);
  var date = lead.date || "[DATE]";
  var win = lead.window || "[ARRIVAL WINDOW]";

  return {
    sms_en: "Hi " + fn + "! Friendly reminder: your " + q.service.en.toLowerCase() + " is tomorrow, " + date +
      ", arrival window " + win + ". Reply C to confirm or R to reschedule. See you soon! – " + BIZ.name,
    sms_es: "¡Hola " + fn + "! Recordatorio: su " + q.service.es.toLowerCase() + " es mañana, " + date +
      ", ventana de llegada " + win + ". Responda C para confirmar o R para reagendar. ¡Hasta mañana! – " + BIZ.name,
    email_subject_en: "See you tomorrow — " + q.service.en + " reminder",
    email_en: "Hi " + fn + ",\n\n" +
      "Just a reminder that your " + q.service.en + " is tomorrow, " + date + ", with an arrival window of " + win + ".\n\n" +
      "Quick checklist to get the most out of your clean:\n" +
      "  • Clear counters and floors of personal items where you can.\n" +
      "  • Secure pets that prefer their space.\n" +
      "  • Leave entry instructions if you won't be home.\n\n" +
      "Anything come up? Reply here or text " + BIZ.phone + " and we'll sort it out.\n\n" +
      "See you tomorrow,\n" + BIZ.name,
    email_subject_es: "Nos vemos mañana — recordatorio de su " + q.service.es.toLowerCase(),
    email_es: "Hola " + fn + ":\n\n" +
      "Le recordamos que su " + q.service.es + " es mañana, " + date + ", con ventana de llegada de " + win + ".\n\n" +
      "Lista rápida para aprovechar al máximo su limpieza:\n" +
      "  • Despeje superficies y pisos de objetos personales donde pueda.\n" +
      "  • Asegure a las mascotas que prefieren su espacio.\n" +
      "  • Deje instrucciones de entrada si no estará en casa.\n\n" +
      "¿Surgió algo? Responda aquí o mande mensaje al " + BIZ.phone + " y lo resolvemos.\n\n" +
      "Hasta mañana,\n" + BIZ.name
  };
}

/* ---------- 4. POST-CLEAN REVIEW REQUEST ---------- */
function reviewMessages(lead) {
  var fn = firstName(lead.name);
  return {
    sms_en: "Hi " + fn + ", thanks for letting us clean your home today! If anything isn't perfect, tell us and we'll make it right. " +
      "And if you loved it, a quick Google review would mean the world to our small business: " + BIZ.reviewUrl + " 💚 – " + BIZ.name,
    sms_es: "Hola " + fn + ", ¡gracias por dejarnos limpiar su hogar hoy! Si algo no quedó perfecto, díganos y lo corregimos. " +
      "Y si le encantó, una breve reseña en Google significaría muchísimo para nuestro pequeño negocio: " + BIZ.reviewUrl + " 💚 – " + BIZ.name,
    email_subject_en: "How did we do today?",
    email_en: "Hi " + fn + ",\n\n" +
      "Thank you for trusting " + BIZ.name + " with your home today — we hope walking in felt amazing.\n\n" +
      "Two quick things:\n" +
      "  1. If ANYTHING isn't up to standard, reply to this email within 48 hours and we'll come back and re-clean it, free.\n" +
      "  2. If you're happy, would you take 60 seconds to leave us a Google review? As a new local business, every single one helps neighbors find us:\n     " + BIZ.reviewUrl + "\n\n" +
      "Thanks again — it was a pleasure.\n\n" + BIZ.name + "\n" + BIZ.phone,
    email_subject_es: "¿Cómo quedó su hogar hoy?",
    email_es: "Hola " + fn + ":\n\n" +
      "Gracias por confiarle su hogar a " + BIZ.name + " — esperamos que al entrar se haya sentido increíble.\n\n" +
      "Dos cosas rápidas:\n" +
      "  1. Si ALGO no quedó a la altura, responda a este correo dentro de 48 horas y regresamos a re-limpiarlo sin costo.\n" +
      "  2. Si quedó contento, ¿nos regalaría 60 segundos para dejarnos una reseña en Google? Como negocio local nuevo, cada una nos ayuda a que más vecinos nos encuentren:\n     " + BIZ.reviewUrl + "\n\n" +
      "Gracias de nuevo — fue un placer.\n\n" + BIZ.name + "\n" + BIZ.phone
  };
}

function allMessages(lead) {
  return {
    lead: lead,
    quote: quoteMessages(lead),
    confirmation: confirmationMessages(lead),
    reminder: reminderMessages(lead),
    review: reviewMessages(lead)
  };
}

module.exports = { quoteMessages: quoteMessages, confirmationMessages: confirmationMessages,
  reminderMessages: reminderMessages, reviewMessages: reviewMessages, allMessages: allMessages };

/* ---------- CLI ---------- */
if (require.main === module) {
  var fs = require("fs");
  var leads;
  if (process.argv[2]) {
    leads = [JSON.parse(fs.readFileSync(process.argv[2], "utf8"))];
  } else {
    leads = [
      { name: "Sarah Jensen", sqft: 1800, bedrooms: 3, bathrooms: 2, service: "deep",
        frequency: "onetime", city: "West Jordan", addons: ["oven"], date: "Thursday, July 24", window: "9:00–11:00 AM" },
      { name: "Luis Ramírez", sqft: 1200, bedrooms: 2, bathrooms: 1, service: "standard",
        frequency: "biweekly", city: "Taylorsville", addons: [], date: "Monday, July 28", window: "1:00–3:00 PM" },
      { name: "Amber Whitfield", sqft: 2600, bedrooms: 4, bathrooms: 3, service: "moveout",
        frequency: "onetime", city: "Sandy", addons: ["fridge", "oven", "cabinets"], date: "Saturday, July 26", window: "8:00–10:00 AM" }
    ];
  }

  leads.forEach(function (lead, i) {
    var m = allMessages(lead);
    var head = "LEAD " + (i + 1) + ": " + lead.name + " — " + lead.city + " — " +
      lead.bedrooms + "bd/" + lead.bathrooms + "ba, " + lead.sqft + " sq ft — " +
      lead.service + " / " + lead.frequency + (lead.addons.length ? " — add-ons: " + lead.addons.join(", ") : "");
    console.log("\n" + "=".repeat(78) + "\n" + head + "\n" + "=".repeat(78));
    [["QUOTE", m.quote], ["BOOKING CONFIRMATION", m.confirmation],
     ["DAY-BEFORE REMINDER", m.reminder], ["REVIEW REQUEST", m.review]].forEach(function (pair) {
      console.log("\n––– " + pair[0] + " –––");
      var msg = pair[1];
      console.log("\n[SMS · EN]\n" + msg.sms_en);
      console.log("\n[SMS · ES]\n" + msg.sms_es);
      console.log("\n[EMAIL · EN] Subject: " + msg.email_subject_en + "\n" + msg.email_en);
      console.log("\n[EMAIL · ES] Subject: " + msg.email_subject_es + "\n" + msg.email_es);
    });
  });
}
