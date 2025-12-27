const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const cards = Array.from(carousel.querySelectorAll(".carousel-card"));
  const prevBtn = carousel.querySelector(".carousel-btn.prev");
  const nextBtn = carousel.querySelector(".carousel-btn.next");
  const count = cards.length;
  let index = 0;
  let timer = null;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const update = () => {
    if (!count) {
      return;
    }
    const step = 360 / count;
    const angle = step * index * -1;
    carousel.style.setProperty("--angle", `${angle}deg`);
  };

  const stopAuto = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const startAuto = () => {
    if (prefersReduced || count < 2) {
      return;
    }
    stopAuto();
    timer = window.setInterval(() => {
      index = (index + 1) % count;
      update();
    }, 4200);
  };

  if (count) {
    carousel.style.setProperty("--count", count);
    update();

    prevBtn?.addEventListener("click", () => {
      index = (index - 1 + count) % count;
      update();
    });

    nextBtn?.addEventListener("click", () => {
      index = (index + 1) % count;
      update();
    });

    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
    carousel.addEventListener("focusin", stopAuto);
    carousel.addEventListener("focusout", startAuto);
    startAuto();
  }
}
