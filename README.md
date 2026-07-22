# ClearSpace Home Cleaning

The complete website + business toolkit for ClearSpace Home Cleaning — West Jordan &
the Salt Lake valley. Static site (no server), bilingual English/Spanish.

**Live:** https://miguelcaudillo.github.io/ClearSpace/

## What's here

| Path | What it is |
|---|---|
| `index.html` | Public landing page (hero, services, gallery, service areas, FAQ, quote form) |
| `pricing.html` | Instant price calculator |
| `app.html` | Private owner dashboard (jobs, clients, calendar, invoices) — passphrase-protected |
| `areas/` | 16 local-SEO pages (house + move-out cleaning × 8 cities) |
| `pricing-config.js` | **The one place to edit prices & the referral offer** |
| `assets/` | Shared CSS, JS, images, PWA icons |
| `tools/` | `quote-engine.js` (all customer messages), `build-areas.js`, `test.js` |
| `docs/` | Printable client docs (agreement, intake form, checklists) |
| `marketing/` | Everything for getting & keeping customers — **see `marketing/README.md`** |
| `HANDOFF.md` | The big picture: what's done, what needs you, launch checklist |
| `FIRST-WEEK-CHECKLIST.md` | Day-by-day playbook for your first jobs |

## Common tasks

**Change a price** → edit `pricing-config.js`, then check the math:
```
node tools/test.js
```

**See all customer messages** (quote, confirmation, reminder, review, referral, auto-reply — bilingual SMS + email):
```
node tools/quote-engine.js
```

**Rebuild the city pages** after editing their content in `tools/build-areas.js`:
```
node tools/build-areas.js
```

**Deploy** → commit and push to `main`; GitHub Pages redeploys automatically (~30–60s):
```
git add -A && git commit -m "your message" && git push
```

## Notes
- **One source of truth for prices:** the landing page, calculator, and quote engine all read from `pricing-config.js`. Never hardcode prices elsewhere.
- **Owner login:** the dashboard passphrase is stored only as a SHA-256 hash in `app.html` (never plaintext), with a brute-force lockout. To change it, follow the comment in `app.html`.
- **Placeholder items** to replace with the real thing: photos (`assets/img/`), Google review link (`pricing-config.js`), and the licensed/insured badges — all noted in `HANDOFF.md`.
