/* =============================================================
   Consimțământ cookie-uri — o singură implementare, toate paginile.
   Nimic de tracking nu pornește înainte de accept: scripturile
   Meta Pixel și Google Analytics sunt injectate din acest fișier,
   niciodată direct în HTML. Reutilizează shell-ul .contact-* și
   stilurile globale de buton, la fel ca waitlist.js.

   Categorii:
     necesare  — mereu active, fără cookie-uri de tracking
     analytics — Google Analytics 4 (când GA_ID e completat)
     marketing — Meta Pixel

   Ca să activezi Google Analytics: completează GA_ID mai jos.
   Restul (consimțământ, Consent Mode v2, banner) e deja pregătit.
   ============================================================= */
(function () {
  "use strict";

  var META_PIXEL_ID = "1338842268123550";
  var GA_ID = "";              // ex. "G-XXXXXXXXXX" — gol = GA nu se încarcă

  var STORE_KEY = "gec_consent";
  var STORE_VERSION = 1;
  var MAX_AGE_DAYS = 365;      // după un an cerem din nou consimțământul

  var CATEGORIES = ["analytics", "marketing"];

  /* ---------- stocare ---------- */

  function read() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var v = JSON.parse(raw);
      if (!v || v.v !== STORE_VERSION || typeof v.ts !== "number") return null;
      if (Date.now() - v.ts > MAX_AGE_DAYS * 864e5) return null;
      return { analytics: !!v.analytics, marketing: !!v.marketing, ts: v.ts };
    } catch (e) {
      return null;   // localStorage blocat (Safari privat, etc.)
    }
  }

  function write(choice) {
    try {
      window.localStorage.setItem(STORE_KEY, JSON.stringify({
        v: STORE_VERSION,
        ts: Date.now(),
        analytics: !!choice.analytics,
        marketing: !!choice.marketing
      }));
    } catch (e) {}
  }

  var state = read();

  /* ---------- Google Consent Mode v2 ----------
     Trebuie setat înainte să se încarce gtag. Fiindcă GA e injectat
     de noi, mai jos, defaults-urile ajung mereu primele. */

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });

  /* ---------- încărcarea trackerelor ---------- */

  var loaded = { analytics: false, marketing: false };

  function inject(src) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    document.head.appendChild(s);
    return s;
  }

  function loadAnalytics() {
    if (loaded.analytics || !GA_ID) return;
    loaded.analytics = true;
    inject("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID));
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true });
  }

  function loadMarketing() {
    if (loaded.marketing || !META_PIXEL_ID) return;
    loaded.marketing = true;

    /* Meta Pixel — snippet oficial, rulat abia după accept */
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0";
      n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable */

    window.fbq("init", META_PIXEL_ID);
    window.fbq("track", "PageView");
  }

  /* Aplică starea curentă. Trackerele nu se pot „descărca" dintr-o
     pagină deja randată; la revocare le blocăm pentru navigările
     următoare și oprim trimiterea prin Consent Mode / fbq consent. */
  function apply(choice) {
    gtag("consent", "update", {
      ad_storage: choice.marketing ? "granted" : "denied",
      ad_user_data: choice.marketing ? "granted" : "denied",
      ad_personalization: choice.marketing ? "granted" : "denied",
      analytics_storage: choice.analytics ? "granted" : "denied"
    });

    if (window.fbq) window.fbq("consent", choice.marketing ? "grant" : "revoke");

    if (choice.analytics) loadAnalytics();
    if (choice.marketing) loadMarketing();
  }

  function decide(choice) {
    state = { analytics: !!choice.analytics, marketing: !!choice.marketing, ts: Date.now() };
    write(state);
    apply(state);
    hideBanner();
    closePrefs();
  }

  /* ---------- helperi DOM ---------- */

  function node(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }

  /* ---------- banner ---------- */

  var banner = null;

  function bannerHTML() {
    return '' +
      '<div class="cc-banner" role="region" aria-label="Consimțământ cookie-uri">' +
        '<div class="cc-inner">' +
          '<div class="cc-copy">' +
            '<p class="cc-title">Înainte să mergem mai departe</p>' +
            '<p class="cc-text">Folosim cookie-uri tehnice, necesare pentru funcționarea site-ului. ' +
            'Cu acceptul tău, folosim și cookie-uri de analiză și de marketing (Meta, Google), ' +
            'ca să înțelegem ce funcționează și cui merită să povestim despre GEC. ' +
            'Detalii în <a href="/politica-confidentialitate">politica de confidențialitate</a>.</p>' +
          '</div>' +
          '<div class="cc-actions">' +
            '<button class="btn btn-primary cc-accept" type="button">Accept toate</button>' +
            '<button class="btn btn-ghost cc-reject" type="button">Doar necesare</button>' +
            '<button class="cc-link cc-settings" type="button">Setări</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function showBanner() {
    if (banner) return;
    banner = node(bannerHTML());
    banner.querySelector(".cc-accept").addEventListener("click", function () {
      decide({ analytics: true, marketing: true });
    });
    banner.querySelector(".cc-reject").addEventListener("click", function () {
      decide({ analytics: false, marketing: false });
    });
    banner.querySelector(".cc-settings").addEventListener("click", openPrefs);
    document.body.appendChild(banner);
    // Flush layout ca tranziția să aibă o stare de plecare, apoi intră.
    // Sincron, nu prin requestAnimationFrame: într-un tab deschis în
    // fundal rAF nu rulează, iar bannerul ar rămâne invizibil.
    void banner.offsetHeight;
    banner.classList.add("in");
  }

  function hideBanner() {
    if (!banner) return;
    var b = banner;
    banner = null;
    b.classList.remove("in");
    setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 350);
  }

  /* ---------- panoul de setări ---------- */

  var prefs = null, lastFocus = null;

  function row(key, title, text, checked) {
    return '' +
      '<label class="cc-row">' +
        '<input type="checkbox" data-cc="' + key + '"' + (checked ? " checked" : "") + ' />' +
        '<span class="cc-box" aria-hidden="true"></span>' +
        '<span class="cc-row-copy">' +
          '<span class="cc-row-title">' + title + '</span>' +
          '<span class="cc-row-text">' + text + '</span>' +
        '</span>' +
      '</label>';
  }

  function prefsHTML() {
    var c = state || { analytics: false, marketing: false };
    return '' +
      '<div class="contact-overlay cc-overlay">' +
        '<div class="contact-modal cc-modal">' +
          '<button class="contact-close" type="button" aria-label="Închide">' +
            '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>' +
          '</button>' +
          '<div class="cc-modal-title" id="cc-title">Setări cookie-uri</div>' +
          '<p class="cc-modal-sub">Tu alegi ce ne lași să măsurăm. Poți reveni oricând, din footer.</p>' +
          '<div class="cc-rows">' +
            '<label class="cc-row is-locked">' +
              '<input type="checkbox" checked disabled />' +
              '<span class="cc-box" aria-hidden="true"></span>' +
              '<span class="cc-row-copy">' +
                '<span class="cc-row-title">Necesare <em>— mereu active</em></span>' +
                '<span class="cc-row-text">Fac site-ul să funcționeze: preferințele tale de aici și formularul de înscriere. Fără ele, pagina nu merge.</span>' +
              '</span>' +
            '</label>' +
            row("analytics", "Analiză",
                "Google Analytics, anonimizat. Ne arată ce pagini se citesc și unde se pierde lumea, ca să le facem mai bune.",
                c.analytics) +
            row("marketing", "Marketing",
                "Meta Pixel. Măsoară ce anunțuri aduc oameni care rămân și ne ajută să nu risipim buget pe cine nu e interesat.",
                c.marketing) +
          '</div>' +
          '<div class="cc-modal-actions">' +
            '<button class="btn btn-primary cc-save" type="button">Salvează alegerea</button>' +
            '<button class="btn btn-ghost cc-all" type="button">Accept toate</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function onKey(e) {
    if (e.key === "Escape") { closePrefs(); return; }
    if (e.key !== "Tab" || !prefs) return;
    var f = prefs.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openPrefs() {
    if (prefs) return;
    prefs = node(prefsHTML());
    var modal = prefs.querySelector(".cc-modal");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "cc-title");

    prefs.addEventListener("mousedown", function (e) { if (e.target === prefs) closePrefs(); });
    prefs.querySelector(".contact-close").addEventListener("click", closePrefs);
    prefs.querySelector(".cc-save").addEventListener("click", function () {
      var pick = {};
      CATEGORIES.forEach(function (k) {
        var box = prefs.querySelector('[data-cc="' + k + '"]');
        pick[k] = !!(box && box.checked);
      });
      decide(pick);
    });
    prefs.querySelector(".cc-all").addEventListener("click", function () {
      decide({ analytics: true, marketing: true });
    });

    lastFocus = document.activeElement;
    document.documentElement.classList.add("wl-lock");
    document.body.appendChild(prefs);
    document.addEventListener("keydown", onKey, true);
    var first = prefs.querySelector('[data-cc="analytics"]');
    if (first) first.focus();
  }

  function closePrefs() {
    if (!prefs) return;
    var p = prefs;
    prefs = null;
    document.documentElement.classList.remove("wl-lock");
    document.removeEventListener("keydown", onKey, true);
    if (p.parentNode) p.parentNode.removeChild(p);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  /* ---------- API + pornire ---------- */

  window.GEC_CONSENT = {
    get: function () { return state ? { analytics: state.analytics, marketing: state.marketing } : null; },
    open: openPrefs,
    accept: function () { decide({ analytics: true, marketing: true }); },
    reject: function () { decide({ analytics: false, marketing: false }); }
  };

  // Orice link/buton din footer marcat [data-cookie-settings] redeschide panoul.
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-cookie-settings]");
    if (!t) return;
    e.preventDefault();
    openPrefs();
  });

  function start() {
    if (state) apply(state);
    else showBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
