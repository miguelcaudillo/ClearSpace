# ClearSpace — Dashboard Cloud Sync Setup (Supabase)

This turns your owner dashboard from a single-device tool into one that:
- **backs up to the cloud** automatically (nothing lost if a browser clears),
- **syncs across devices** (see the same clients/jobs on your phone and laptop),
- is protected by a **real login** (server-enforced — genuinely secure, unlike the
  local passphrase which just locks the on-screen view).

It's **100% optional and off by default.** Until you finish the steps below, the
dashboard works exactly as it does today (local storage only). Nothing breaks.

**Free:** Supabase's free tier is far more than enough for this.

---

## Step 1 — Create a Supabase project (~3 min)
1. Go to **supabase.com** → sign up (use your Google account or an email).
2. **New project** → give it a name (e.g. "clearspace"), set a database password (save it somewhere), pick the closest region → **Create**.
3. Wait ~2 minutes for it to finish setting up.

## Step 2 — Create the table
1. In your project: left sidebar → **SQL Editor** → **New query**.
2. Open `supabase-schema.sql` (in the project root), copy everything, paste it in, click **Run**.
3. You should see "Success." (This makes the table and locks it down so only you can read your data.)

## Step 3 — Create your login
1. Left sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter your email and a password (this is your dashboard login — remember it).
3. Recommended: **Authentication → Providers → Email** → turn **OFF** "Confirm email" so you can sign in right away.

## Step 4 — Get your two keys
1. Left sidebar → **Project Settings** (gear) → **API**.
2. Copy the **Project URL** and the **anon public** key.

## Step 5 — Paste them in and deploy
1. Open **`assets/supabase-sync.js`** (project root).
2. Near the top, paste your values:
   ```
   var SUPABASE_URL = "https://YOURPROJECT.supabase.co";
   var SUPABASE_ANON_KEY = "eyJ...your anon key...";
   ```
3. Save, then deploy:
   ```
   git add -A && git commit -m "Enable dashboard cloud sync" && git push
   ```
   *(Or tell me your two keys and I'll paste them in and push for you.)*

## Step 6 — Use it
1. Open your dashboard (`app.html`), enter your passphrase as usual.
2. A **☁ Cloud** button appears at the bottom-right. Click it → **sign in** with the email/password from Step 3.
3. From then on, every change **auto-backs-up** to the cloud.
4. On another device: open the dashboard → ☁ Cloud → sign in → **⬇ Load cloud copy** to pull your data down.

---

## How it protects you
- Your data is stored under **row-level security** — even with the public "anon" key, the database only ever returns *your* row to *your* logged-in account. No one else can read it.
- The **anon key is safe to be public** (it's designed to ship in web apps); security comes from the login + row-level security, not from hiding the key.
- The local **passphrase** still locks the dashboard's on-screen view on each device — keep using it. Cloud login protects the *data*; the passphrase protects the *screen*.

## Notes
- Backup is **last-write-wins** — fine for one owner across devices. If you edited on two devices while offline, use ⬆/⬇ to pick which copy wins.
- Want me to finish this with you? Create the project (Steps 1–4), send me the Project URL + anon key, and I'll wire it in and we'll test it together.
