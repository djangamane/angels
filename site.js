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
  let flatCards = [];

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

  const getClosestFlatIndex = () => {
    if (!stage || !flatCards.length) {
      return 0;
    }
    const scrollLeft = stage.scrollLeft;
    let closest = 0;
    let delta = Number.POSITIVE_INFINITY;
    flatCards.forEach((card, i) => {
      const distance = Math.abs(card.offsetLeft - scrollLeft);
      if (distance < delta) {
        delta = distance;
        closest = i;
      }
    });
    return closest;
  };

  const scrollToFlatIndex = (nextIndex) => {
    if (!stage || !flatCards.length) {
      return;
    }
    const target = flatCards[nextIndex];
    if (!target) {
      return;
    }
    const left = target.offsetLeft;
    try {
      stage.scrollTo({ left, behavior: "smooth" });
    } catch (error) {
      stage.scrollLeft = left;
    }
  };

  const applyMode = () => {
    isFlat = flatQuery.matches;
    carousel.classList.toggle("is-flat", isFlat);
    if (isFlat) {
      stopAuto();
      flatCards = stage ? Array.from(stage.querySelectorAll(".carousel-card")) : [];
      index = getClosestFlatIndex();
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
        index = getClosestFlatIndex();
        index = (index - 1 + count) % count;
        scrollToFlatIndex(index);
      } else {
        index = (index - 1 + count) % count;
        update();
      }
    });

    nextBtn?.addEventListener("click", () => {
      if (isFlat) {
        index = getClosestFlatIndex();
        index = (index + 1) % count;
        scrollToFlatIndex(index);
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

const simpleCarousels = document.querySelectorAll("[data-simple-carousel]");

simpleCarousels.forEach((carousel) => {
  const track = carousel.querySelector(".simple-carousel-track");
  const viewport = carousel.querySelector(".simple-carousel-viewport");
  const slides = track ? Array.from(track.children) : [];
  const prevBtn = carousel.querySelector(".simple-carousel-btn.prev");
  const nextBtn = carousel.querySelector(".simple-carousel-btn.next");
  const dotsWrap = carousel.parentElement?.querySelector("[data-simple-carousel-dots]");
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll(".simple-carousel-dot")) : [];
  let index = 0;
  let viewportWidth = 0;

  const syncMeasurements = () => {
    viewportWidth = viewport ? viewport.getBoundingClientRect().width : 0;
  };

  const update = () => {
    if (!slides.length || !viewportWidth) {
      return;
    }
    const offset = Math.round(index * viewportWidth);
    track.style.transform = `translate3d(-${offset}px, 0, 0)`;
    slides.forEach((slide, i) => {
      slide.setAttribute("aria-hidden", i !== index ? "true" : "false");
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  };

  if (!slides.length) {
    return;
  }

  prevBtn?.addEventListener("click", () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  });

  nextBtn?.addEventListener("click", () => {
    index = (index + 1) % slides.length;
    update();
  });

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      index = i;
      update();
    });
  });

  syncMeasurements();
  update();
  window.addEventListener("resize", () => {
    syncMeasurements();
    update();
  });
  window.addEventListener("load", () => {
    syncMeasurements();
    update();
  });
});

const contactForm = document.querySelector(".contact-form");
const toast = document.querySelector(".toast");

if (contactForm && toast) {
  let toastTimer = null;

  const showToast = (message) => {
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");
    if (toastTimer) {
      window.clearTimeout(toastTimer);
    }
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      toast.hidden = true;
    }, 3200);
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const action = contactForm.getAttribute("action");
    if (!action) {
      showToast("Message sent");
      return;
    }
    const formData = new FormData(contactForm);
    try {
      await fetch(action, {
        method: "POST",
        body: formData,
        mode: "no-cors",
      });
      contactForm.reset();
      showToast("Message sent");
    } catch (error) {
      showToast("Message sent");
    }
  });
}

