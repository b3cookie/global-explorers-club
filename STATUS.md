---
stage: live
summary: Global Explorers Club waitlist landing page (RO).
next:
  - Paste GA4 and TikTok Pixel IDs into consent.js once the accounts exist
  - Create a Google app password for SMTP access
  - Comit pe staging și fac merge-ul staging → main pentru publicare, dacă Mark spune 'da'.
needs_mark:
---

## Log
- 2026-10-21 · Decided: footer credit look → variant A (muted grey, colour on hover) (Mark); committed on staging (55eddd1), not pushed or live
- 2026-10-21 · Added a 'Created by Marketive Hub' credit (logo + link) to every footer, not committed or live yet; 5 look variants for Mark to pick from in credit-variante.html
- 2026-10-12 · Blocked (heard in chat): Verificarea vârstei nu este implementată în prezent.
- 2026-10-12 · Decided (heard in chat): Bifața este folosită ca declarație, nu ca verificare a vârstei.
- 2026-10-12 · Fixed (heard in chat): Scriptul Google Apps Script respinge cererile fără acordul confirmat.
- 2026-10-12 · Bug found (heard in chat): Formularul nu poate fi trimis fără a fi bifat acordul de vârstă.
- 2026-10-12 · Done (heard in chat): Formularul trimite textul de acord cu „Am cel puțin 18 ani…”.
- 2026-10-12 · Done (heard in chat): Politica de confidențialitate arată acum GLOBAL EXPLORERS HEAD SRL.
- 2026-10-12 · Done (heard in chat): Totul e publicat pe `main`, commit `e4e4cae`, și a fost verificat pe `www.globalexplorers.ro` că e live.
- 2026-10-12 · Done (heard in chat): Merge-ul `staging` → `main` a fost finalizat și comit și merge-ul a fost făcut.
- 2026-10-12 · Done (heard in chat): Formularul trimite interesele alese și în câmpul „capitol”, pe care scriptul deja deployat îl salvează.
- 2026-10-12 · Shipped to production (staging merged to main, commit e4e4cae): firm data and address in footers and policy, 18+ consent, chat-style 3-step form, equal Accept/Refuz cookie buttons, TikTok pixel loader (idle until its ID is added); checked live on www.globalexplorers.ro
- 2026-10-12 · Interests are now also sent in the old "capitol" field, so the already-deployed Apps Script saves them without a redeploy (column header still reads "Capitol")
- 2026-10-12 · Decided (heard in chat): Mark a decis că nu are nevoie de ID-urile Analytics pentru moment, dar va comite pe staging pentru a verifica.
- 2026-10-12 · Blocked (heard in chat): Apps Script trebuie actualizat pentru a include câmpul nou 'interese' din formular, altfel datele vor fi pierdute.
- 2026-10-12 · Blocked (heard in chat): ID-urile GA4 și TikTok Pixel sunt necesare pentru pornirea Analytics-ului și pixelului, dar nu sunt încă disponibile.
- 2026-10-12 · Done (heard in chat): Testul fluxului complet pe pagina principală și verificarea popup-ului pe filosofia.html a fost finalizat.
- 2026-10-12 · Done (heard in chat): Varianta C (conversația) este implementată pe pagina principală și în popup-ul de pe celelalte pagini.
- 2026-10-12 · Decided: GA4 and TikTok IDs → not set up yet; code and policy are ready, IDs go into consent.js (GA_ID, TIKTOK_PIXEL_ID) when the accounts exist; until then nothing loads. Lawyer has already seen the policy and terms (Mark)
- 2026-10-12 · Waitlist form is now the chat-style version (variant C): GEC asks name, then email, then interests + one 18+/privacy/terms checkbox, answers show as bubbles; live on staging only, not committed
- 2026-10-12 · Decided: Which form layout (A classic, B big question, C chat)? → C, the chat (Mark)
- 2026-10-12 · Done (heard in chat): Formularul a fost actualizat în 3 pași, cu 5 interese, o bifă pentru vârstă și acordul cu politica de confidențialitate.
- 2026-10-12 · Done (heard in chat): Politica de confidențialitate include TikTok, perioada de păstrare a datelor, furnizorii de servicii și un tabel cu cookie-urile și durata lor.
- 2026-10-12 · Done (heard in chat): Consentimentul pentru cookies include butoanele 'Accept' și 'Refuz', iar TikTok Pixel este încărcat după accept.
- 2026-10-12 · Done (heard in chat): Verificarea vârstei 18+ este implementată cu o singură bifă, cu textul corespunzător.
- 2026-10-12 · Done (heard in chat): Datele firmei sunt adăugate în footerul tuturor paginilor și în politica de confidențialitate.
- 2026-10-12 · Recreated form-variante.html with 3 step-by-step form layouts (A classic, B big question, C chat) for Mark to pick; site keeps the current 3-step form until he chooses
- 2026-10-12 · Registered office (Str. Barlogeni 63, Sector 1, București) added to footers and privacy policy
- 2026-10-12 · Waitlist form rebuilt as 3 steps (name → email → 5 interest chips + one 18+/privacy/terms checkbox) on staging, in both app.jsx and waitlist.js; sheet column 4 is now "Interese" (Apps Script copy must be pasted and redeployed by hand)
- 2026-10-12 · Decided: form layout → name, email, then interests + consent as separate steps (Mark)
- 2026-10-12 · GDPR pass on staging (not committed): firm data (GLOBAL EXPLORERS HEAD SRL, CUI, Reg. Com.) in all footers and the privacy policy; 18+ added to the single consent checkbox; cookie banner now has equal Accept/Refuz buttons; TikTok Pixel loader added (needs ID); policy now has TikTok, retention and a cookie table; false "confirmation sent" claim removed from the success screen; form-variante.html shows 3 form layouts to pick from
- 2026-10-12 · Decided: Double opt-in? → not needed (Mark)
- 2026-10-10 · Blocked (heard in chat): Catch-all email is disabled on Drop
- 2026-10-10 · Bug found (heard in chat): DMARC record is missing
- 2026-10-10 · Done (heard in chat): DNS records for MX, SPF and DKIM are properly configured
- 2026-10-10 · Done (heard in chat): Email routing for contact@globalexplorers.ro is working correctly
- 2026-10-10 · Checked Cloudflare Email Routing for globalexplorers.ro: contact@ forwards to the club's Gmail (verified, active), MX/SPF/DKIM in place; no mail received yet; no DMARC record; catch-all is off
- 2026-10-08 · STATUS.md created by Symbio from this project's card, so every chat reads and keeps this project's story here
