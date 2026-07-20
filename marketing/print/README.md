# ClearSpace — Business Card Print Files

Two ready-to-upload PDFs for a standard US business card:

- **card-front.pdf** — emerald card: logo, phone, "English & Español", website
- **card-back.pdf** — white card: tagline, service bullets, email + website

## Specs (what to tell the printer / select at upload)
- **Trim size:** 3.5″ × 2″ (standard US business card)
- **File size:** 3.75″ × 2.25″ — includes **0.125″ bleed** on all sides
- **Safe zone:** all text sits ≥ 0.125″ inside the trim, so nothing important gets cut
- **Color:** full-bleed background art (front) — make sure "print to the edge / bleed" is ON
- **Orientation:** landscape

## Uploading to Vistaprint / Staples / GotPrint / UPS Store
1. Choose **Standard Business Cards, 3.5×2, upload your own design**.
2. Upload **card-front.pdf** as the front and **card-back.pdf** as the back.
3. If asked about bleed: the files already include 0.125″ bleed — select "my file has bleed."
4. Recommended stock: 14–16pt matte or a soft-touch finish reads as premium.

## To regenerate (after editing the .html files)
From `marketing/print/`, with Microsoft Edge installed:
```
msedge --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="card-front.pdf" card-front.html
msedge --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="card-back.pdf"  card-back.html
```
(Or just open each .html in a browser and Print → Save as PDF.)

**Reminder:** the phone/email/website are baked into the .html — if any of those change, edit the .html and regenerate the PDFs.
