/* ==================================================================
   APPROACH PAGE — light interactions
   Custom cursor (difference), scroll-reveal, and a veil transition
   on links that return to the archive. No dependencies.
   ================================================================== */

(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const body = document.body;

  /* ---------- reveal ---------- */
  const revealables = Array.from(document.querySelectorAll(".reveal"));
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });
    revealables.forEach((el) => io.observe(el));
  }

  /* ---------- veil transition back to the archive ---------- */
  const veil = $(".veil");
  let leaving = false;

  document.addEventListener("click", (e) => {
    const link = e.target.closest('[data-nav="home"]');
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href === "#") { e.preventDefault(); return; }
    e.preventDefault();
    if (leaving) return;
    leaving = true;

    if (reduced) { window.location.href = href; return; }
    veil.classList.add("is-in");
    setTimeout(() => { window.location.href = href; }, 760);
  });

  /* ---------- custom cursor ---------- */
  const cursorEl = $(".cursor");
  let cx = window.innerWidth / 2, cy = window.innerHeight / 2;
  let tx = cx, ty = cy, scale = 1, scaleTarget = 1;
  const hoverable = "a, button";

  document.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
  document.addEventListener("pointerover", (e) => {
    scaleTarget = e.target.closest(hoverable) ? 3.4 : 1;
  });
  document.addEventListener("pointerdown", () => { scaleTarget *= 0.7; });
  document.addEventListener("pointerup", (e) => {
    scaleTarget = e.target.closest(hoverable) ? 3.4 : 1;
  });

  function frame() {
    cx += (tx - cx) * 0.22;
    cy += (ty - cy) * 0.22;
    scale += (scaleTarget - scale) * 0.18;
    cursorEl.style.transform =
      `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) ` +
      `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
    requestAnimationFrame(frame);
  }
  if (!reduced) requestAnimationFrame(frame);

  /* ---------- boot ---------- */
  requestAnimationFrame(() => body.classList.replace("is-loading", "is-loaded"));
})();
