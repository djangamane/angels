const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const cards = Array.from(carousel.querySelectorAll(".carousel-card"));
  const prevBtn = carousel.querySelector(".carousel-btn.prev");
  const nextBtn = carousel.querySelector(".carousel-btn.next");
  const stage = carousel.querySelector(".carousel-stage");
  const count = cards.length;
  let index = 0;
  let timer = null;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const flatQuery = window.matchMedia("(max-width: 720px)");
  let isFlat = flatQuery.matches;

  const update = () => {
    if (!count) {
      return;
    }
    if (isFlat) {
      return;
    }
    const step = 360 / count;
    const angle = step * index * -1;
    carousel.style.setProperty("--angle", `${angle}deg`);
  };

  const updateRadius = () => {
    if (!count || isFlat) {
      return;
    }
    const card = carousel.querySelector(".carousel-card");
    const cardWidth = card ? card.getBoundingClientRect().width : 220;
    const spacing = 20;
    const minRadius = 260;
    const maxRadius = 640;
    const idealRadius = (count * (cardWidth + spacing)) / (2 * Math.PI);
    const radius = Math.min(maxRadius, Math.max(minRadius, idealRadius));
    carousel.style.setProperty("--radius", `${Math.round(radius)}px`);
  };

  const stopAuto = () => {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  const startAuto = () => {
    if (prefersReduced || count < 2 || isFlat) {
      return;
    }
    stopAuto();
    timer = window.setInterval(() => {
      index = (index + 1) % count;
      update();
    }, 4200);
  };

  const scrollByCard = (direction) => {
    if (!stage) {
      return;
    }
    const card = stage.querySelector(".carousel-card");
    const width = card ? card.getBoundingClientRect().width : 260;
    stage.scrollBy({ left: direction * (width + 16), behavior: "smooth" });
  };

  const applyMode = () => {
    isFlat = flatQuery.matches;
    carousel.classList.toggle("is-flat", isFlat);
    if (isFlat) {
      stopAuto();
    } else {
      updateRadius();
      update();
      startAuto();
    }
  };

  if (count) {
    carousel.style.setProperty("--count", count);
    update();
    applyMode();

    prevBtn?.addEventListener("click", () => {
      if (isFlat) {
        scrollByCard(-1);
      } else {
        index = (index - 1 + count) % count;
        update();
      }
    });

    nextBtn?.addEventListener("click", () => {
      if (isFlat) {
        scrollByCard(1);
      } else {
        index = (index + 1) % count;
        update();
      }
    });

    carousel.addEventListener("mouseenter", stopAuto);
    carousel.addEventListener("mouseleave", startAuto);
    carousel.addEventListener("focusin", stopAuto);
    carousel.addEventListener("focusout", startAuto);
    flatQuery.addEventListener("change", applyMode);
    window.addEventListener("resize", updateRadius);
    startAuto();
  }
}
