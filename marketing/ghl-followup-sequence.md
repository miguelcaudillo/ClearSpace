# ClearSpace — GoHighLevel 30-Day Follow-Up System

Paste-ready copy for GHL workflows. Conventions used throughout:

- **Merge fields** use GHL syntax: `{{contact.first_name}}`, `{{contact.city}}`. Replace `[QUOTE TOTAL]`, `[DATE]`, `[WINDOW]` with your GHL custom fields once created (suggested custom fields: `quote_total`, `service_type`, `appt_date`, `appt_window`).
- **Never type prices by hand** — the quote total should always come from the calculator / quote engine (`pricing-config.js` rates) stored into the `quote_total` custom field.
- **Language:** create a contact field `preferred_language` (en/es) and branch each workflow on it. Both versions are provided for every message.
- **Quiet hours:** set workflow settings to send 9:00 AM–7:00 PM contact time.
- **Stop conditions:** every workflow should have "remove from workflow when: replies / books / is added to Booked workflow."

---

## WORKFLOW 1 — NEW LEAD (trigger: form submission or new contact)

**Goal:** respond fast, deliver the quote, get a reply. Speed-to-lead is everything — the first message fires within 5 minutes.

### Day 0 — immediately (SMS)
- **EN:** Hi {{contact.first_name}}, this is ClearSpace Home Cleaning — thanks for your quote request! I'm putting your exact price together now and will text it over shortly. Anything special you'd like us to know about your home in the meantime?
- **ES:** Hola {{contact.first_name}}, somos ClearSpace Home Cleaning — ¡gracias por pedir su cotización! Estoy preparando su precio exacto y se lo mando en un momento. ¿Hay algo especial que quiera contarnos de su hogar mientras tanto?

### Day 0 — within 1 hour (SMS: the quote)
> Generate the body with `tools/quote-engine.js` (quote → SMS) or paste from the app, storing the number in `quote_total`.
- **EN:** {{contact.first_name}}, here's your ClearSpace quote: **$[QUOTE TOTAL] per visit**, flat rate, for your home in {{contact.city}}. That includes our full room-by-room checklist and satisfaction guarantee. Want to grab a day this week? Reply YES and I'll send available times.
- **ES:** {{contact.first_name}}, aquí está su cotización de ClearSpace: **$[QUOTE TOTAL] por visita**, precio fijo, para su hogar en {{contact.city}}. Incluye nuestra lista completa cuarto por cuarto y garantía de satisfacción. ¿Quiere agendar esta semana? Responda SÍ y le mando los horarios disponibles.

### Day 0 — 2 hours after quote (Email: the quote, long form)
Use the **email version from `tools/quote-engine.js`** (subject: "Your ClearSpace quote: $[QUOTE TOTAL] per visit" / "Su cotización de ClearSpace: $[QUOTE TOTAL] por visita"). It contains the full line-item breakdown.

*Contact replied? → remove from this workflow, handle conversation, then add to Quote Sent or Booked as appropriate.*
*No response after Day 0 → move to Workflow 2.*

---

## WORKFLOW 2 — NO RESPONSE (trigger: 24h in Workflow 1 with no reply)

**Goal:** stay useful, never desperate. Value on every touch; spacing widens over 30 days.

### Day 1 (SMS)
- **EN:** Hi {{contact.first_name}}, just making sure my quote reached you — $[QUOTE TOTAL] per visit for your home. Happy to adjust it if I got the size or rooms wrong. Any questions I can answer?
- **ES:** Hola {{contact.first_name}}, solo confirmo que le llegó mi cotización — $[QUOTE TOTAL] por visita para su hogar. Con gusto la ajusto si me equivoqué en el tamaño o los cuartos. ¿Le puedo responder alguna duda?

