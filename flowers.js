// Every flower is drawn by code, petal by petal. Centre is 0,0.
window.Flowers = (() => {
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const jit = (a) => (rnd() - .5) * 2 * a;
  const PAL = {
    red:   ["#8e0b3c", "#d81b60", "#f2538c"],
    hot:   ["#c2185b", "#f0568f", "#ff9dc1"],
    blush: ["#e8709b", "#ffa9c6", "#ffdbe8"],
    cream: ["#f39ab5", "#ffd9e2", "#fff6f3"],
    coral: ["#d63d56", "#ff7d85", "#ffb9b3"],
    lilac: ["#9c4f9e", "#d594d8", "#f3d3f3"],
    white: ["#f7c2d3", "#fff0f5", "#ffffff"]
  };
  const defs = () => Object.entries(PAL).map(([k, c]) =>
    `<radialGradient id="g-${k}" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform="scale(62)">
     <stop offset="0" stop-color="${c[0]}"/><stop offset=".55" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></radialGradient>
     <linearGradient id="l-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[2]}"/><stop offset=".5" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[0]}"/></linearGradient>`).join("") +
    `<linearGradient id="paperA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff6fa"/><stop offset="1" stop-color="#ffc4da"/></linearGradient>
     <linearGradient id="paperC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9fc3"/><stop offset="1" stop-color="#e2558f"/></linearGradient><linearGradient id="paperB" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ffb3cf"/></linearGradient>`;

  const ring = (n, R, w, rot, fill, stroke, shape) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      const a = rot + i * 360 / n + jit(5), r = R * (1 + jit(.05)), W = w * (1 + jit(.06));
      const d = shape === "point" ? `M0 0C${-W} ${-r * .35} ${-W * .7} ${-r * .75} 0 ${-r}C${W * .7} ${-r * .75} ${W} ${-r * .35} 0 0Z`
        : shape === "notch" ? `M0 0C${-W * 1.1} ${-r * .3} ${-W * 1.1} ${-r * .95} ${-W * .35} ${-r}Q${-W * .1} ${-r * 1.02} 0 ${-r * .92}Q${W * .15} ${-r * 1.04} ${W * .4} ${-r * .99}C${W * 1.1} ${-r * .9} ${W * 1.1} ${-r * .3} 0 0Z`
        : `M0 0C${-W * 1.25} ${-r * .25} ${-W * 1.05} ${-r} 0 ${-r}C${W * 1.05} ${-r} ${W * 1.25} ${-r * .25} 0 0Z`;
      s += `<path d="${d}" transform="rotate(${a.toFixed(1)})" fill="${fill}" stroke="${stroke}" stroke-opacity=".28" stroke-width="1"/>`;
    }
    return s;
  };
  const scaled = (k, s) => `<g transform="scale(${k})">${s}</g>`;

  const T = {
    rose(p) {
      const g = `url(#g-${p})`, st = PAL[p][0]; let s = "";
      [[6, 1], [5, .84], [5, .68], [4, .52], [3, .38]].forEach(([n, k], i) => s += scaled(k, ring(n, 60, 40, i * 37, g, st)));
      return s + `<circle r="13" fill="${PAL[p][1]}"/><path d="M-11 2C-10-12 10-13 11 0C11 10-5 11-6 2C-6-5 5-6 5 1C5 5 0 5-1 2" fill="none" stroke="${st}" stroke-width="2.4" stroke-linecap="round"/>`;
    },
    peony(p) {
      const g = `url(#g-${p})`, st = PAL[p][0]; let s = "";
      [[8, 1], [8, .87], [7, .74], [7, .6], [6, .46], [5, .33]].forEach(([n, k], i) => s += scaled(k, ring(n, 62, 31, i * 23, g, st, "notch")));
      for (let i = 0; i < 9; i++) s += `<circle cx="${jit(8)}" cy="${jit(8)}" r="1.8" fill="#ffe08f"/>`;
      return s;
    },
    ranunculus(p) {
      const g = `url(#g-${p})`, st = PAL[p][0]; let s = "";
      for (let i = 0; i < 9; i++) s += scaled(1 - i * .098, ring(7, 50, 31, i * 31, g, st));
      return s + `<circle r="7" fill="#c8d98a"/><circle r="3.5" fill="#8fae58"/>`;
    },
    daisy(p) {
      let s = ring(15, 47, 9, 0, `url(#g-${p})`, PAL[p][0]) + scaled(.86, ring(15, 47, 9, 12, `url(#g-${p})`, PAL[p][0]));
      s += `<circle r="14" fill="#f5b52e"/><circle r="11" fill="#ffd766"/>`;
      for (let i = 0; i < 22; i++) { const a = i * 2.4, r = Math.sqrt(i) * 2.4; s += `<circle cx="${Math.cos(a) * r}" cy="${Math.sin(a) * r}" r="1.2" fill="#d98a10"/>`; }
      return s;
    },
    lily(p) {
      let s = ring(3, 66, 27, 0, `url(#g-${p})`, PAL[p][0], "point") + ring(3, 64, 25, 60, `url(#g-${p})`, PAL[p][0], "point");
      for (let i = 0; i < 6; i++) {
        s += `<g transform="rotate(${i * 60})"><path d="M0 0V-58" stroke="${PAL[p][0]}" stroke-opacity=".4"/>`;
        for (let j = 0; j < 5; j++) s += `<circle cx="${jit(6)}" cy="${-14 - j * 5}" r="1.2" fill="${PAL[p][0]}"/>`;
        s += `</g><g transform="rotate(${i * 60 + 30})"><path d="M0 0Q4-14 0-27" stroke="#b9cf83" stroke-width="2" fill="none"/><ellipse cy="-28" rx="4.5" ry="2.4" fill="#a8482b"/></g>`;
      }
      return s + `<circle r="5" fill="#cfe09a"/>`;
    },
    tulip(p) {
      const g = `url(#l-${p})`, st = PAL[p][0];
      return `<g stroke="${st}" stroke-opacity=".35"><path d="M-30-34C-40 8-26 40 0 42C10 10-8-20-30-34Z" fill="${g}"/><path d="M30-34C40 8 26 40 0 42C-10 10 8-20 30-34Z" fill="${g}"/><path d="M0-48C-28-18-26 30 0 42C26 30 28-18 0-48Z" fill="${g}"/></g><path d="M0-38V30" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>`;
    }
  };

  const TIE = [300, 585];
  // x, y, scale, type, palette
  const MAIN = [
    [300, 108, 1.0, "lily", "cream"], [202, 142, .98, "rose", "hot"], [398, 140, .98, "rose", "red"],
    [122, 222, 1.0, "peony", "blush"], [478, 222, 1.0, "ranunculus", "coral"],
    [298, 208, 1.05, "peony", "hot"], [214, 252, .92, "daisy", "white"], [386, 250, 1.0, "ranunculus", "cream"],
    [146, 328, .98, "rose", "red"], [456, 330, 1.0, "peony", "blush"],
    [300, 322, 1.2, "rose", "blush"], [222, 384, .95, "ranunculus", "coral"], [382, 384, .95, "lily", "lilac"]
  ];
  const BONUS = [[252, 48, .85, "tulip", "hot"], [352, 44, .85, "daisy", "white"], [64, 292, .8, "lily", "cream"],
    [538, 296, .8, "rose", "hot"], [126, 118, .85, "tulip", "coral"], [478, 116, 1, "rose", "red"]];

  const stemD = ([x, y]) => `M${TIE[0]} ${TIE[1]}Q${300 + (x - 300) * .35} ${(y + TIE[1]) / 2 + 20} ${x} ${y}`;
  const stem = (f, d) => `<path class="stem" pathLength="1" style="--d:${d}s" d="${stemD(f)}" fill="none" stroke="#5d9463" stroke-width="6" stroke-linecap="round"/>`;
  const leaf = (x, y, r, k, d, c) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${k})"><g class="bloom" style="--d:${d}s"><path d="M0 0C-30-30-26-84 0-112C26-84 30-30 0 0Z" fill="${c}"/><path d="M0 0V-96M0-30L-14-46M0-30L14-46M0-56L-12-71M0-56L12-71" stroke="#fff" stroke-opacity=".32" stroke-width="1.6" fill="none"/></g></g>`;
  const breath = (x, y, d) => {
    let s = "";
    for (let i = 0; i < 12; i++) { const a = jit(34), b = jit(30); s += `<path d="M0 46L${a} ${b}" stroke="#7fae80" stroke-width="1.1"/><circle cx="${a}" cy="${b}" r="${4 + rnd() * 2.5}" fill="#fff"/><circle cx="${a}" cy="${b}" r="1.6" fill="#ffc0d6"/>`; }
    return `<g transform="translate(${x} ${y})"><g class="bloom" style="--d:${d}s">${s}</g></g>`;
  };
  const flower = (f, i, d, tap) => `<g transform="translate(${f[0]} ${f[1]}) scale(${f[2]*1.15}) rotate(${f[3] === "tulip" ? (f[0] - 300) * .12 : i * 41 % 360})" ${tap ? `class="fl" data-i="${i}" role="button" tabindex="0" aria-label="Open flower ${i + 1}"` : ""}><g class="hit"><g class="bloom" style="--d:${d}s">${T[f[3]](f[4])}</g></g></g>`;

  function bouquet() {
    seed = 11;
    let s = `<svg id="bouquet" xmlns="http://www.w3.org/2000/svg" viewBox="0 -20 600 780" role="group" aria-label="A bouquet of thirteen flowers"><defs>${defs()}</defs>`;
    s += `<ellipse cx="300" cy="742" rx="135" ry="12" fill="#a80f4c" opacity=".16"/>`;
    s += `<g class="wrap" style="--d:.5s"><path d="M300 590L34 372Q22 350 34 322L88 178Q96 160 114 150L204 76Q222 66 240 74L300 92L366 62Q384 56 400 68L496 152Q512 164 518 182L568 324Q576 350 562 372Z" fill="url(#paperC)" stroke="#fff" stroke-width="3"/></g>`;
    s += `<g id="bonusStems"></g><g>`;
    [[110, 190, -42], [60, 330, -72], [496, 180, 42], [544, 340, 74], [240, 120, -14], [366, 115, 16], [170, 120, -32], [434, 112, 30]]
      .forEach(([x, y, r], i) => s += leaf(x, y, r, .95, 1.3 + i * .07, i % 2 ? "#79ac78" : "#4f8a5b"));
    s += MAIN.map((f, i) => stem(f, .2 + i * .05)).join("") + `</g>`;
    s += breath(250, 72, 2) + breath(352, 80, 2.1) + breath(80, 264, 2.2) + breath(524, 268, 2.3) + breath(300, 262, 2.1);
    s += `<g id="bonus"></g>` + MAIN.map((f, i) => flower(f, i, 1.1 + i * .13, true)).join("");
    s += breath(258, 428, 2.6) + breath(338, 430, 2.7);
    s += `<g class="wrap" style="--d:.8s"><path d="M286 590L210 700Q300 724 390 700L314 590Z" fill="url(#paperA)"/><path d="M290 600L262 709M300 600V713M310 600L338 709" stroke="#ff8db8" stroke-opacity=".5" stroke-width="2"/>
      <g stroke="#5d9463" stroke-width="7" stroke-linecap="round"><path d="M270 712L262 734M290 715L287 742M310 715L314 742M330 712L339 732"/></g>
      <path d="M572 345Q460 392 250 436L284 592L316 592Z" fill="url(#paperB)" stroke="#fff" stroke-width="3"/><path d="M28 345Q140 392 356 448L316 592L284 592Z" fill="url(#paperA)" stroke="#fff" stroke-width="3"/>
      <path d="M100 395Q210 460 296 578" stroke="#ff8db8" stroke-opacity=".45" stroke-width="2" fill="none"/></g>`;
    s += `<g class="wrap" style="--d:1.2s" fill="#d81b60"><path d="M296 590C276 640 258 668 244 690L262 688L270 704C288 668 300 630 304 592ZM304 590C324 640 342 668 356 690L338 688L330 704C312 668 300 630 296 592Z" fill="#b5124f"/><path d="M300 586C250 530 200 548 206 584C212 622 262 618 300 586ZM300 586C350 530 400 548 394 584C388 622 338 618 300 586Z"/><path d="M296 586C262 566 238 568 222 582M304 586C338 566 362 568 378 582" fill="none" stroke="#8e0b3c" stroke-width="2.5" stroke-linecap="round"/><rect x="283" y="568" width="34" height="36" rx="11" fill="#e83e7e"/></g>`;
    return s + `</svg>`;
  }
  function addBonus(i) {
    const f = BONUS[i % BONUS.length], put = (id, html) => {
      const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${html}</svg>`, "image/svg+xml");
      document.getElementById(id).append(document.importNode(doc.documentElement.firstChild, true));
    };
    put("bonusStems", stem(f, 0)); put("bonus", flower(f, i + 20, .5, false));
  }
  const bud = () => `<defs>${defs().replace(/id="/g, 'id="b-')}</defs>` + scaled(2, T.rose("hot").replace(/#g-/g, "#b-g-"));
  return { bouquet, addBonus, bud };
})();
