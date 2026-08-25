# Global Explorers Club

Landing page pentru lista de așteptare — temă cinematică, dark/gold, în română.

## Structura proiectului

```
index.html                      Pagina principală
app.jsx                         Aplicația React (toate secțiunile și formularul)
styles.css                      Design system complet (variabile CSS, responsive)
waitlist.js                     Popup-ul de înscriere, partajat pe toate paginile
filosofia.html                  Pagina „Filosofia” (/filosofia)
de-ce-facem-asta.html           Pagina „De ce facem asta” (/de-ce-facem-asta)
fundamentul-stiintific.html     Pagina „Fundamentul Științific” (/fundamentul-stiintific)
locul-gec-in-lume.html          Pagina „Locul GEC în Lume” (/locul-gec-in-lume)
assets/                         Imagini de producție
favicon-*.png / apple-touch     Set complet de favicon PNG (emblema owl aurie)
site.webmanifest                Manifest PWA (iconuri, temă)
vercel.json                     Configurare rute (cleanUrls)
google-apps-script.gs           Script backend pentru colectarea înscrierilor
politica-confidentialitate.html Politică de confidențialitate
termeni-conditii.html           Termeni și condiții
```

Rutele curate (`/filosofia`, `/de-ce-facem-asta`, `/fundamentul-stiintific`,
`/locul-gec-in-lume`, `/politica-confidentialitate`, `/termeni-conditii`) funcționează pe
Vercel prin `cleanUrls`. Local, deschide fișierele `.html` direct.

## Cele patru pagini „Explorează”

Paginile de conținut formează un singur argument, în ordine:

| # | Pagină | Întrebarea la care răspunde |
| - | ------ | --------------------------- |
| 01 | Filosofia | În ce credem? |
| 02 | De ce facem asta | De ce e nevoie de GEC? |
| 03 | Fundamentul Științific | De ce credem că funcționează? |
| 04 | Locul GEC în Lume | Ce construim și unde se încadrează? |

Ordinea este vizibilă pentru cititor prin banda `.chain` de sub hero (prezentă pe toate
cele patru pagini) și prin cardul `.page-next` de la finalul fiecăreia. Ambele componente
sunt definite o singură dată, în `styles.css`.

Când se adaugă o pagină nouă în acest lanț, meniul trebuie actualizat în **toate** locurile:
`app.jsx` (dropdown desktop, meniu mobil, footer) și, în fiecare `.html`, aceleași trei
blocuri. Plus banda `.chain` din fiecare pagină.

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
