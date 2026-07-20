# ClearSpace — Launch Handoff

Everything built in this repo, where it lives, what only you can do, and the launch-day checklist. Built across 7 phases; each is its own git commit on the `launch-build` branch.

---

## What was built

| Phase | Deliverable | Status |
|---|---|---|
| 1 | Launch-quality landing page, bilingual EN/ES | ✅ |
| 2 | Instant quote + customer-comms engine (SMS/email, EN/ES) | ✅ tested on 3 leads |
| 3 | Live pricing calculator page | ✅ |
| 4 | Printable client documents (agreement, intake, checklists) | ✅ |
| 5 | GoHighLevel 30-day follow-up system | ✅ |
| 6 | Google Business Profile kit | ✅ |
| 7 | 16 local SEO area pages + sitemap/robots/structured data | ✅ |

**One source of truth for pricing:** every price on the site, the calculator, and the quote engine is computed from `pricing-config.js`. Your wife can change rates there and everything updates — no logic to touch.

---

## Where each file lives

**Customer website (goes live on GitHub Pages)**
- `index.html` — the landing page (hero, services incl. organizing, how-it-works, service-area, reviews placeholder, trust badges, quote form).
- `pricing.html` — the instant price calculator.
- `areas/` — 16 local SEO pages: `house-cleaning-<city>.html` and `move-out-cleaning-<city>.html` for West Jordan, Salt Lake City, South Jordan, Sandy, Riverton, Herriman, Taylorsville, Murray.
- `assets/site.css`, `assets/site.js` — shared design + language toggle + form handling.
- `pricing-config.js` — **THE rates file. Edit prices here only.**
- `sitemap.xml`, `robots.txt` — for Google.
- `sw.js` — offline service worker.

**Your office tool (not linked from the public site)**
- `app.html` — your original ClearSpace office dashboard (jobs, clients, calendar, invoices). Still fully works; reachable at `.../ClearSpace/app.html`. Note: it has its own built-in pricing separate from `pricing-config.js` — fine for now, worth unifying later.

**Business tools & templates**
- `tools/quote-engine.js` — generates quote / confirmation / reminder / review messages, all in SMS + email × EN + ES. Run `node tools/quote-engine.js` to test.
- `tools/sample-output.txt` — the full generated output for the 3 test leads (Sarah, Luis, Amber).
- `tools/build-areas.js` — regenerates the area pages if you edit their content.
- `docs/service-agreement.html` — service agreement (EN + ES), marked for lawyer review.
- `docs/intake-form.html` — new-client intake form (bilingual).
- `docs/checklists.html` — standard / deep / move-out room-by-room checklists.
- `marketing/ghl-followup-sequence.md` — the 30-day GoHighLevel copy + build steps.
- `marketing/gbp-kit.md` — Google Business Profile description, services, posts, review requests.
- `marketing/verification-video-script.md` — script for Google's verification video.
- `marketing/photo-shot-list.md` — the 12 photos to shoot for GBP + the website.
- `marketing/print-materials.html` — printable flyer, door hanger (tear-off tabs), and business card. Open in a browser → Print/Save as PDF. **Note:** prices are typed into the flyer/card by hand — if you change rates in `pricing-config.js`, update this file too.
- `marketing/social-media-kit.md` — bilingual Facebook / Instagram / Nextdoor launch posts.
- `marketing/email-signature.html` — open it, click "Copy signature," paste into Gmail settings.
- `assets/img/` — self-hosted placeholder photos + `og-image.jpg` (social-share preview) + `CREDITS.md`. Swap for real photos when you have them.
- `404.html` — friendly not-found page.

*(Print the `docs/*.html` files from a browser — each has a 🖨 Print button.)*

---

## What only YOU can do (I can't do these for you)

1. **Buy a domain** (e.g. clearspaceutah.com) and point it at GitHub Pages — or keep the free `miguelcaudillo.github.io/ClearSpace/` URL to start.
2. **Fill in placeholders** in `pricing-config.js`: `phone`, `email`, `reviewUrl`. These flow to every page and message. Search the repo for `[YOUR PHONE NUMBER]`, `[YOUR EMAIL]`, `[REVIEW LINK]`.
3. **Set up a form endpoint** so quote requests reach you by email. Create a free Formspree form, paste its URL into `FORM_ENDPOINT` in `assets/site.js`. (Until then, leads are saved in the browser's localStorage only.)
4. **Create the Google Business Profile** and verify it (uses `marketing/gbp-kit.md`).
5. **Get licensed & insured** — then replace the placeholder "Licensed & insured*" badge and fill the insurance blank in the service agreement. The asterisk footnote flags this on the live site.
6. **Have a lawyer review** `docs/service-agreement.html` before using it with any customer.
7. **Set up GoHighLevel** — create the account, build the 5 workflows and custom fields from `marketing/ghl-followup-sequence.md`, connect your phone number, test on yourself in both languages.
8. **Add real photos & reviews** — swap the emoji/placeholder review cards and gallery for real before/afters and Google reviews as they come in.

---

## Launch-day checklist (in order)

1. ☐ Fill `phone`, `email`, `reviewUrl` in `pricing-config.js`.
2. ☐ Replace `[YOUR PHONE NUMBER]` in `index.html` JSON-LD and (optionally) the trust badges.
3. ☐ Create Formspree form → paste URL into `FORM_ENDPOINT` in `assets/site.js`.
4. ☐ Test the quote form + calculator locally (open `index.html`, submit a test lead, toggle EN/ES).
5. ☐ **Go live:** merge the branch to `main` and push (command below). Pages redeploys automatically.
6. ☐ Hard-refresh the live site (Ctrl+Shift+R) and click through on your phone.
7. ☐ Create + verify Google Business Profile; paste description, services, hours, service-area cities.
8. ☐ Copy your Google review link back into `pricing-config.js` and re-push.
9. ☐ Build the GoHighLevel workflows; test each on your own phone in EN and ES.
10. ☐ Print and sign-off the client docs; send the agreement to a lawyer.
11. ☐ Publish GBP Post 1; start the 1–2×/week posting cadence.
12. ☐ Submit `sitemap.xml` in Google Search Console once the domain is set.

### The one command to go live
From `C:\Users\Workstation\OneDrive\Desktop\ClearSpace`:
```
git checkout main
git merge launch-build
git push
```
Then hard-refresh `https://miguelcaudillo.github.io/ClearSpace/`.

*(To preview everything first without going live, open the files directly in your browser from the Desktop\ClearSpace folder — the whole site works offline.)*
