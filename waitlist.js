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

  function formHTML() {
    return CLOSE +
      '<div class="form-title" id="wl-title">Intră pe lista de așteptare</div>' +
      '<div class="form-sub">Locuri fondatoare limitate. Fără spam, promis.</div>' +
      '<form novalidate>' +
        '<div class="field" data-f="prenume">' +
          '<label for="wl-prenume">Prenume</label>' +
          '<input id="wl-prenume" type="text" placeholder="Cum te cheamă?" autocomplete="given-name" />' +
          '<span class="err"></span>' +
        '</div>' +
        '<div class="field" data-f="email">' +
          '<label for="wl-email">Email</label>' +
          '<input id="wl-email" type="email" placeholder="nume@exemplu.ro" autocomplete="email" />' +
          '<span class="err"></span>' +
        '</div>' +
        '<div class="field">' +
          '<label for="wl-capitol">Dacă ai fi avut acest sistem de la început, acesta al câtelea capitol ar fi? <span class="opt">(opțional)</span></label>' +
          '<textarea id="wl-capitol" rows="3" placeholder="Povestește-ne în câteva cuvinte…"></textarea>' +
        '</div>' +
        '<button class="btn btn-primary" type="submit">' + SUBMIT + '</button>' +
        '<div class="form-error" hidden></div>' +
        '<div class="form-foot">' + TICK + ' Te poți dezabona oricând, cu un singur clic.</div>' +
      '</form>';
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
  }

  function fieldErr(name, msg) {
    var f = form.querySelector('[data-f="' + name + '"]');
    f.classList.toggle("invalid", !!msg);
    f.querySelector(".err").textContent = msg || "";
  }

  function onSubmit(e) {
    e.preventDefault();
    var data = {
      prenume: form.querySelector("#wl-prenume").value.trim(),
      email: form.querySelector("#wl-email").value.trim(),
      capitol: form.querySelector("#wl-capitol").value.trim()
    };

    var valid = true;
    if (!data.prenume) { fieldErr("prenume", "Spune-ne cum te cheamă."); valid = false; } else fieldErr("prenume", "");
    if (!data.email) { fieldErr("email", "Avem nevoie de un email."); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { fieldErr("email", "Emailul nu pare valid."); valid = false; }
    else fieldErr("email", "");
    if (!valid) return;

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
        '<p>Ești pe lista fondatorilor. Primul mesaj ajunge la <strong style="color:var(--amber-soft)">' + esc(d.email) + '</strong> în curând.</p>' +
        '<div class="next">' +
          '<div class="row">' + TICK + ' Confirmare trimisă pe email</div>' +
          '<div class="row">' + TICK + ' Loc rezervat pe lista de așteptare</div>' +
          '<div class="row">' + TICK + ' Primești update-urile săptămânale</div>' +
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
