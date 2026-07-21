# ClearSpace — Customer Auto-Reply Setup

Goal: the instant a customer submits the quote form, they get an automatic
"we got it, price coming!" message — so they feel taken care of before you've
even picked up your phone. This kills the awkward silence where they'd otherwise
message another cleaner.

## The message (already written & in your quote engine)

Run `node tools/quote-engine.js` to see it, or copy from here:

**SMS — English**
> Hi [name], it's ClearSpace Home Cleaning! 💚 Got your request — we'll text your exact price within the hour. Questions in the meantime? Just reply here.

**SMS — Spanish**
> ¡Hola [name], somos ClearSpace Home Cleaning! 💚 Recibimos su solicitud — le enviamos su precio exacto dentro de una hora. ¿Preguntas mientras tanto? Responda aquí.

**Email — English** (subject: *We got your request — ClearSpace Home Cleaning*)
> Hi [name], thanks for reaching out! This is a quick automatic note to let you know we've got your request and a real person will text or email your exact price within the hour. Need us sooner? Text or call (801) 433-7342. — ClearSpace

*(Spanish email version is in the quote engine too.)*

---

## Option A — GoHighLevel (recommended, best version)

This is the **right long-term home** for the auto-reply, because GHL can send it
by **SMS to everyone** (every lead gives a phone number; not everyone gives email).

- It's already built into your 30-day sequence: **Workflow 1 → "Day 0 — immediately (SMS)"** in `marketing/ghl-followup-sequence.md`.
- When you set up GoHighLevel, that workflow fires this text automatically on every new lead.

**If/when you do GHL, you don't need Option B at all.** Do this one and you're set.

---

## Option B — Free interim (Make.com), before GHL

Sends the auto-reply **by email** to customers who left an email address.
Free tier covers far more than your starting volume.

**Setup (~10 min):**
1. Create a free account at **make.com**.
2. New Scenario → first module: **Gmail → "Watch Emails"**
   - Folder: Inbox · Filter: **From** contains `submissions@formspree.io`
   - (This watches for your lead-notification emails.)
3. Add a module: **Gmail → "Send an Email"**
   - **To:** map the customer's email. Formspree includes the form fields in the email body; use Make's built-in text parser, or set the trigger to read the email's **Reply-To** (your form already sets Reply-To to the customer's email via the `_replyto` field).
   - **Subject:** We got your request — ClearSpace Home Cleaning
   - **Body:** paste the English email message above.
4. Turn the scenario ON.

**Caveats (be honest with yourself):**
- Email-only — a customer who didn't enter an email won't get it. That's why GHL (SMS) is better.
- Test it once: submit a quote on your own site with your email and confirm the auto-reply lands.

---

## Which to do
- **Setting up GoHighLevel soon?** Skip Option B — just use GHL Workflow 1. It's better (SMS, everyone) and already written.
- **Want something this week before GHL?** Do Option B for an email auto-reply now, then retire it once GHL is live.

Either way, pair this with the **instant lead text to YOU** (`speed-to-lead-setup.md`) — together they mean: customer gets an instant reply, you get an instant heads-up, and you close within the 5-minute window.
