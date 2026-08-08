// ===================== INITIALIZATION =====================
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

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
  
  gsap.to(cursor, {
    x: mouseX,
    y: mouseY,
    duration: 0.1,
    ease: "power2.out"
  });
});

// glow follows with a slight lag
function animateGlow() {
  glowX += (mouseX - glowX) * 0.1;
  glowY += (mouseY - glowY) * 0.1;
  
  gsap.set(cursorGlow, {
    x: glowX,
    y: glowY
  });
  requestAnimationFrame(animateGlow);
}
animateGlow();

document.querySelectorAll("a, button, .services__item, .work__card").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
});

// Work cards hover effect
document.querySelectorAll(".work__card").forEach((card) => {
  const img = card.querySelector("img");
  card.addEventListener("mouseenter", () => {
    gsap.to(img, { scale: 1.05, duration: 0.6, ease: "power2.out" });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(img, { scale: 1, duration: 0.6, ease: "power2.out" });
  });
});

// ===================== NAVBAR =====================
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
    gsap.to(nav, { yPercent: -100, duration: 0.4, ease: "power2.inOut" });
  } else {
    gsap.to(nav, { yPercent: 0, duration: 0.4, ease: "power2.inOut" });
  }
  lastScrollY = currentScrollY;
});

// ===================== MENU PANEL =====================
const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");
const menuClose = document.getElementById("menuClose");
const menuScrim = document.getElementById("menuScrim");
const menuLinks = mobileMenu.querySelectorAll(".menu-panel__links a");

function openMenu() {
  mobileMenu.classList.add("is-open");
  nav.classList.add("menu-open");
  document.body.style.overflow = "hidden";
  
  gsap.fromTo(menuLinks, 
    { x: 50, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", delay: 0.2 }
  );
}
function closeMenu() {
  mobileMenu.classList.remove("is-open");
  nav.classList.remove("menu-open");
  document.body.style.overflow = "";
}

navToggle.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
menuScrim.addEventListener("click", closeMenu);
menuLinks.forEach(link => link.addEventListener("click", closeMenu));

// ===================== HERO ANIMATION =====================
function playHeroReveal() {
  const tl = gsap.timeline();
  
  tl.to(".split-word", {
    y: 0,
    opacity: 1,
    duration: 1.2,
    stagger: 0.1,
    ease: "power4.out"
  })
  .to(".hero__rule", {
    scaleX: 1,
    opacity: 1,
    duration: 1,
    ease: "power2.inOut"
  }, "-=0.8")
  .to(".hero__tagline, .hero__handle", {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
  }, "-=0.6")
  .to(".hero__cluster-img", {
    scale: 1,
    opacity: 1,
    duration: 1.2,
    stagger: 0.1,
    ease: "back.out(1.7)"
  }, "-=0.8");

  // Parallax for hero images
  document.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
    const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
    
    gsap.to(".hero__cluster-img--cat", { x: moveX, y: moveY, duration: 1 });
    gsap.to(".hero__cluster-img--swatch", { x: -moveX, y: -moveY, duration: 1 });
  });
}

// ===================== MARQUEE (GSAP) =====================
const marquees = document.querySelectorAll(".ticker__track, .marquee__track");
marquees.forEach((track) => {
  const duration = track.classList.contains("ticker__track") ? 20 : 30;
  const direction = track.parentElement.classList.contains("marquee--reverse") ? -1 : 1;
  
  gsap.to(track, {
    xPercent: -50 * direction,
    repeat: -1,
    duration: duration,
    ease: "none",
  });
});

// ===================== SERVICE HOVER PREVIEW =====================
const servicePreview = document.getElementById("servicePreview");
const serviceImages = {
  web: "images/hero-cat.jpg",
  identity: "images/hero-fish.jpg",
  graphic: "images/hero-robot.jpg",
  video: "images/hero-skincare.jpg",
  mockup: "images/hero-surfboard.jpg",
  strategy: "images/work-boulevard.jpg",
  uiux: "images/work-spessartine.jpg"
};

document.querySelectorAll(".services__item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    const imgKey = item.getAttribute("data-image");
    if (serviceImages[imgKey]) {
      servicePreview.style.backgroundImage = `url(${serviceImages[imgKey]})`;
      servicePreview.style.backgroundSize = "cover";
      servicePreview.style.backgroundPosition = "center";
    }
    gsap.to(servicePreview, { opacity: 1, scale: 1, duration: 0.3 });
    cursorGlow.classList.add("is-visible");
  });
  
  item.addEventListener("mousemove", (e) => {
    gsap.to(servicePreview, {
      x: e.clientX + 40,
      y: e.clientY - 100,
      duration: 0.6,
      ease: "power2.out"
    });
  });
  
  item.addEventListener("mouseleave", () => {
    gsap.to(servicePreview, { opacity: 0, scale: 0.8, duration: 0.3 });
    cursorGlow.classList.remove("is-visible");
  });
});

