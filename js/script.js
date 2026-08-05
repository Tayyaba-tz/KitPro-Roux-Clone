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

document.querySelectorAll("a, button, .services__item, .work__card").forEach((el) => {
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

// ===================== SLIDE-IN MENU PANEL =====================
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");
const menuClose = document.getElementById("menuClose");
const menuScrim = document.getElementById("menuScrim");

function openMenu() {
  mobileMenu.classList.add("is-open");
  document.body.style.overflow = "hidden";
}
function closeMenu() {
  mobileMenu.classList.remove("is-open");
  document.body.style.overflow = "";
}

navToggle.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
menuScrim.addEventListener("click", closeMenu);

mobileMenu.querySelectorAll(".menu-panel__links a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// ===================== PROMO POPUP (bottom left, closable) =====================
const popup = document.getElementById("popup");
const popupClose = document.getElementById("popupClose");

popupClose.addEventListener("click", () => {
  popup.classList.add("is-closed");
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

  // hero tagline + handle fade in slightly after the heading
  document.querySelectorAll(".hero .reveal-line").forEach((el, i) => {
    setTimeout(() => el.classList.add("in-view"), 300 + i * 120);
  });
}

// ===================== SCROLL REVEALS (IntersectionObserver) =====================
const revealTargets = document.querySelectorAll(".reveal-up, .reveal-scale");
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

// ===================== HOVER PREVIEW: services (cursor-follow glow) =====================
const servicePreview = document.getElementById("servicePreview");
document.querySelectorAll(".services__item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    servicePreview.classList.add("is-visible");
    cursorGlow.classList.add("is-visible");
  });
  item.addEventListener("mousemove", (e) => {
    servicePreview.style.left = e.clientX + 40 + "px";
    servicePreview.style.top = e.clientY + "px";
  });
  item.addEventListener("mouseleave", () => {
    servicePreview.classList.remove("is-visible");
    cursorGlow.classList.remove("is-visible");
  });
});

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
      contactStatus.textContent = "Thank you! Your submission has been received!";
      contactStatus.classList.add("is-visible", "is-success");
      contactForm.reset();
    } else {
      contactStatus.textContent = "Oops! Something went wrong while submitting the form.";
      contactStatus.classList.add("is-visible", "is-error");
    }
  }, 900);
});