### Day 3 (Email) — objection: "is it worth it?"
- **Subject EN:** What your ClearSpace clean actually includes
- **EN:** Hi {{contact.first_name}}, quick note in case it helps you decide — every ClearSpace visit runs a written room-by-room checklist: kitchen (counters, sink, stovetop, appliance fronts, floors), every bathroom (toilet, shower, mirrors, floors), all bedrooms (dusting, beds, floors), plus whole-home vacuum, mop, and trash-out. The crew lead signs the checklist before leaving, and if anything's not right we re-clean it free within 48 hours. Your quote is still good: $[QUOTE TOTAL] per visit. Want me to hold a spot this week? — ClearSpace
- **Subject ES:** Lo que realmente incluye su limpieza de ClearSpace
- **ES:** Hola {{contact.first_name}}, una nota rápida por si le ayuda a decidir — cada visita de ClearSpace sigue una lista escrita cuarto por cuarto: cocina (superficies, fregadero, estufa, frentes de electrodomésticos, pisos), cada baño (sanitario, ducha, espejos, pisos), todas las recámaras (polvo, camas, pisos), más aspirado, trapeado y basura fuera en toda la casa. El líder del equipo firma la lista antes de irse, y si algo no queda bien, lo re-limpiamos gratis dentro de 48 horas. Su cotización sigue vigente: $[QUOTE TOTAL] por visita. ¿Le aparto un lugar esta semana? — ClearSpace

