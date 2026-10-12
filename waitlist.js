/* =============================================================
   Waitlist popup — one shared implementation for every page.
   Reuses the site's existing modal shell (.contact-*) and the
   global form styles, validation, endpoint and success screen.
   Triggered by event delegation, so it works on the React
   homepage and the static pages alike. Every trigger keeps its
   href (#waitlist / /#waitlist) as a graceful no-JS fallback.
   ============================================================= */
(function () {
  "use strict";

  var ENDPOINT = "https://script.google.com/macros/s/AKfycbz7c3XgyTl9zhgFI3GgIV2myOJL0RtHJCotJoSemZRzrUGkoRFXrLB1_KvzMOKI4fdcIA/exec";

  // Textul exact bifat la înscriere, trimis odată cu datele: GDPR cere să poți
  // dovedi la ce a consimțit omul, nu doar că a consimțit.
  // Aceeași formulare există și în app.jsx — schimbă-le pe amândouă.
  var ACORD_TEXT = "Am cel puțin 18 ani, sunt de acord cu politica de confidențialitate și cu termenii și condițiile, și vreau să primesc pe email noutăți despre Global Explorers Club.";

  var ARROW = '<svg class="arrow" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var TICK = '<svg class="tick" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  var CLOSE = '<button class="contact-close" type="button" aria-label="Închide"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg></button>';
  var SUBMIT = 'Vreau să intru în poveste ' + ARROW;

  var overlay = null, form = null, lastFocus = null;

  function node(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var INTERESE = ["Călătorii și aventură","Provocări personale","Evenimente live","Povești ale membrilor","Dezvoltare personală"];
  var step = 1, interese = [], vals = { prenume: "", email: "" };

  function stepHTML() {
    var chat = '<div class="chat" aria-live="polite"><div class="b q">Salut! Eu sunt de la Global Explorers Club. Cum te cheamă?</div>';
    if (step >= 2) chat += '<div class="b a">' + esc(vals.prenume) + '</div><div class="b q">Mă bucur, ' + esc(vals.prenume) + '! Unde îți trimitem vestea?</div>';
    if (step >= 3) chat += '<div class="b a">' + esc(vals.email) + '</div><div class="b q">Perfect. Ce te interesează? <span class="opt">(alege oricâte)</span></div>';
    chat += '</div>';
    var body = "";
    if (step === 1) {
      body = '<div class="field" data-f="prenume"><div class="reply">' +
        '<input id="wl-prenume" type="text" aria-label="Prenume" placeholder="Numele tău" autocomplete="given-name" value="' + esc(vals.prenume) + '" />' +
        '<button class="btn btn-primary" type="submit" aria-label="Continuă">' + ARROW + '</button></div><span class="err"></span></div>';
    } else if (step === 2) {
      body = '<div class="field" data-f="email"><div class="reply">' +
        '<input id="wl-email" type="email" aria-label="Email" placeholder="nume@exemplu.ro" autocomplete="email" value="' + esc(vals.email) + '" />' +
        '<button class="btn btn-primary" type="submit" aria-label="Continuă">' + ARROW + '</button></div><span class="err"></span></div>';
    } else {
      body = '<div class="chips">' +
        INTERESE.map(function (x) {
          var on = interese.indexOf(x) > -1;
          return '<button type="button" class="chip' + (on ? " on" : "") + '" aria-pressed="' + on + '" data-chip="' + esc(x) + '">' + esc(x) + '</button>';
        }).join("") + '</div>' +
        '<div class="field check" data-f="acord">' +
          '<label class="form-check" for="wl-acord">' +
            '<input id="wl-acord" type="checkbox" />' +
            '<span class="cc-box" aria-hidden="true"></span>' +
            '<span class="form-check-text">' +
              'Am cel puțin 18 ani, sunt de acord cu <a href="/politica-confidentialitate" target="_blank" rel="noopener noreferrer">politica de confidențialitate</a> ' +
              'și cu <a href="/termeni-conditii" target="_blank" rel="noopener noreferrer">termenii și condițiile</a>, ' +
              'și vreau să primesc pe email noutăți despre Global Explorers Club.' +
            '</span>' +
          '</label>' +
          '<span class="err"></span>' +
        '</div>' +
        '<button class="btn btn-primary" type="submit">Vreau să intru în poveste ' + ARROW + '</button>';
    }
    return chat + body +
      (step > 1 ? '<button type="button" class="step-back">← Înapoi</button>' : '') +
      '<div class="form-error" hidden></div>' +
      '<div class="form-foot">' + TICK + ' Îți poți retrage acordul oricând, scriindu-ne la contact@globalexplorers.ro.</div>';
  }

  function formHTML() {
    return CLOSE +
      '<div class="form-title" id="wl-title">Intră pe lista de așteptare</div>' +
      '<div class="form-sub">Locuri fondatoare limitate. Fără spam, promis.</div>' +
      '<form novalidate>' + stepHTML() + '</form>';
  }

  function renderStep() {
    form.innerHTML = stepHTML();
    var back = form.querySelector(".step-back");
    if (back) back.addEventListener("click", function () { step--; renderStep(); });
    form.querySelectorAll("[data-chip]").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-chip"), i = interese.indexOf(v);
        if (i > -1) interese.splice(i, 1); else interese.push(v);
        b.classList.toggle("on", i === -1);
        b.setAttribute("aria-pressed", String(i === -1));
      });
    });
    var f = form.querySelector("input[type=text], input[type=email]");
    if (f) f.focus();
  }

  function build() {
    overlay = node('<div class="contact-overlay" role="dialog" aria-modal="true" aria-labelledby="wl-title" style="display:none"><div class="contact-modal waitlist"></div></div>');
    overlay.addEventListener("mousedown", function (e) { if (e.target === overlay) close(); });
    document.body.appendChild(overlay);
  }

  function mountForm() {
    var m = overlay.querySelector(".contact-modal");
    m.innerHTML = formHTML();
    form = m.querySelector("form");
    m.querySelector(".contact-close").addEventListener("click", close);
    form.addEventListener("submit", onSubmit);
    renderStep();
  }

  function fieldErr(name, msg) {
    var f = form.querySelector('[data-f="' + name + '"]');
    f.classList.toggle("invalid", !!msg);
    f.querySelector(".err").textContent = msg || "";
  }

  function onSubmit(e) {
    e.preventDefault();
    if (step === 1) {
      vals.prenume = form.querySelector("#wl-prenume").value.trim();
      if (!vals.prenume) { fieldErr("prenume", "Spune-ne cum te cheamă."); return; }
      step = 2; renderStep(); return;
    }
    if (step === 2) {
      vals.email = form.querySelector("#wl-email").value.trim();
      if (!vals.email) { fieldErr("email", "Avem nevoie de un email."); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email)) { fieldErr("email", "Emailul nu pare valid."); return; }
      step = 3; renderStep(); return;
    }
    if (!form.querySelector("#wl-acord").checked) { fieldErr("acord", "Bifează ca să confirmi că ai 18+ ani și ești de acord."); return; }
    var data = { prenume: vals.prenume, email: vals.email, interese: interese.join(", "), capitol: interese.join(", ") }; // scriptul deployat salvează doar „capitol”

    data.acord = "da";
    data.acord_text = ACORD_TEXT;

    var btn = form.querySelector('button[type="submit"]');
    var errBox = form.querySelector(".form-error");
    errBox.hidden = true;
    btn.disabled = true;
    btn.textContent = "Se trimite…";

    fetch(ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams(data).toString()
    }).then(function () {
      showSuccess(data);
    }).catch(function () {
      btn.disabled = false;
      btn.innerHTML = SUBMIT;
      errBox.hidden = false;
      errBox.textContent = "Ceva n-a mers. Verifică conexiunea și încearcă din nou.";
    });
  }

  function showSuccess(d) {
    var m = overlay.querySelector(".contact-modal");
    m.innerHTML = CLOSE +
      '<div class="form-success">' +
        '<div class="seal"><img src="/assets/logo.png?v=3" alt="Global Explorers Club" /></div>' +
        '<h3 id="wl-title">Bine ai venit, ' + (esc(d.prenume) || "exploratorule") + '.</h3>' +
        '<p>Ești pe lista fondatorilor. Te anunțăm pe <strong style="color:var(--amber-soft)">' + esc(d.email) + '</strong> când deschidem porțile.</p>' +
        '<div class="next">' +
                    '<div class="row">' + TICK + ' Loc rezervat pe lista de așteptare</div>' +
          '<div class="row">' + TICK + ' Fără spam, doar vești de la noi</div>' +
        '</div>' +
      '</div>';
    m.querySelector(".contact-close").addEventListener("click", close);
  }

  function onKey(e) {
    if (e.key === "Escape") { close(); return; }
    if (e.key !== "Tab") return;
    var f = overlay.querySelectorAll('button, input, textarea, a[href], [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function open() {
    if (!overlay) build();
    // close any open mobile menu so the modal isn't stacked behind it
    document.querySelectorAll(".mobile-menu.open, .st-sheet.open").forEach(function (m) { m.classList.remove("open"); });
    document.querySelectorAll(".nav-toggle.open").forEach(function (t) { t.classList.remove("open"); });
    step = 1; interese = []; vals = { prenume: "", email: "" };
    mountForm();
    lastFocus = document.activeElement;
    document.documentElement.classList.add("wl-lock");
    overlay.style.display = "flex";
    document.addEventListener("keydown", onKey, true);
    requestAnimationFrame(function () {
      var i = form.querySelector("#wl-prenume");
      if (i) i.focus();
    });
  }

  function close() {
    if (!overlay) return;
    overlay.style.display = "none";
    document.documentElement.classList.remove("wl-lock");
    document.removeEventListener("keydown", onKey, true);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  }

  window.openWaitlist = open;
  window.closeWaitlist = close;

  // Intercept every waitlist trigger, on any page. Delegation survives
  // React re-renders and covers static markup identically.
  document.addEventListener("click", function (e) {
    var t = e.target.closest('[data-waitlist], a[href="#waitlist"], a[href="/#waitlist"], a[href="/index.html#waitlist"]');
    if (!t) return;
    e.preventDefault();
    open();
  });
})();
