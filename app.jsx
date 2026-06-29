const { useState, useEffect, useRef } = React;

const WAITLIST_ENDPOINT = "https://script.google.com/macros/s/AKfycbz7c3XgyTl9zhgFI3GgIV2myOJL0RtHJCotJoSemZRzrUGkoRFXrLB1_KvzMOKI4fdcIA/exec";

const Tick = (p) => (
  <svg className="tick" width={p.s||16} height={p.s||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const Arrow = () => (
  <svg className="arrow" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
);
const Play = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
);

const OwlMark = ({ size = 34 }) => (
  <img src="assets/logo.jpg" alt="Global Explorers Club logo" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block" }} />
);

function Reveal({ children, className = "", delay = "", as: Tag = "div", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); io.unobserve(el); } });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`reveal ${delay} ${className}`} {...rest}>{children}</Tag>;
}

function CountUp({ end, suffix = "", dur = 1800, decimals = 0 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let started = false;
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          const t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(end * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [end, dur]);
  const shown = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString("ro-RO");
  return <span ref={ref} className="num">{shown}<span className="suffix">{suffix}</span></span>;
}

function Embers({ count = 18 }) {
  const els = Array.from({ length: count }).map((_, i) => {
    const left = Math.random() * 100;
    const dur = 9 + Math.random() * 12;
    const delay = -Math.random() * dur;
    const drift = (Math.random() * 80 - 40) + "px";
    const size = 1.5 + Math.random() * 2.5;
    return <span key={i} className="ember" style={{ left: left + "%", animationDuration: dur + "s", animationDelay: delay + "s", width: size, height: size, "--drift": drift }} />;
  });
  return <div className="embers" aria-hidden="true">{els}</div>;
}

function Nav({ onWaitlist }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);
  const close = () => setMenuOpen(false);
  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a className="brand" href="#top" onClick={close}>
          <span className="mark"><OwlMark /></span>
          <span className="name">Global Explorers<small>Club</small></span>
        </a>
        <div className="nav-links">
          <a href="#poveste" className="nav-link-text">Povestea</a>
          <a href="#descoperi" className="nav-link-text">Ce descoperi</a>
          <a href="#drum" className="nav-link-text">Drumul eroului</a>
          <a href="#club" className="nav-link-text">Clubul</a>
          <a className="btn btn-primary" href="#waitlist" onClick={onWaitlist}>Lista de așteptare</a>
        </div>
        <button
          className={`nav-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </nav>
      <div className={`mobile-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-inner">
          <nav className="mobile-nav">
            <a href="#poveste" onClick={close}>Povestea</a>
            <a href="#descoperi" onClick={close}>Ce descoperi</a>
            <a href="#drum" onClick={close}>Drumul eroului</a>
            <a href="#club" onClick={close}>Clubul</a>
          </nav>
          <a className="btn btn-primary mobile-menu-cta" href="#waitlist" onClick={() => { close(); onWaitlist && onWaitlist(); }}>
            Lista de așteptare <Arrow />
          </a>
          <p className="mobile-menu-foot">Global Explorers Club · 2026</p>
        </div>
      </div>
    </>
  );
}