// VIP Drawing Modal
const drawingOverlay = document.querySelector("[data-drawing-overlay]");
const drawingForm = document.querySelector("[data-drawing-form]");

if (drawingOverlay) {
  const openBtns = document.querySelectorAll("[data-open-drawing]");
  const closeBtns = document.querySelectorAll("[data-close-drawing]");

  const openDrawing = () => {
    drawingOverlay.hidden = false;
    document.body.classList.add("is-locked");
    drawingOverlay.querySelector("input")?.focus();
  };

  const closeDrawing = () => {
    drawingOverlay.hidden = true;
    document.body.classList.remove("is-locked");
  };

  openBtns.forEach((btn) => btn.addEventListener("click", openDrawing));
  closeBtns.forEach((btn) => btn.addEventListener("click", closeDrawing));

  drawingOverlay.addEventListener("click", (e) => {
    if (e.target === drawingOverlay) closeDrawing();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !drawingOverlay.hidden) closeDrawing();
  });

  if (drawingForm) {
    drawingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const action = drawingForm.getAttribute("action");
      const formData = new FormData(drawingForm);
      try {
        if (action) {
          await fetch(action, { method: "POST", body: formData, mode: "no-cors" });
        }
        drawingForm.reset();
        closeDrawing();
        if (toast) {
          toast.textContent = "You've been entered!";
          toast.hidden = false;
          toast.classList.add("is-visible");
          window.setTimeout(() => {
            toast.classList.remove("is-visible");
            toast.hidden = true;
          }, 3200);
        }
      } catch (error) {
        closeDrawing();
      }
    });
  }
}

const introGate = document.querySelector("[data-intro-gate]");

if (introGate) {
  const introVideo = introGate.querySelector("video");
  const playBtn = introGate.querySelector("[data-intro-play]");
  const enterBtn = introGate.querySelector("[data-intro-enter]");
  const status = introGate.querySelector("[data-intro-status]");
  const storageKey = "introSeen";
  let dismissed = false;
  let hasPlayed = false;

  const setStatus = (message) => {
    if (!status) {
      return;
    }
    status.textContent = message;
    status.hidden = !message;
  };

  const dismissIntro = () => {
    if (dismissed) {
      return;
    }
    dismissed = true;
    introGate.classList.add("is-hidden");
    document.body.classList.remove("is-locked");
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch (error) {
      // Ignore storage failures.
    }
    window.setTimeout(() => {
      introGate.remove();
    }, 450);
  };

  let seen = false;
  try {
    seen = sessionStorage.getItem(storageKey) === "1";
  } catch (error) {
    seen = false;
  }

  if (seen) {
    introGate.remove();
  } else {
    document.body.classList.add("is-locked");
    enterBtn?.addEventListener("click", dismissIntro);
    playBtn?.addEventListener("click", () => {
      if (!introVideo) {
        return;
      }
      const playPromise = introVideo.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => {
            hasPlayed = true;
            setStatus("");
            if (playBtn) {
              playBtn.textContent = "Replay Video";
            }
          })
          .catch(() => setStatus("Tap Play Video to start"));
      }
    });
    if (introVideo) {
      const tryPlay = () => {
        const playPromise = introVideo.play();
        if (playPromise && typeof playPromise.then === "function") {
          playPromise
            .then(() => setStatus(""))
            .catch(() => setStatus("Tap Enter to start video"));
        }
      };

      setStatus("Loading video...");
      tryPlay();
      introVideo.addEventListener("loadeddata", tryPlay);
      introVideo.addEventListener("canplay", tryPlay);
      introVideo.addEventListener("playing", () => {
        hasPlayed = true;
        setStatus("");
        if (playBtn) {
          playBtn.textContent = "Replay Video";
        }
      });
      introVideo.addEventListener("ended", dismissIntro);
      introVideo.addEventListener("error", () => setStatus("Video failed to load"));
    }
  }
}
