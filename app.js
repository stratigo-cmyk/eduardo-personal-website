/* ==================================================================
   EDUARDO MITELMAN — ARCHIVE ENGINE
   A virtual scroll runway drives a "lens" index: compact rows part
   around the centered work, which renders as the large display
   title while plates (tonal or image) crossfade behind it.
   No dependencies.
   ================================================================== */

(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const N = ARCHIVE.length;

  /* ---------- helpers ---------- */
  const $ = (s, c = document) => c.querySelector(s);
  const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
  const smootherstep = (t) => t * t * t * (t * (t * 6 - 15) + 10);

  const ROMAN = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"],
                 [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"],
                 [5, "V"], [4, "IV"], [1, "I"]];
  const toRoman = (num) => {
    let n = num, out = "";
    for (const [v, r] of ROMAN) while (n >= v) { out += r; n -= v; }
    return out;
  };

  ARCHIVE.forEach((it, i) => {
    it.numeral = toRoman(i + 1);
    it.tone = TONES[(i * 7 + 3) % TONES.length];   /* deterministic spread */
    it.label = it.brand === "No Brand" ? it.title : it.brand;
  });

  /* ---------- DOM ---------- */
  const body      = document.body;
  const stage     = $(".stage");
  const plateA    = $(".plate-a");
  const plateB    = $(".plate-b");
  const indexEl   = $(".index");
  const layerEl   = $(".index-layer");
  const focusEl   = $(".focus");
  const focusAnim = $(".focus-anim");
  const focusLine = $(".focus-line");
  const focusDir  = $(".focus-dir");
  const edgeNum   = $(".edge-num");
  const edgeBrand = $(".edge-brand");
  const spacer    = $(".scroll-space");
  const cursorEl  = $(".cursor");
  const intro     = $(".intro");
  const veil      = $(".veil");
  const menu      = $("#menu");
  const menuBtn   = $(".menu-toggle");
  const cookies   = $(".cookies");

  /* ---------- build rows ---------- */
  const rows = [];
  const inners = [];
  {
    const frag = document.createDocumentFragment();
    ARCHIVE.forEach((it, i) => {
      const li = document.createElement("li");
      li.className = "row";

      const btn = document.createElement("button");
      btn.className = "row-inner";
      btn.type = "button";
      btn.style.setProperty("--d", `${200 + Math.min(i, 12) * 60}ms`);
      btn.setAttribute("aria-label",
        `${it.numeral}. ${it.brand} — ${it.title}. ${it.director}.`);

      const num = document.createElement("span");
      num.className = "row-num";
      num.textContent = it.numeral;

      const brand = document.createElement("span");
      brand.className = "row-brand";
      brand.textContent = it.label;

      const dir = document.createElement("em");
      dir.className = "row-dir";
      dir.textContent = it.director;
      brand.appendChild(dir);

      btn.append(num, brand);
      btn.addEventListener("click", () => scrollToItem(i));
      li.appendChild(btn);
      frag.appendChild(li);
      rows.push(li);
      inners.push(btn);
    });
    indexEl.appendChild(frag);
  }

  /* ---------- geometry ---------- */
  let step = 100, rowStep = 44, gapHalf = 200, vh = window.innerHeight;

  function measure() {
    vh = window.innerHeight;
    step    = Math.max(88, Math.round(vh * 0.12));    /* scroll px per work  */
    rowStep = Math.max(36, Math.round(vh * 0.052));   /* list rhythm         */
    gapHalf = Math.round(vh * 0.17) + 56;             /* room for the title  */
    spacer.style.height = `${(N - 1) * step + Math.round(vh * 1.6)}px`;
  }

  /* ---------- scroll state ---------- */
  let target = 0;           /* raw focus from scroll position   */
  let render = 0;           /* eased focus actually drawn       */
  let current = -1;         /* item whose text is mounted       */

  /* magnetic detent — biases the eased focus toward whole items,
     the "heavy magazine page" feel, without hijacking the wheel  */
  const detent = (f) => {
    const i = Math.floor(f);
    return i + smootherstep(clamp(f - i, 0, 1));
  };

  const onScroll = () => {
    target = clamp(window.scrollY / step, 0, N - 1);
  };

  function scrollToItem(i) {
    window.scrollTo({
      top: Math.round(i * step),
      behavior: reduced ? "auto" : "smooth",
    });
  }

  /* ---------- focus content ---------- */
  function mountFocus(it) {
    focusLine.textContent = it.title;
    focusDir.textContent = it.director;
    edgeNum.textContent = it.numeral;
    edgeBrand.textContent = it.label;
  }

  /* ---------- plates ---------- */
  function setPlate(el, i) {
    if (el._i === i) return;
    el._i = i;
    const it = ARCHIVE[i];
    /* tonal color always set first: it is the loading placeholder
       and the fallback when an item has no media */
    el.style.backgroundColor = it.tone.bg;
    el.style.backgroundImage = it.media ? `url("${it.media}")` : "";
    el.style.backgroundPosition = it.focal || "";
    el.classList.toggle("has-media", Boolean(it.media));
    el.classList.toggle("is-light", !it.tone.dark);
    el.setAttribute("data-num", it.numeral);
  }

  /* ---------- render loop ---------- */
  const WINDOW = 6;

  function layout() {
    const c = Math.round(render);
    if (c !== current) {
      current = c;
      mountFocus(ARCHIVE[c]);
    }
    const p = render - c;                       /* -0.5 … 0.5 around focus */

    /* rows */
    for (let i = 0; i < N; i++) {
      const li = rows[i];
      const d = i - render;
      const ad = Math.abs(d);

      if (ad > WINDOW) {
        if (li._v) { li.style.visibility = "hidden"; li._v = false; }
        continue;
      }
      if (!li._v) { li.style.visibility = "visible"; li._v = true; }

      const gap = gapHalf * smootherstep(Math.min(ad, 1));
      const y = d * rowStep + Math.sign(d) * gap;

      const fall = Math.pow(Math.max(0, 1 - ad / WINDOW), 1.5);
      const nearFade = Math.min(1, ad * 1.8);   /* hands over to the title */

      li.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      li.style.opacity = (fall * nearFade).toFixed(3);
      inners[i].style.pointerEvents = ad < 0.55 ? "none" : "auto";
    }

    /* focused work — scrub-linked fade and drift */
    const op = clamp(1 - Math.abs(p) * 2.4, 0, 1);
    const eased = 1 - Math.pow(1 - op, 2);
    focusAnim.style.opacity = eased.toFixed(3);
    focusAnim.style.transform = `translate3d(0, ${(-p * 34).toFixed(1)}px, 0)`;
    edgeNum.style.opacity = edgeBrand.style.opacity =
      body.classList.contains("is-loaded") ? eased.toFixed(3) : "";

    /* plates — crossfade scrubbed by scroll, slow settle zoom */
    const a = Math.floor(render);
    const b = Math.min(a + 1, N - 1);
    const t = smootherstep(clamp(render - a, 0, 1));
    setPlate(plateA, a);
    setPlate(plateB, b);
    plateB.style.opacity = t.toFixed(3);
    plateA.style.transform = `scale(${(1 + 0.035 * t).toFixed(4)})`;
    plateB.style.transform = `scale(${(1.045 - 0.045 * t).toFixed(4)})`;
    plateA.style.setProperty("--ghost-y", `${(t * -2.4).toFixed(2)}rem`);
    plateB.style.setProperty("--ghost-y", `${((1 - t) * 2.4).toFixed(2)}rem`);

    /* hand the ending over to the footer */
    const over = clamp((window.scrollY - (N - 1) * step) / (vh * 0.6), 0, 1);
    layerEl.style.opacity = focusEl.style.opacity = (1 - over).toFixed(3);
    layerEl.style.visibility = focusEl.style.visibility =
      over >= 1 ? "hidden" : "visible";
  }

  /* ---------- cursor ---------- */
  let cx = window.innerWidth / 2, cy = vh / 2, tx = cx, ty = cy;
  let cursorScale = 1, cursorTarget = 1;
  const hoverable = "a, button, input, label";

  document.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
  document.addEventListener("pointerover", (e) => {
    cursorTarget = e.target.closest(hoverable) ? 3.4 : 1;
  });
  document.addEventListener("pointerdown", () => { cursorTarget *= 0.7; });
  document.addEventListener("pointerup", (e) => {
    cursorTarget = e.target.closest(hoverable) ? 3.4 : 1;
  });

  function drawCursor() {
    cx += (tx - cx) * 0.22;
    cy += (ty - cy) * 0.22;
    cursorScale += (cursorTarget - cursorScale) * 0.18;
    cursorEl.style.transform =
      `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) ` +
      `translate(-50%, -50%) scale(${cursorScale.toFixed(3)})`;
  }

  /* ---------- main loop ---------- */
  function frame() {
    const goal = reduced ? target : detent(target);
    render += (goal - render) * (reduced ? 1 : 0.09);
    if (Math.abs(goal - render) < 0.0004) render = goal;
    layout();
    drawCursor();
    requestAnimationFrame(frame);
  }

  /* ---------- veil transition (nav links without a page) ---------- */
  let wiping = false;
  function wipe(mid) {
    if (wiping) return;
    wiping = true;
    veil.classList.add("is-in");
    setTimeout(() => {
      if (mid) mid();
      veil.classList.remove("is-in");
      veil.classList.add("is-out");
      setTimeout(() => {
        veil.classList.remove("is-out");
        wiping = false;
      }, 950);
    }, 950);
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-nav]");
    if (!link) return;
    e.preventDefault();
    closeMenu();
    if (link.dataset.nav === "archive") {
      scrollToItem(0);
    } else {
      wipe();           /* sweeping editorial transition, returns home */
    }
  });

  /* ---------- mobile menu ---------- */
  function openMenu() {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("is-open"));
    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.textContent = "Close";
  }
  function closeMenu() {
    if (!menu.classList.contains("is-open")) return;
    menu.classList.remove("is-open");
    menu.classList.add("is-closing");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "Menu";
    setTimeout(() => {
      menu.classList.remove("is-closing");
      menu.hidden = true;
    }, 950);
  }
  menuBtn.addEventListener("click", () =>
    menu.classList.contains("is-open") ? closeMenu() : openMenu());

  /* ---------- keyboard ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault(); scrollToItem(clamp(Math.round(render) + 1, 0, N - 1));
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault(); scrollToItem(clamp(Math.round(render) - 1, 0, N - 1));
    } else if (e.key === "Home") {
      e.preventDefault(); scrollToItem(0);
    } else if (e.key === "End") {
      e.preventDefault(); scrollToItem(N - 1);
    } else if (e.key === "Escape") {
      closeMenu();
    }
  });

  /* ---------- cookies ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* file:// */ } },
  };

  function dismissCookies(value) {
    store.set("em-cookies", value);
    cookies.classList.remove("is-shown");
    setTimeout(() => { cookies.hidden = true; }, 550);
  }

  cookies.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cookies]");
    if (!btn) return;
    const action = btn.dataset.cookies;
    if (action === "settings") {
      const prefs = $(".cookies-prefs", cookies);
      prefs.hidden = !prefs.hidden;
      btn.textContent = prefs.hidden ? "Settings" : "Save";
      if (prefs.hidden) {
        dismissCookies(JSON.stringify({
          analytics: $("#ck-analytics").checked,
          ads: $("#ck-ads").checked,
        }));
      }
    } else if (action === "cancel") {
      dismissCookies("necessary");
    } else if (action === "accept") {
      dismissCookies("all");
    }
  });

  /* ---------- boot ---------- */
  indexEl.setAttribute("aria-label", `Archive — ${N} works`);
  measure();
  onScroll();
  render = target;            /* no catch-up lurch on reload      */
  current = Math.round(render);
  mountFocus(ARCHIVE[current]);
  setPlate(plateA, Math.floor(render));
  setPlate(plateB, Math.min(Math.floor(render) + 1, N - 1));

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    const keep = render;
    measure();
    window.scrollTo(0, Math.round(keep * step));
    onScroll();
  });

  requestAnimationFrame(frame);

  /* entrance choreography */
  function reveal() {
    body.classList.remove("is-loading");
    body.classList.add("is-loaded");
  }

  if (reduced) {
    intro.classList.add("is-done");
    reveal();
    if (!store.get("em-cookies")) { cookies.hidden = false; cookies.classList.add("is-shown"); }
  } else {
    setTimeout(() => intro.classList.add("is-leaving"), 1000);
    setTimeout(() => { intro.classList.add("is-done"); }, 1950);
    setTimeout(reveal, 1000);
    setTimeout(() => {
      if (store.get("em-cookies")) return;
      cookies.hidden = false;
      requestAnimationFrame(() => cookies.classList.add("is-shown"));
    }, 2400);
  }
})();
