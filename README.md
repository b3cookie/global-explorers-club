# Global Explorers Club

Landing page pentru lista de așteptare — temă cinematică, dark/gold, în română.

## Structura proiectului

```
index.html                      Pagina principală
app.jsx                         Aplicația React (toate secțiunile și formularul)
styles.css                      Design system complet (variabile CSS, responsive)
assets/                         Imagini de producție
google-apps-script.gs           Script backend pentru colectarea înscrierilor
politica-confidentialitate.html Politică de confidențialitate
termeni-conditii.html           Termeni și condiții
```

## Rulare locală

```bash
python3 -m http.server 4455
# http://localhost:4455
```

Nu este nevoie de build step. React și Babel sunt încărcate din CDN; JSX-ul este compilat în browser.

## Formular de înscriere

Endpoint-ul Google Apps Script este definit la începutul `app.jsx`:

```js
const WAITLIST_ENDPOINT = "https://script.google.com/macros/s/.../exec";
```

Fiecare înscriere devine un rând în Google Sheets: `Data | Prenume | Email | Capitol | Sursă`.

Dacă variabila este goală, formularul funcționează în mod demo (validare + ecran de succes, fără salvare).

## Deployment

Orice host static (Netlify, Vercel, GitHub Pages, server propriu). Nu sunt necesare configurări server-side.
