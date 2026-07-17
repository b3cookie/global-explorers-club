# Global Explorers Club

Landing page pentru lista de așteptare — temă cinematică, dark/gold, în română.

## Structura proiectului

```
index.html                      Pagina principală
app.jsx                         Aplicația React (toate secțiunile și formularul)
styles.css                      Design system complet (variabile CSS, responsive)
waitlist.js                     Popup-ul de înscriere, partajat pe toate paginile
filosofia.html                  Pagina „Filosofia” (/filosofia)
fundamentul-stiintific.html     Pagina „Fundamentul Științific” (/fundamentul-stiintific)
assets/                         Imagini de producție
favicon.svg + PNG-uri           Set complet de favicon (owl emblem)
site.webmanifest                Manifest PWA (iconuri, temă)
vercel.json                     Configurare rute (cleanUrls)
google-apps-script.gs           Script backend pentru colectarea înscrierilor
politica-confidentialitate.html Politică de confidențialitate
termeni-conditii.html           Termeni și condiții
```

Rutele curate (`/filosofia`, `/fundamentul-stiintific`, `/politica-confidentialitate`,
`/termeni-conditii`) funcționează pe Vercel prin `cleanUrls`. Local, deschide fișierele
`.html` direct.

## Rulare locală

```bash
python3 -m http.server 4456
# http://localhost:4456
```

Nu este nevoie de build step. React și Babel sunt încărcate din CDN; JSX-ul este compilat în browser.

## Formular de înscriere

Endpoint-ul Google Apps Script este definit la începutul `app.jsx`:

```js
const WAITLIST_ENDPOINT = "https://script.google.com/macros/s/.../exec";
```

Fiecare înscriere devine un rând în Google Sheets: `Data | Prenume | Email | Capitol | Sursă`.

Același formular este afișat inline în secțiunea `#waitlist` de pe pagina principală
și, prin `waitlist.js`, ca popup deschis de orice buton „Lista de așteptare” de pe orice
pagină. Fără JavaScript, butoanele fac fallback la secțiunea `#waitlist` de pe homepage.

## Deployment — Staging & Production

Un singur cod și un singur repo Git, două medii izolate pe Vercel:

| Mediu                  | Branch Git | URL de deploy                        |
| ---------------------- | ---------- | ------------------------------------ |
| **Production** (live)  | `main`     | domeniul de producție (globalexplorers.ro) |
| **Staging / Dev**      | `staging`  | URL-ul de Preview Vercel al branch-ului `staging` |

Reguli de lucru:

1. Nicio schimbare nu ajunge direct în Production în mod implicit.
2. Toate modificările se comit pe `staging` și se publică întâi în mediul de Staging
   pentru review.
3. Production (`main`) se actualizează **doar** după aprobare explicită, prin merge
   `staging` → `main`.
4. Înainte de orice deploy se cere confirmarea mediului (Staging sau Production).

Vercel tratează automat `main` ca Production și orice alt branch (inclusiv `staging`)
ca Preview, cu URL separat — deci cele două medii sunt izolate fără configurări extra.
Pentru un subdomeniu dedicat de staging (ex. `staging.globalexplorers.ro`), acesta se
poate atașa branch-ului `staging` din panoul Vercel.
