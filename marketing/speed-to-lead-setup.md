# ClearSpace — Speed-to-Lead Setup

**Why this matters:** In home cleaning, replying to a lead in ~5 minutes vs. an hour can double how many turn into jobs. The person who answers first usually wins. This makes sure you never miss that window.

There are two sides, and the first is already done:

---

## ✅ Side 1 — Customers can reach YOU instantly (built & live)

Your site now has **"💬 Text us"** buttons (in the hero and on the quote-form success screen). They open the customer's texting app with a message pre-filled to your number — so an eager customer can start a conversation in one tap instead of waiting on a form. Texting converts better than "fill out a form and wait," especially on phones.

Nothing to do here — it's live.

---

## 📲 Side 2 — YOU get a text the instant a lead comes in (5-minute setup)

Right now, a quote request only lands in your Gmail. If you're inside a house cleaning, you won't see it for hours. This routes every new lead to your phone as a **text**, free, using a Gmail filter + your carrier's email-to-SMS address.

### Step A — find your carrier's SMS-by-email address
Your number is **(801) 433-7342**, so your address is `8014337342@` + your carrier's domain:

| Carrier | Address to use |
|---|---|
| Verizon / Visible | 8014337342@vtext.com |
| AT&T / Cricket | 8014337342@txt.att.net |
| T-Mobile / Mint / Metro | 8014337342@tmomail.net |
| Google Fi | 8014337342@msg.fi.google.com |
| US Cellular | 8014337342@email.uscc.net |
| Boost | 8014337342@sms.myboostmobile.com |

*(Not sure of your carrier? Google "who is my cell carrier" or check your phone bill. Tell me and I'll confirm the exact address.)*

### Step B — add it as a forwarding address in Gmail
1. Gmail → ⚙️ **See all settings** → **Forwarding and POP/IMAP** → **Add a forwarding address**.
2. Paste your carrier address from Step A → **Next** → **Proceed**.
3. Gmail sends a **confirmation code** — it'll arrive as a **text on your phone**. Enter that code in Gmail to confirm.

### Step C — create the filter
1. Gmail → ⚙️ **See all settings** → **Filters and Blocked Addresses** → **Create a new filter**.
2. In the **From** field put: `submissions@formspree.io` (Formspree sends your lead emails from there).
   *(Or, more broadly, in "Has the words" put: `New ClearSpace quote request`.)*
3. Click **Create filter** → check **Forward it to:** and pick your carrier address → **Create filter**.

**Done.** Every new lead now texts your phone within seconds. When it arrives, reply to the customer right away — even a quick "Hi [name], it's ClearSpace, getting your price now!" locks them in.

---

## 💬 Optional — auto-reply to the customer instantly

So the customer gets an instant acknowledgment even before you can respond:

**Easiest (once GoHighLevel is set up):** its "new lead" workflow sends the auto-text automatically — this is the Day-0 message already written in `marketing/ghl-followup-sequence.md`.

**Free interim option (Zapier or Make.com):**
- Trigger: new Formspree submission
- Action: send the customer a text/email — *"Hi [name], it's ClearSpace! Got your request — we'll text your exact price within the hour. 💚"*
- Free tiers cover well under your lead volume to start.

*(I can walk you through the Zapier version if you want it before GHL.)*

---

## The habit that makes all of this pay off
When that lead text hits your phone: **reply within 5 minutes.** Speed beats polish. A fast, friendly first text wins more jobs than a perfect quote sent an hour later.
