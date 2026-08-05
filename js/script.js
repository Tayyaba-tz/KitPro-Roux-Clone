// ===================== PRELOADER =====================
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.classList.add("is-hidden");
    document.body.classList.add("is-loaded");
    playHeroReveal();
  }, 900);
});

// ===================== CUSTOM CURSOR =====================
const cursor = document.getElementById("cursor");
const cursorGlow = document.getElementById("cursorGlow");

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

// glow follows with a slight lag for a softer feel
function animateGlow() {
  glowX += (mouseX - glowX) * 0.12;
  glowY += (mouseY - glowY) * 0.12;
  cursorGlow.style.left = glowX + "px";
  cursorGlow.style.top = glowY + "px";
  requestAnimationFrame(animateGlow);
}
animateGlow();

document.querySelectorAll("a, button, .services__item, .work__item").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
});

// ===================== NAVBAR SHOW/HIDE ON SCROLL =====================
const nav = document.getElementById("nav");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 80) {
    nav.classList.add("is-scrolled");
  } else {
    nav.classList.remove("is-scrolled");
  }

  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    nav.classList.add("is-hidden");
  } else {
    nav.classList.remove("is-hidden");
  }

  lastScrollY = currentScrollY;
});

// ===================== MOBILE MENU =====================
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");

navToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  document.body.style.overflow = isOpen ? "hidden" : "";
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    document.body.style.overflow = "";
  });
});

// ===================== HERO SPLIT-TEXT REVEAL =====================
function playHeroReveal() {
  const words = document.querySelectorAll(".split-word");
  words.forEach((word, i) => {
    word.style.transition = `transform 0.9s cubic-bezier(.2,.7,.2,1) ${i * 0.05}s, opacity 0.9s ease ${i * 0.05}s`;
    requestAnimationFrame(() => {
      word.style.transform = "translateY(0)";
      word.style.opacity = "1";
    });
  });

  // hero sub + scroll cue fade in slightly after the heading
  document.querySelectorAll(".hero .reveal-line").forEach((el, i) => {
    setTimeout(() => el.classList.add("in-view"), 500 + i * 120);
  });
}

// ===================== SCROLL REVEALS (IntersectionObserver) =====================
const revealTargets = document.querySelectorAll(".reveal-up");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealTargets.forEach((el) => revealObserver.observe(el));

// ===================== STAT COUNTERS =====================
const statEls = document.querySelectorAll(".stat__num");
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      statObserver.unobserve(el);
    });
  },
  { threshold: 0.4 }
);
statEls.forEach((el) => statObserver.observe(el));

// ===================== HOVER PREVIEW: services + work (cursor-follow image) =====================
function setupHoverPreview(itemSelector, previewEl) {
  const items = document.querySelectorAll(itemSelector);

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      previewEl.dataset.tag = item.dataset.image;
      previewEl.textContent = item.dataset.image;
      previewEl.classList.add("is-visible");
      cursorGlow.classList.add("is-visible");
    });

    item.addEventListener("mousemove", (e) => {
      previewEl.style.left = e.clientX + 40 + "px";
      previewEl.style.top = e.clientY + "px";
    });

    item.addEventListener("mouseleave", () => {
      previewEl.classList.remove("is-visible");
      cursorGlow.classList.remove("is-visible");
    });
  });
}

setupHoverPreview(".services__item", document.getElementById("servicePreview"));
setupHoverPreview(".work__item", document.getElementById("workPreview"));

// ===================== CONTACT FORM (client-side only, no backend) =====================
const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const submitBtn = contactForm.querySelector(".contact__submit");
  const name = document.getElementById("cName").value.trim();
  const email = document.getElementById("cEmail").value.trim();
  const message = document.getElementById("cMessage").value.trim();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = name.length > 0 && emailPattern.test(email) && message.length > 0;

  submitBtn.classList.add("is-loading");
  contactStatus.classList.remove("is-visible", "is-success", "is-error");

  // Simulated network delay — replace with a real fetch() call to your backend/form service
  setTimeout(() => {
    submitBtn.classList.remove("is-loading");

    if (isValid) {
      contactStatus.textContent = "Thanks — we'll get back to you within a day or two.";
      contactStatus.classList.add("is-visible", "is-success");
      contactForm.reset();
    } else {
      contactStatus.textContent = "Something's missing — check the fields and try again.";
      contactStatus.classList.add("is-visible", "is-error");
    }
  }, 900);
});