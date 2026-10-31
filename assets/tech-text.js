const techText = document.querySelector("[data-tech-text]");

if (techText && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const overlay = document.createElement("span");
  overlay.className = "tech-text__overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = techText.innerHTML;
  techText.append(overlay);

  const moveFocus = (event) => {
    const bounds = techText.getBoundingClientRect();
    overlay.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
    overlay.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
  };

  techText.addEventListener("pointermove", moveFocus);
  techText.addEventListener("pointerleave", () => {
    overlay.style.setProperty("--pointer-x", "50%");
    overlay.style.setProperty("--pointer-y", "50%");
  });

  if (window.gsap) {
    window.gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.8, delay: 0.35, ease: "power2.out" });
  } else {
    overlay.style.opacity = "1";
  }
}