### Day 5 (SMS)
- **EN:** {{contact.first_name}}, we had a cancellation open up this week — want it? First come, first served. Your quote of $[QUOTE TOTAL] still stands. – ClearSpace
  *(Only send if true — delete this step if you don't have an opening.)*
- **ES:** {{contact.first_name}}, se nos abrió un espacio esta semana por una cancelación — ¿lo quiere? Es por orden de llegada. Su cotización de $[QUOTE TOTAL] sigue vigente. – ClearSpace
  *(Enviar solo si es verdad — borre este paso si no hay espacio.)*

### Day 8 (Email) — social proof / new-business honesty
- **Subject EN:** The two questions everyone asks us
- **EN:** Hi {{contact.first_name}} — the two questions we hear most: "Are you insured?" (yes — licensed and insured) and "Will it be the same people every time?" (yes — recurring homes keep their crew, so they learn exactly how you like things). We're a local West Jordan family business, and we win customers by being easy to reach and easy to trust. If the timing's just not right yet, no pressure — your quote is saved whenever you're ready. — ClearSpace, [YOUR PHONE]
- **Subject ES:** Las dos preguntas que todos nos hacen
- **ES:** Hola {{contact.first_name}} — las dos preguntas que más escuchamos: "¿Tienen seguro?" (sí — con licencia y asegurados) y "¿Será la misma gente cada vez?" (sí — los hogares recurrentes conservan su equipo, así aprenden exactamente cómo le gusta todo). Somos un negocio familiar local de West Jordan, y ganamos clientes siendo fáciles de contactar y dignos de confianza. Si aún no es el momento, sin presión — su cotización queda guardada para cuando esté listo. — ClearSpace, [YOUR PHONE]

### Day 12 (SMS)
- **EN:** Hi {{contact.first_name}}! Quick one: most of our new customers start with a one-time deep clean to see our work, then switch to bi-weekly at a discount. Want me to price that path for you? – ClearSpace
- **ES:** ¡Hola {{contact.first_name}}! Algo rápido: la mayoría de nuestros clientes nuevos empiezan con una limpieza profunda única para conocer nuestro trabajo, y luego cambian a quincenal con descuento. ¿Le preparo ese plan con precios? – ClearSpace

### Day 18 (Email) — seasonal/practical angle
- **Subject EN:** One less thing on the weekend list
- **EN:** {{contact.first_name}}, quick math we share with busy families: a full house clean is 3–5 hours of your weekend, every weekend. That's the actual product we sell — your Saturday back. If you'd like to try us once with zero commitment, your quote of $[QUOTE TOTAL] is still active. Reply and we'll set it up. — ClearSpace
- **Subject ES:** Una cosa menos en la lista del fin de semana
- **ES:** {{contact.first_name}}, una cuenta rápida que compartimos con familias ocupadas: limpiar toda la casa son 3–5 horas de su fin de semana, cada fin de semana. Eso es lo que realmente vendemos — recuperar su sábado. Si quiere probarnos una vez sin compromiso, su cotización de $[QUOTE TOTAL] sigue activa. Responda y lo agendamos. — ClearSpace

### Day 25 (SMS)
- **EN:** Hi {{contact.first_name}}, ClearSpace here one last time — I don't want to clutter your phone. If cleaning help would still be useful, just reply anytime and your quote is waiting. Either way, thanks for considering a small local business. 💚
- **ES:** Hola {{contact.first_name}}, ClearSpace por última vez — no quiero llenarle el teléfono. Si todavía le sirve ayuda con la limpieza, responda cuando guste y su cotización lo estará esperando. De cualquier forma, gracias por considerar a un pequeño negocio local. 💚

### Day 30 (automation)
Tag contact `cold-lead`, remove from workflow, add to a monthly newsletter/offers list (if you run one). **Do not keep texting.**

---

## WORKFLOW 3 — QUOTE SENT, WARM (trigger: contact replied with interest but hasn't booked)

### +1 day (SMS)
- **EN:** Hi {{contact.first_name}}! Still have your spot options open — want me to pencil you in for [DATE OPTION 1] or [DATE OPTION 2]? Whichever's easier.
- **ES:** ¡Hola {{contact.first_name}}! Todavía tengo espacios disponibles — ¿le aparto el [DATE OPTION 1] o el [DATE OPTION 2]? El que le quede mejor.

### +3 days (SMS)
- **EN:** {{contact.first_name}}, no rush at all — just keeping your quote of $[QUOTE TOTAL] warm. If this week filled up on you, I can look at next week too.
- **ES:** {{contact.first_name}}, sin ninguna prisa — solo mantengo activa su cotización de $[QUOTE TOTAL]. Si esta semana se le complicó, también puedo ver la próxima.

### +7 days → move to Workflow 2 at Day 8 step.

---

## WORKFLOW 4 — BOOKED (trigger: appointment created)

### Immediately (SMS + Email)
Use the **booking confirmation** messages from `tools/quote-engine.js` (SMS + email, EN/ES). Include date `[DATE]`, window `[WINDOW]`, total `$[QUOTE TOTAL]`.

### Day before appointment, 5:00 PM (SMS)
Use the **day-before reminder** from `tools/quote-engine.js`:
- **EN:** Hi {{contact.first_name}}! Friendly reminder: your clean is tomorrow, [DATE], arrival window [WINDOW]. Reply C to confirm or R to reschedule. See you soon! – ClearSpace
- **ES:** ¡Hola {{contact.first_name}}! Recordatorio: su limpieza es mañana, [DATE], ventana de llegada [WINDOW]. Responda C para confirmar o R para reagendar. ¡Hasta mañana! – ClearSpace

### Morning of, 8:00 AM (SMS)
- **EN:** Today's the day, {{contact.first_name}}! Your ClearSpace crew arrives between [WINDOW]. Text us here if anything comes up.
- **ES:** ¡Hoy es el día, {{contact.first_name}}! Su equipo de ClearSpace llega entre [WINDOW]. Escríbanos aquí si surge algo.

---

## WORKFLOW 5 — COMPLETED (trigger: appointment marked complete)

### Same evening, ~6:00 PM (SMS)
Use the **review request SMS** from `tools/quote-engine.js` (includes your Google review link).

### +1 day (Email)
Use the **review request email** from `tools/quote-engine.js` ("How did we do today?" / "¿Cómo quedó su hogar hoy?").

### +3 days, one-time customers only (SMS) — recurring upsell
- **EN:** Hi {{contact.first_name}}! Now that your home has had its reset, keeping it that way is the easy part — bi-weekly visits are discounted and you keep the same crew. Want me to send the recurring price for your home?
- **ES:** ¡Hola {{contact.first_name}}! Ahora que su hogar tuvo su reinicio, mantenerlo así es lo fácil — las visitas quincenales tienen descuento y conserva el mismo equipo. ¿Le mando el precio recurrente para su hogar?

### +30 days, one-time customers who didn't convert (SMS)
- **EN:** Hi {{contact.first_name}}, it's been about a month since your ClearSpace clean — about the time most homes are ready for a refresh. Want your usual crew back this week?
- **ES:** Hola {{contact.first_name}}, ya pasó como un mes desde su limpieza con ClearSpace — justo cuando la mayoría de los hogares piden una repasada. ¿Quiere a su equipo de vuelta esta semana?

---

## Build checklist inside GHL

1. Create custom fields: `quote_total`, `service_type`, `appt_date`, `appt_window`, `preferred_language`.
2. Create tags: `new-lead`, `quote-sent`, `warm`, `booked`, `completed`, `cold-lead`.
3. Build the 5 workflows above; branch every message step on `preferred_language`.
4. Set quiet hours 9 AM–7 PM and stop-on-reply on Workflows 1–3.
5. Connect your GHL phone number and test each workflow on your own phone (both languages) before going live.
