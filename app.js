(() => {
  const L = window.LOVE, $ = (s) => document.querySelector(s), panel = $("#panel");
  const calm = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const el = (tag, cls, text, i) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (i != null) { e.classList.add("in"); e.style.setProperty("--i", i); } return e; };
  const btn = (text, fn, cls = "btn") => { const b = el("button", cls, text); b.onclick = fn; return b; };
  const row = (...k) => { const r = el("div", "row in"); r.append(...k); return r; };
  const HEART = "M0 24C-40-2-18-32 0-12C18-32 40-2 0 24Z";
  const sleep = (ms) => new Promise((r) => setTimeout(r, calm ? 0 : ms));
  const onMac = ["localhost", "127.0.0.1"].includes(location.hostname); // answers save to a file only here
  let keeps = [], all = [], run = 0, visit = "";
  const newVisit = () => { visit = Date.now().toString(36) + Math.random().toString(36).slice(2); };
  const remember = (question, answer) => onMac && fetch("/api/answer", { method: "POST", keepalive: true, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visit, question, answer }) })
    .then((r) => { if (!r.ok) throw r.status; }).catch((e) => console.error("Answer not saved", e));
  newVisit();

  $("#bud").innerHTML = Flowers.bud();
  document.title = "For " + L.herName;
  $("#gate-for").textContent = "For " + L.herName;
  $("#brand").hidden = !L.yourName;
  $("#brand-name").textContent = "Made with love by " + L.yourName;

  /* ---------- petals, hearts ---------- */
  const layers = ["#sky", "#front"].map((s) => { const c = $(s); return { c, x: c.getContext("2d") }; });
  let W, H, D;
  const size = () => { D = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; layers.forEach(({ c, x }) => { c.width = W * D; c.height = H * D; x.setTransform(D, 0, 0, D, 0, 0); }); };
  addEventListener("resize", size); size();
  const PINKS = ["#ff6fa5", "#f0568f", "#ffc2d8", "#fff0f5", "#d81b60", "#ff9d9d"], pick = (a) => a[Math.random() * a.length | 0];
  const heartPath = new Path2D(HEART), petalPath = new Path2D("M0 10C-12 2-9-10 0-10C9-10 12 2 0 10Z");
  const fall = Array.from({ length: calm ? 0 : Math.min(34, W / 24) }, () => ({ x: Math.random() * W, y: Math.random() * H, v: .3 + Math.random() * .7, p: Math.random() * 7, s: .5 + Math.random() * .7, c: pick(PINKS) }));
  let bits = [], swarm = [];
  function burst(x, y, n = 16, pow = 6) {
    if (calm) return;
    for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, v = pow * (.3 + Math.random()); bits.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, r: Math.random() * 6, vr: (Math.random() - .5) * .2, s: .25 + Math.random() * .45, life: 1, c: pick(PINKS), k: Math.random() < .5 ? heartPath : petalPath }); }
    if (bits.length > 500) bits.splice(0, bits.length - 500);
  }
  function heartSwarm() {
    if (calm) return;
    swarm = Array.from({ length: 190 }, (_, i) => { const t = i / 190 * 6.283; return { x: Math.random() * W, y: H + Math.random() * 200, t, s: .16 + Math.random() * .2, c: pick(PINKS.slice(0, 2).concat("#d81b60")) }; });
  }
  function draw(x, o, path, a) { x.save(); x.globalAlpha = a; x.translate(o.x, o.y); x.rotate(o.r || 0); x.scale(o.s, o.s); x.fillStyle = o.c; x.fill(path); x.restore(); }
  let clock = 0, last = performance.now();
  (function tick(now = last) {
    const real = Math.max(0, now - last) / 16.7, k = Math.min(3, real); last = now; clock += k / 60;
    layers.forEach(({ x }) => x.clearRect(0, 0, W, H));
    for (const p of fall) { p.y += p.v * k; p.p += .02 * k; p.x += Math.sin(p.p) * .5 * k; if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; } p.r = p.p; draw(layers[0].x, p, petalPath, .75); }
    if (swarm.length) {
      const a = $("#art").getBoundingClientRect(), cx = a.left + a.width / 2, cy = a.top + a.height * .46, sc = Math.min(a.width, a.height) / 30 * (1 + .025 * Math.sin(clock * 4));
      for (const p of swarm) { const tx = cx + 16 * Math.sin(p.t) ** 3 * sc, ty = cy - (13 * Math.cos(p.t) - 5 * Math.cos(2 * p.t) - 2 * Math.cos(3 * p.t) - Math.cos(4 * p.t)) * sc; p.x += (tx - p.x) * .035 * k; p.y += (ty - p.y) * .035 * k; p.t += .0012 * k; draw(layers[0].x, p, heartPath, .95); }
    }
    bits = bits.filter((b) => (b.life -= .013 * real) > 0);
    for (const b of bits) { b.vy += .11 * k; b.vx *= .985; b.x += b.vx * k; b.y += b.vy * k; b.r += b.vr * k; draw(layers[1].x, b, b.k, Math.min(1, b.life * 2)); }
    requestAnimationFrame(tick);
  })();
  addEventListener("pointerdown", (e) => burst(e.clientX, e.clientY, 7, 3.5));
  const burstOn = (e, n = 26) => { const r = e.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, n, 7); };

  /* ---------- a tiny music box ---------- */
  let ac, master, playing = false, loop, beat = 0;
  const CH = [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]], TUNE = [79, 0, 76, 79, 84, 0, 83, 79, 81, 0, 76, 0, 72, 74, 76, 0, 77, 0, 81, 79, 77, 0, 76, 72, 74, 0, 79, 0, 74, 76, 74, 0];
  function ping(m, t, g, len) { const o = ac.createOscillator(), o2 = ac.createOscillator(), v = ac.createGain(), v2 = ac.createGain(), f = 440 * 2 ** ((m - 69) / 12); o.type = "sine"; o.frequency.value = f; o2.frequency.value = f * 4; v2.gain.value = .12; v.gain.setValueAtTime(0, t); v.gain.linearRampToValueAtTime(g, t + .008); v.gain.exponentialRampToValueAtTime(.0008, t + len); o.connect(v); o2.connect(v2).connect(v); v.connect(master); o.start(t); o2.start(t); o.stop(t + len); o2.stop(t + len); }
  function music(on) {
    playing = on; $("#music").textContent = on ? "Music off" : "Music on"; $("#music").setAttribute("aria-pressed", on); clearInterval(loop);
    try {
      if (!ac) { ac = new (window.AudioContext || webkitAudioContext)(); master = ac.createGain(); const d = ac.createDelay(1), fb = ac.createGain(); d.delayTime.value = .36; fb.gain.value = .3; master.connect(ac.destination); master.connect(d); d.connect(fb).connect(d); fb.connect(ac.destination); }
      ac.resume(); master.gain.value = on ? .5 : 0;
      if (on) loop = setInterval(() => { const t = ac.currentTime + .05, s = beat++ % 32, c = CH[s / 8 | 0]; ping(c[[0, 2, 1, 3, 2, 1, 3, 2][s % 8]], t, .13, 1.6); if (TUNE[s]) ping(TUNE[s], t, .2, 2.2); if (s % 8 === 0) ping(c[0] - 12, t, .2, 3); }, 330);
    } catch { $("#music").hidden = true; }
  }
  $("#music").onclick = () => music(!playing);
  document.addEventListener("visibilitychange", () => { if (ac) document.hidden ? ac.suspend() : ac.resume(); });
  const chime = () => { if (ac && playing) [72, 76, 79, 84].forEach((n, i) => ping(n, ac.currentTime + i * .08, .18, 1.4)); };

  /* ---------- scenes ---------- */
  function scene(name, ...kids) {
    run++; document.body.dataset.scene = name; panel.replaceChildren(...kids); scrollTo({ top: 0, behavior: calm ? "auto" : "smooth" });
  }

  $("#gate").onclick = async (e) => {
    $("#gate").onclick = null; music(true); $("#music").hidden = false;
    burst(innerWidth / 2, innerHeight / 2, 90, 13);
    $("#gate").classList.add("open"); await sleep(950);
    $("#main").hidden = false; $("#art").innerHTML = Flowers.bouquet(); sBouquet();
    await sleep(700); $("#gate").hidden = true;
  };

  function loveSVG() { const d = el("div"); d.innerHTML = `<svg class="iloveyou" viewBox="0 0 560 130" role="img" aria-label="I love you"><text x="0" y="100" textLength="550" lengthAdjust="spacingAndGlyphs">I love you</text></svg>`; return d.firstChild; }

  function sBouquet() {
    const note = el("div", "note", null, 6), p = el("p", "", "Each flower is hiding a note. Tap one."), small = el("small", "", "");
    note.append(p, small);
    scene("bouquet", el("p", "to", `For ${L.herName}`, 2), loveSVG(), el("p", "lead", "I picked every one of these thinking of you.", 5), note, row(btn("I have some questions for you", () => sQuestion(0))));
    const seen = new Set(), fl = [...document.querySelectorAll(".fl")];
    fl.forEach((f) => {
      const open = () => {
        const i = +f.dataset.i; seen.add(i); p.textContent = L.notes[i % L.notes.length];
        p.style.setProperty("--i", 0); p.classList.remove("in"); void p.offsetWidth; p.classList.add("in");
        small.textContent = seen.size === fl.length ? "You found every note. I hope you believe them all." : `${seen.size} of ${fl.length} notes found`;
        burstOn(f, 14); if (ac && playing) ping(72 + [0, 2, 4, 7, 9][i % 5] + 12 * (i % 2), ac.currentTime, .2, 1.4);
      };
      f.onclick = open; f.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } };
    });
  }

  function sQuestion(n) {
    const q = L.questions[n]; if (!q) return L.photos.length ? sPhotos() : sLetter();
    const box = el("div", "in"); box.style.setProperty("--i", 2);
    let done = false;
    const answer = (value, reply) => {
      if (done) return; done = true; all.push([q.ask, value]); remember(q.ask, value); if (q.keep) keeps.push([q.keep, value]);
      Flowers.addBonus(n); chime(); burstOn($("#art"), 34);
      box.append(el("p", "reply in", reply), row(btn(n + 1 < L.questions.length ? "Next question" : "One more thing", () => sQuestion(n + 1))));
      box.lastChild.scrollIntoView({ block: "nearest", behavior: calm ? "auto" : "smooth" });
    };
    if (q.type === "choice") {
      const o = el("div", "opts");
      q.options.forEach(([t, r]) => { const b = btn(t, () => { if (done) return; o.classList.add("done"); b.classList.add("picked"); answer(t, r); }, "opt"); o.append(b); });
      box.append(o);
    } else if (q.type === "slider") {
      const big = el("span", "big", "0%"), r = el("input"), hint = el("p", "reply", "Slide the heart.");
      Object.assign(r, { type: "range", min: 0, max: 100, value: 0 }); r.setAttribute("aria-label", q.ask);
      const go = btn("That's my answer", () => { if (done) return; go.parentNode.remove(); r.disabled = true; hint.remove(); const inf = +r.value >= 100; answer(big.textContent, inf ? "Infinity? Good. I was already there waiting for you." : "Noted. I love you enough to cover the rest."); });
      r.oninput = () => { const v = +r.value; r.style.setProperty("--v", v + "%"); big.textContent = v >= 100 ? "∞" : v + "%"; hint.textContent = v >= 100 ? "It went right off the scale." : v > 70 ? "Getting warmer…" : v > 35 ? "Only that much? Keep going." : "Surely there's more."; if (v >= 100) burstOn(big, 30); };
      box.append(big, r, hint, row(go));
    } else if (q.type === "text") {
      const i = el("input"); i.type = "text"; i.maxLength = 90; i.placeholder = q.placeholder; i.setAttribute("aria-label", q.ask);
      const go = btn("Promise me", () => { const v = i.value.trim(); if (!v) { i.placeholder = "Tell me, anything at all"; return i.focus(); } if (done) return; go.parentNode.remove(); i.disabled = true; answer(v, q.reply); });
      i.onkeydown = (e) => { if (e.key === "Enter") go.click(); };
      box.append(i, row(go));
    } else {
      const f = el("div", "forever"), says = ["No", "Are you sure?", "Really sure?", "Look at the flowers!", "Pretty please?", "Okay, yes!"]; let c = 0;
      const yes = btn("Yes, forever", () => { if (done) return; f.remove(); answer("Yes", q.reply); for (let i = 0; i < 7; i++) setTimeout(() => burst(Math.random() * W, Math.random() * H * .6, 34, 8), i * 220); });
      let lastMove = 0;
      const dodge = () => {
        if (performance.now() - lastMove < 260) return; lastMove = performance.now();
        if (c >= 5) return yes.click();
        c++; no.textContent = says[c]; yes.style.setProperty("--s", 1 + c * .07);
        if (c === 5) { no.style.translate = "0 0"; return; }
        const p = panel.getBoundingClientRect(), span = Math.max(0, p.width - no.offsetWidth), tx = Math.random() * span, ty = [80, -65, 95, -50][c % 4];
        no.style.translate = `${tx - no.offsetLeft + f.offsetLeft}px ${ty}px`;
      };
      const no = btn(says[0], dodge, "soft");
      no.onpointerenter = (e) => { if (e.pointerType === "mouse" && c < 5) dodge(); };
      f.append(yes, no); box.append(f);
    }
    scene("question", el("h2", "", q.ask, 0), box);
    if (n === 0 && onMac) panel.append(el("p", "keepnote", "I'm keeping your answers forever ♥", 4));
  }

  function sPhotos() {
    const g = el("div", "polaroids");
    L.photos.forEach((ph, i) => { const f = el("figure", "", null, i + 1), im = el("img"); im.src = ph.file; im.alt = ph.caption || "Us"; f.append(im, el("figcaption", "", ph.caption || "")); g.append(f); });
    scene("photos", el("h2", "", "My favourite person, in pictures", 0), g, row(btn("One more thing", sLetter)));
  }

  function sLetter() {
    const b = btn("", open, "envelope in"); b.setAttribute("aria-label", "Open the letter");
    b.innerHTML = `<svg viewBox="0 0 430 290"><rect width="430" height="290" rx="16" fill="#fff3f8"/><path d="M0 280L170 130M430 280L260 130" stroke="#ffb3cf" stroke-width="3"/><path d="M4 6L198 172Q215 186 232 172L426 6Q420 0 414 0H16Q8 0 4 6Z" fill="#ffd3e3"/><circle cx="215" cy="160" r="44" fill="#c9175e"/><circle cx="215" cy="160" r="35" fill="none" stroke="#8e0b3c" stroke-opacity=".5" stroke-width="3"/><path transform="translate(215 163) scale(.85)" d="${HEART}" fill="#ffd3e3"/></svg>`;
    scene("letter", el("h2", "", "I wrote you a letter", 0), b, el("p", "reply in", "Break the seal."));
    function open() {
      chime(); burstOn(b, 40);
      const l = el("article", "letter in"); l.append(el("p", "", L.herName[0].toUpperCase() + L.herName.slice(1) + ",", 1));
      L.letter.forEach((t, i) => l.append(el("p", "", t, 4 + i * 5)));
      l.append(el("p", "", "Yours, " + (L.yourName || "always"), 4 + L.letter.length * 5));
      const since = L.togetherSince && new Date(L.togetherSince + "T00:00"), days = since ? Math.floor((Date.now() - since) / 864e5) : -1;
      if (days >= 0) l.append(el("p", "days", `${days.toLocaleString()} days of us, and counting.`));
      scene("letter", l, row(btn("I need a hug now", sHug)));
    }
  }

  function sHug() {
    const b = el("button", "in"); b.id = "hug"; b.setAttribute("aria-label", "Press and hold for a hug");
    b.innerHTML = `<svg viewBox="-34 -32 68 62"><defs><linearGradient id="hugfill" x1="0" y1="1" x2="0" y2="0"><stop id="h1" offset="0" stop-color="#c9175e"/><stop id="h2" offset="0" stop-color="#ff7fae"/></linearGradient></defs><path d="${HEART}" fill="url(#hugfill)" stroke="#fff" stroke-width="1.2"/></svg><span>Hold me</span>`;
    const msg = el("p", "reply", "Press the heart and don't let go."), label = b.querySelector("span");
    scene("hug", el("h2", "", "Come here. Hug me.", 0), b, msg);
    let h = 0, held = false, done = false, prev = performance.now(); const id = run;
    const set = (v) => (e) => { if (e.type === "keydown" || e.type === "keyup") { if (e.key !== " " && e.key !== "Enter") return; e.preventDefault(); } held = v; };
    b.onpointerdown = (e) => { try { b.setPointerCapture(e.pointerId); } catch {} held = true; }; b.onpointerup = b.onpointercancel = set(false); b.onkeydown = set(true); b.onkeyup = b.onblur = set(false); b.oncontextmenu = (e) => e.preventDefault();
    (function step(now = prev) {
      if (id !== run || done) return;
      const dt = Math.max(0, now - prev) / 1000; prev = now; h = Math.max(0, Math.min(1, h + (held ? dt / 3.2 : -dt / 2)));
      b.style.setProperty("--h", h); b.querySelector("#h1").setAttribute("offset", h); b.querySelector("#h2").setAttribute("offset", h);
      msg.textContent = h === 0 ? "Press the heart and don't let go." : !held ? "Hey, not yet!" : h < .35 ? "Closer…" : h < .7 ? "Tighter…" : "Almost never letting go…";
      if (held && Math.random() < .15) burstOn(b, 2);
      if (h >= 1) { done = true; label.textContent = "Got you"; msg.textContent = "Hug delivered. That one was real, I felt it too."; chime(); burstOn(b, 90); panel.append(row(btn("Show me the ending", sFinale))); panel.lastChild.scrollIntoView({ block: "nearest" }); return; }
      requestAnimationFrame(step);
    })();
  }

  function sFinale() {
    heartSwarm();
    const langs = ["Je t'aime", "Te amo", "मुझे तुमसे प्यार है", "사랑해", "Ti amo", "愛してる", "Ich liebe dich", "In every language, it's you"], lp = el("p", "langs", langs[0], 3);
    const kids = [el("p", "to", "And in case you forgot,", 0), loveSVG(), lp];
    if (keeps.length) { const dl = el("dl", "keeps in"); keeps.forEach(([k, v]) => { const d = el("div"); d.append(el("dt", "", k), el("dd", "", v)); dl.append(d); }); kids.push(dl); }
    const save = btn("Save our bouquet", () => savePic(save), all.length ? "soft" : "btn");
    if (onMac) kids.push(el("p", "keepnote", "I'm keeping your answers forever ♥"));
    if (all.length) {
      const wa = el("a", "btn", "Send my answers on WhatsApp"); wa.target = "_blank"; wa.rel = "noopener";
      wa.href = "https://wa.me/?text=" + encodeURIComponent("My answers for " + (L.yourName || "you") + " ♥\n\n" + all.map(([k, v]) => `${k}\n→ ${v}`).join("\n\n"));
      kids.push(row(wa), el("p", "keepnote", "Choose me in WhatsApp, then press send. I'm waiting to read them."));
    }
    kids.push(row(save, btn("See it again", () => { swarm = []; keeps = []; all = []; newVisit(); $("#art").innerHTML = Flowers.bouquet(); sBouquet(); }, "soft")));
    scene("finale", ...kids);
    for (let i = 0; i < 12; i++) setTimeout(() => burst(W * (.1 + Math.random() * .8), H * (.1 + Math.random() * .4), 30, 8), i * 380);
    let i = 0; const id = run, t = setInterval(() => { if (id !== run) return clearInterval(t); lp.textContent = langs[++i % langs.length]; }, 1900);
  }

  async function savePic(b) {
    try {
      await document.fonts.ready;
      const svg = $("#bouquet").cloneNode(true); svg.setAttribute("width", 900); svg.setAttribute("height", 1170);
      const im = new Image(); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg)); await im.decode();
      const c = document.createElement("canvas"); c.width = 1080; c.height = 1620; const x = c.getContext("2d"), g = x.createRadialGradient(540, 640, 50, 540, 700, 1150);
      g.addColorStop(0, "#fff0f6"); g.addColorStop(.5, "#ffd0e2"); g.addColorStop(1, "#ff9dc3"); x.fillStyle = g; x.fillRect(0, 0, 1080, 1620);
      x.drawImage(im, 90, 60, 900, 1170); x.textAlign = "center"; x.fillStyle = "#c9175e"; x.font = "130px 'Yeseva One',serif"; x.fillText("I love you", 540, 1390);
      x.fillStyle = "#5c0c35"; x.font = "700 56px Gaegu,cursive"; x.fillText(`For ${L.herName}, forever`, 540, 1480, 980);
      if (L.yourName) { x.font = "600 34px Figtree,sans-serif"; x.fillText("♥ Made with love by " + L.yourName, 540, 1560, 980); }
      const a = el("a"); a.download = "our-bouquet.png"; a.href = c.toDataURL("image/png"); a.click(); b.textContent = "Bouquet saved";
    } catch { b.textContent = "Couldn't save. Take a screenshot instead"; }
  }
})();