// ===================== WORK SECTION PARALLAX =====================
gsap.to(".work__bg-track", {
  xPercent: -20,
  ease: "none",
  scrollTrigger: {
    trigger: ".work",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});

// Background cluster settles into place as the section comes into view
const workBgWrap = document.querySelector(".work__bg-wrap");
if (workBgWrap && !prefersReducedMotion) {
  gsap.fromTo(workBgWrap,
    { opacity: 0, scale: 0.82, rotate: -8 },
    {
      opacity: 1, scale: 1, rotate: 0, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: ".work", start: "top 75%", toggleActions: "play none none none" }
    }
  );
}

// Grid columns drift at slightly different rates while scrolling (desktop only)
const workCards = document.querySelectorAll(".work__card");
if (workCards.length && !prefersReducedMotion) {
  ScrollTrigger.matchMedia({
    "(min-width: 1025px)": function () {
      workCards.forEach((card, i) => {
        const col = i % 3;
        const distance = col === 1 ? 60 : -40; // middle column drifts opposite the outer two
        gsap.to(card, {
          yPercent: distance,
          ease: "none",
          scrollTrigger: {
            trigger: ".work",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    }
  });
}

// ===================== PROCESS SECTION (HORIZONTAL SCROLL) =====================
const processSection = document.querySelector(".process");
const processRail = document.querySelector(".process__rail");
const processCards = document.querySelectorAll(".process__card");

if (processSection && processRail) {
  gsap.to(processRail, {
    x: () => -(processRail.scrollWidth - window.innerWidth + 100),
    ease: "none",
    scrollTrigger: {
      trigger: processSection,
      start: "top top",
      end: () => `+=${processRail.scrollWidth}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
    }
  });
}

// ===================== SERVICES: PINNED SPLIT-SCRUB =====================
// "We" and "make" sit adjacent at rest; scrolling through the pin splits
// them apart to the edges while the 7 service lines stagger-reveal in the
// middle — matches the reference site's scroll behavior in this section.
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const servicesPin = document.querySelector(".services__pin");
const servicesList = document.getElementById("servicesList");
const servicesItems = document.querySelectorAll(".services__item");

if (servicesPin && !prefersReducedMotion) {
  gsap.set(servicesItems, { opacity: 0, y: 24 });
  gsap.timeline({
    scrollTrigger: {
      trigger: servicesPin,
      start: "top top",
      end: "+=140%",
      scrub: 0.6,
      pin: true,
      anticipatePin: 1
    }
  })
  .to(servicesList, { maxWidth: "min(70vw, 900px)", opacity: 1, duration: 0.4, ease: "none" })
  .to(servicesItems, { opacity: 1, y: 0, stagger: 0.15, duration: 0.6, ease: "none" }, "<0.05");
} else if (servicesList) {
  gsap.set(servicesList, { maxWidth: "none", opacity: 1 });
  gsap.set(servicesItems, { opacity: 1, y: 0 });
}

// ===================== ABOUT / QUOTE STRIP SEQUENCE =====================
// Image -> text -> image, in order, instead of three separate reveals
// firing at once — matches the assemble-in feel seen in the reference.
const quoteSection = document.querySelector(".quote");
if (quoteSection && !prefersReducedMotion) {
  const img1 = quoteSection.querySelector(".quote__img--1");
  const text = quoteSection.querySelector(".quote__text");
  const img2 = quoteSection.querySelector(".quote__img--2");
  gsap.set([img1, img2], { opacity: 0, scale: 0.6 });
  gsap.set(text, { opacity: 0, y: 28 });

  gsap.timeline({
    scrollTrigger: { trigger: quoteSection, start: "top 80%", toggleActions: "play none none none" }
  })
    .to(img1, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" })
    .to(text, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, "-=0.4")
    .to(img2, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" }, "-=0.5");
} else if (quoteSection) {
  gsap.set(quoteSection.querySelectorAll(".quote__img, .quote__text"), { opacity: 1, scale: 1, y: 0 });
}

// ===================== CONTACT SEQUENCE =====================
// Heading, then info column, then form — a light stagger instead of
// all three fading in together.
const contactSection = document.querySelector(".contact");
if (contactSection && !prefersReducedMotion) {
  const heading = contactSection.querySelector("h2");
  const info = contactSection.querySelector(".contact__info");
  const form = contactSection.querySelector(".contact__form");
  gsap.set([heading, info, form], { opacity: 0, y: 30 });

  gsap.timeline({
    scrollTrigger: { trigger: contactSection, start: "top 80%", toggleActions: "play none none none" }
  })
    .to(heading, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" })
    .to(info, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.35")
    .to(form, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4");
}

// ===================== SCROLL REVEALS =====================
const revealUps = document.querySelectorAll(".reveal-up");
revealUps.forEach((el) => {
  gsap.fromTo(el, 
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    }
  );
});

const revealScales = document.querySelectorAll(".reveal-scale");
revealScales.forEach((el) => {
  if (el.closest('.hero')) return; // Hero handled separately
  gsap.fromTo(el, 
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    }
  );
});