function Hero() {
  const bgRef = useRef(null), owlRef = useRef(null), glowRef = useRef(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > window.innerHeight * 1.2) return;
        if (bgRef.current) bgRef.current.style.transform = `translate3d(0, ${y * 0.22}px, 0) scale(1.06)`;
        if (owlRef.current) owlRef.current.style.transform = `translate3d(0, ${y * 0.09}px, 0)`;
        if (glowRef.current) glowRef.current.style.transform = `translate3d(0, ${y * 0.14}px, 0)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="hero vignette" id="top">
      <div className="hero-bg" ref={bgRef} />
      <div className="hero-scrim" />
      <div className="hero-glow" ref={glowRef} />
      <div className="hero-owl" ref={owlRef}><img src="assets/owl.jpg" alt="Bufnița, emblema Global Explorers Club" /></div>
      <Embers count={20} />
      <div className="wrap">
        <div className="hero-content">
          <span className="eyebrow">Comunitate prin invitație · 2026</span>
          <h1 className="display">
            <span className="line"><span>Viața ta nu e o galerie.</span></span>
            <span className="line"><span className="italic-accent" style={{fontStyle:"italic"}}>E un film.</span></span>
          </h1>
          <p className="lead">
            Global Explorers Club este locul unde oamenii nu se mai mulțumesc să privească.
            Experiențele, provocările, visele: toate devin parte din aceeași poveste.
          </p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#waitlist">Intră pe lista de așteptare <Arrow /></a>
            <a className="btn btn-ghost" href="#poveste"><Play /> Descoperă povestea</a>
          </div>
          <div className="hero-assure">
            <span><Tick s={15} /> Actualizări săptămânale</span>
            <span><Tick s={15} /> Fără spam</span>
            <span><Tick s={15} /> Acces anticipat</span>
          </div>
        </div>
      </div>
      <a className="scroll-cue" href="#poveste" aria-label="Derulează">
        <span className="mouse" />
        <span>Începe</span>
      </a>
    </header>
  );
}

function Story() {
  const points = [
    ["I", "De ce ne simțim blocați", "Trăim sute de momente, dar puține rămân. Prea multe zile trec fără să lase nimic în urmă."],
    ["II", "Ce am pierdut pe drum", "Curiozitatea. Curajul de a începe. Sentimentul că viața merge undeva. Pleacă pe rând, atât de lin încât nu le simțim lipsa."],
    ["III", "Cum o recâștigăm", "Nu cu un nou plan. Cu o privire diferită: viața ta e o poveste pe care o scrii în continuare."],
  ];
  return (
    <section className="story section-pad" id="poveste">
      <div className="wrap">
        <div className="story-grid">
          <div className="story-copy">
            <Reveal as="span" className="eyebrow">Capitolul I · Povestea</Reveal>
            <Reveal as="h2" className="h-section" delay="d1">Orice erou are<br/>nevoie de un <span className="italic-accent">început.</span></Reveal>
            <Reveal delay="d2"><p className="lead">Global Explorers Club s-a născut dintr-o întrebare pe care puțini o rostesc cu voce tare: de ce trăim atât de mult și simțim atât de puțin?</p></Reveal>
            <Reveal delay="d2"><p className="lead">Nu-ți lipsesc experiențele. Îți lipsește firul care le leagă. Și oamenii care rămân alături când e greu.</p></Reveal>
            <div className="story-points">
              {points.map(([n, h, p], i) => (
                <Reveal key={n} className="story-point" delay={`d${i+1}`}>
                  <span className="num">{n}</span>
                  <div><h4>{h}</h4><p>{p}</p></div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal className="story-visual" delay="d1">
            <div className="story-portrait">
              <img src="assets/card-com.jpg" alt="Poartă luminată sub clar de lună" />
            </div>
            <div className="story-frame-line" />
            <div className="story-quote">
              <p>„Nu aștepta scenariul. Scrie-l."</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Chapters() {
  const cards = [
    ["Capitolul 01", "Originea: MistyTrip", "Aici începe povestea. MistyTrip este locul unde Exploratorul își redescoperă sensul, își activează oul și își scrie începutul. Este spațiul dintre vis și realitate, unde primele semne ale drumului prind formă.", '„Tot ce cauți în lume începe cu tine.”', "assets/card-exp.jpg"],
    ["Capitolul 02", "Explorarea: Check-in Global", "Călătoria se deschide spre lume. Check-in Global este harta vie a exploratorilor — locurile, momentele și oamenii care dau sens drumului. Fiecare pas devine o amprentă, fiecare loc o poveste.", '„Lumea te recunoaște după urmele pe care le lași.”', "assets/card-cale.jpg"],
    ["Capitolul 03", "Sanctuarul: World Caffè", "Întoarcerea acasă. World Caffè este templul comunității, locul unde poveștile se întâlnesc și se transformă în ritualuri. Aici se celebrează sensul, se împărtășește liniștea și se aprinde flacăra continuității.", '„Când povestea ta se unește cu a altora, devine lumină.”', "assets/card-com.jpg"],
  ];
  return (
    <section className="chapters section-pad" id="descoperi">
      <div className="wrap">
        <div className="section-head">
          <Reveal as="span" className="eyebrow centered">Ce vei descoperi</Reveal>
          <Reveal as="h2" className="h-section" delay="d1">Trei capitole<br/>ale aceleiași aventuri</Reveal>
          <Reveal delay="d2"><p className="lead">Fiecare se deschide ca o nouă scenă. Alege-ți primul pas.</p></Reveal>
        </div>
        <div className="chapter-cards">
          {cards.map(([num, title, desc, quote, img], i) => (
            <Reveal key={title} className="chapter" delay={`d${i+1}`} tabIndex={0}>
              <div className="chapter-img"><img src={img} alt={title} /></div>
              <div className="chapter-body">
                <div className="chapter-num">{num}</div>
                <h3>{title}</h3>
                <p className="chapter-tagline">{quote}</p>
                <p className="chapter-desc">{desc}</p>
                <span className="read">Deschide capitolul <Arrow /></span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  const steps = [
    ["I", "Chemarea", "Un disconfort pe care nu-l poți ignora. Senzația, tot mai clară, că ești construit pentru ceva mai mult."],
    ["II", "Explorarea", "Pornești. Locuri noi, idei noi, oameni noi. Și, undeva pe drum, ceva în tine se trezește."],
    ["III", "Transformarea", "Provocările devin profesori. Te schimbi nu pentru că trebuie, ci pentru că ai văzut ce e posibil."],
    ["IV", "Comunitatea", "Nu mai mergi singur. Găsești oameni care nu au nevoie de explicații și rămân alături."],
    ["V", "Moștenirea", "Povestea ta devine harta altcuiva. Ceea ce ai trăit aprinde pe cineva care abia începe."],
  ];
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const stepRefs = useRef([]);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const track = trackRef.current; if (!track) return;
        const r = track.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = r.height;
        const progressed = Math.min(total, Math.max(0, vh * 0.55 - r.top));
        const pct = Math.max(0, Math.min(1, progressed / total));
        if (fillRef.current) fillRef.current.style.height = (pct * 100) + "%";
        stepRefs.current.forEach((el) => {
          if (!el) return;
          const nr = el.getBoundingClientRect();
          const nodeMid = nr.top + nr.height / 2;
          el.classList.toggle("active", nodeMid < vh * 0.62);
        });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <section className="journey section-pad" id="drum">
      <div className="wrap">
        <div className="section-head">
          <Reveal as="span" className="eyebrow centered">Drumul eroului</Reveal>
          <Reveal as="h2" className="h-section" delay="d1">Cinci trepte<br/>de la spectator la explorator</Reveal>
        </div>
        <div className="journey-track" ref={trackRef}>
          <div className="journey-line"><div className="fill" ref={fillRef} /></div>
          {steps.map(([roman, title, desc], i) => (
            <div className="journey-step" key={title} ref={(el) => (stepRefs.current[i] = el)}>
              <div className="journey-card">
                <div className="step-kicker">Treapta {roman}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <div className="journey-node"><span className="roman">{roman}</span></div>
              <div className="journey-side" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Club() {
  return (
    <section className="club section-pad" id="club">
      <Embers count={12} />
      <div className="wrap club-inner">
        <Reveal as="span" className="eyebrow centered">Clubul</Reveal>
        <Reveal as="h2" className="h-section" delay="d1">O mișcare.<br/>Nu o listă de membri.</Reveal>
        <Reveal delay="d2"><p className="lead" style={{margin:"22px auto 0"}}>Exploratori din toate colțurile țării. O singură certitudine comună: viața merită trăită cu tot ce ai.</p></Reveal>
        <div className="stats">
          <Reveal className="stat" delay="d1">
            <CountUp end={2400} suffix="+" />
            <div className="label">Membri</div>
            <div className="sub">pe lista de așteptare</div>
          </Reveal>
          <Reveal className="stat" delay="d2">
            <CountUp end={38} />
            <div className="label">Orașe reprezentate</div>
            <div className="sub">și în continuă creștere</div>
          </Reveal>
          <Reveal className="stat" delay="d3">
            <CountUp end={120} suffix="+" />
            <div className="label">Experiențe create</div>
            <div className="sub">călătorii, ateliere, ritualuri</div>
          </Reveal>
        </div>
        <Reveal delay="d2"><p className="club-note">* Cifre orientative. Locurile fondatoare sunt limitate.</p></Reveal>
      </div>
    </section>
  );
}

function Finale() {
  const [form, setForm] = useState({ prenume: "", email: "", capitol: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const validate = () => {
    const er = {};
    if (!form.prenume.trim()) er.prenume = "Spune-ne cum te cheamă.";
    if (!form.email.trim()) er.email = "Avem nevoie de un email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Emailul nu pare valid.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!WAITLIST_ENDPOINT) { setSent(true); return; }
    setSending(true);
    setSubmitError("");
    try {
      await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams({
          prenume: form.prenume.trim(),
          email: form.email.trim(),
          capitol: form.capitol.trim(),
        }).toString(),
      });
      setSent(true);
    } catch {
      setSubmitError("Ceva n-a mers. Verifică conexiunea și încearcă din nou.");
    } finally {
      setSending(false);
    }
  };
  return (
    <section className="finale section-pad vignette" id="waitlist">
      <div className="finale-bg" />
      <Embers count={14} />
      <div className="wrap">
        <div className="finale-grid">
          <div className="finale-copy">
            <Reveal as="span" className="eyebrow">Capitolul final. Sau primul tău.</Reveal>
            <Reveal as="h2" className="h-section" delay="d1">Povestea ta merită mai mult decât un <span className="italic-accent">spectator.</span></Reveal>
            <Reveal delay="d2"><p className="lead">Fii printre primii care știu ce urmează.</p></Reveal>
            <Reveal className="finale-trust" delay="d3">
              <div className="item"><Tick /><div><strong>Actualizări săptămânale</strong><span>Din culise, în fiecare săptămână.</span></div></div>
              <div className="item"><Tick /><div><strong>Conținut exclusiv</strong><span>Idei și resurse înainte ca ele să devină publice.</span></div></div>
              <div className="item"><Tick /><div><strong>Acces anticipat</strong><span>Invitații la experiențe și evenimente viitoare.</span></div></div>
            </Reveal>
          </div>
          <Reveal className="form-card" delay="d2">
            {!sent ? (
              <form onSubmit={submit} noValidate>
                <div className="form-title">Intră pe lista de așteptare</div>
                <div className="form-sub">Locuri fondatoare limitate. Fără spam, promis.</div>
                <div className={`field ${errors.prenume ? "invalid" : ""}`}>
                  <label htmlFor="prenume">Prenume</label>
                  <input id="prenume" type="text" placeholder="Cum te cheamă?" value={form.prenume} onChange={set("prenume")} />
                  <span className="err">{errors.prenume}</span>
                </div>
                <div className={`field ${errors.email ? "invalid" : ""}`}>
                  <label htmlFor="email">Email</label>
                  <input id="email" type="email" placeholder="nume@exemplu.ro" value={form.email} onChange={set("email")} />
                  <span className="err">{errors.email}</span>
                </div>
                <div className="field">
                  <label htmlFor="capitol">Ce capitol din viața ta vrei să schimbi? <span className="opt">(opțional)</span></label>
                  <textarea id="capitol" rows={3} placeholder="Scrie în câteva cuvinte…" value={form.capitol} onChange={set("capitol")} />
                </div>
                <button className="btn btn-primary" type="submit" disabled={sending}>
                  {sending ? "Se trimite…" : <>Vreau să intru în poveste <Arrow /></>}
                </button>
                {submitError && <div className="form-error">{submitError}</div>}
                <div className="form-foot"><Tick s={13} /> Te poți dezabona oricând, cu un singur clic.</div>
              </form>
            ) : (
              <div className="form-success">
                <div className="seal"><OwlMark size={64} /></div>
                <h3>Bine ai venit, {form.prenume || "exploratorule"}.</h3>
                <p>Ești pe lista fondatorilor. Primul mesaj ajunge la <strong style={{color:"var(--amber-soft)"}}>{form.email}</strong> în curând.</p>
                <div className="next">
                  <div className="row"><Tick /> Confirmare trimisă pe email</div>
                  <div className="row"><Tick /> Loc rezervat pe lista de așteptare</div>
                  <div className="row"><Tick /> Primești update-urile săptămânale</div>
                </div>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Social({ d, label, href }) {
  return <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">{d}</svg></a>;
}
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a className="brand" href="#top">
              <span className="mark"><OwlMark /></span>
              <span className="name">Global Explorers<small>Club</small></span>
            </a>
            <p className="footer-about">O comunitate pentru cei care trăiesc cu intenție.</p>
          </div>
          <div className="footer-col">
            <h5>Explorează</h5>
            <a href="#poveste">Povestea</a>
            <a href="#descoperi">Ce vei descoperi</a>
            <a href="#drum">Drumul eroului</a>
            <a href="#club">Clubul</a>
          </div>
          <div className="footer-col">
            <h5>Comunitate</h5>
            <a href="#waitlist">Lista de așteptare</a>
            <a href="#">Experiențe</a>
            <a href="#">Evenimente</a>
            <a href="#">Povești ale membrilor</a>
          </div>
          <div className="footer-col">
            <h5>Legal</h5>
            <a href="#">Contact</a>
            <a href="politica-confidentialitate.html">Politică de confidențialitate</a>
            <a href="termeni-conditii.html">Termeni și condiții</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Global Explorers Club. Toate poveștile rezervate.</p>
          <div className="footer-social">
            <Social label="Instagram" href="https://www.instagram.com/globalexplorersclub1/" d={<path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.06 1.8.25 2.2.42.6.22 1 .48 1.4.9.42.4.68.8.9 1.4.17.4.36 1 .42 2.2.06 1.2.07 1.6.07 4.8s0 3.6-.07 4.8c-.06 1.2-.25 1.8-.42 2.2-.22.6-.48 1-.9 1.4-.4.42-.8.68-1.4.9-.4.17-1 .36-2.2.42-1.2.06-1.6.07-4.8.07s-3.6 0-4.8-.07c-1.2-.06-1.8-.25-2.2-.42a3.8 3.8 0 0 1-1.4-.9 3.8 3.8 0 0 1-.9-1.4c-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.8c.06-1.2.25-1.8.42-2.2.22-.6.48-1 .9-1.4.4-.42.8-.68 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.43-1.3.83-.4.4-.63.8-.83 1.3-.16.4-.35 1-.4 2.1C2.6 9.7 2.6 10.1 2.6 12s0 2.3.07 3.5c.05 1.1.24 1.7.4 2.1.2.5.43.9.83 1.3.4.4.8.63 1.3.83.4.16 1 .35 2.1.4 1.2.07 1.6.07 4.7.07s3.5 0 4.7-.07c1.1-.05 1.7-.24 2.1-.4.5-.2.9-.43 1.3-.83.4-.4.63-.8.83-1.3.16-.4.35-1 .4-2.1.07-1.2.07-1.6.07-3.5s0-2.3-.07-3.5c-.05-1.1-.24-1.7-.4-2.1a3.5 3.5 0 0 0-.83-1.3 3.5 3.5 0 0 0-1.3-.83c-.4-.16-1-.35-2.1-.4C15.5 4 15.1 4 12 4Zm0 3.06A4.94 4.94 0 1 1 12 17a4.94 4.94 0 0 1 0-9.88Zm0 1.8a3.14 3.14 0 1 0 0 6.28 3.14 3.14 0 0 0 0-6.28Zm5.14-.95a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/>} />
            <Social label="TikTok" href="https://www.tiktok.com/@globalexplorersclub1" d={<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.05.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1Z"/>} />
            <Social label="Facebook" href="https://www.facebook.com/people/Global-Explorers-Club/61590750172396/" d={<path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/>} />
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Story />
      <Chapters />
      <Journey />
      <Club />
      <Finale />
      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
