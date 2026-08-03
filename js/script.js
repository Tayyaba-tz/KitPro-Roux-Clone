/* =========================================================
   ROUX — interaction layer
   Libraries: GSAP 3.12.5 + ScrollTrigger 3.12.5 (cdnjs),
   Lenis 1.0.42 (@studio-freight/lenis, jsdelivr).
   Everything below is scoped and reduced-motion aware.
   ========================================================= */
(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Anchor links should still cooperate with Lenis
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.2 });
      else target.scrollIntoView({ behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Preloader ---------- */
  var preloader = document.getElementById('preloader');
  window.addEventListener('load', function(){
    var tl = gsap.timeline({
      onComplete: function(){
        preloader.classList.add('is-done');
        runHeroEntrance();
      }
    });
    tl.to('.preloader-word', { yPercent: -120, opacity: 0, duration: .6, ease: 'power3.in', delay: .4 })
      .to(preloader, { yPercent: -100, duration: .7, ease: 'power4.inOut' }, '-=.2');
  });
  // Fallback in case 'load' is slow to fire in sandboxed preview
  setTimeout(function(){ if (!preloader.classList.contains('is-done')) window.dispatchEvent(new Event('load')); }, 3500);

  /* ---------- Split text reveal (hero words) ---------- */
  function splitToChars(el){
    var text = el.textContent;
    el.textContent = '';
    var frag = document.createDocumentFragment();
    text.split('').forEach(function(ch){
      var span = document.createElement('span');
      span.className = 'split-char';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      frag.appendChild(span);
    });
    el.appendChild(frag);
    return el.querySelectorAll('.split-char');
  }

  var word1Chars = splitToChars(document.getElementById('heroWord1'));
  var word2Chars = splitToChars(document.getElementById('heroWord2'));
  gsap.set(word1Chars, { yPercent: 120, opacity: 0 });
  gsap.set(word2Chars, { yPercent: 120, opacity: 0 });
  gsap.set('.hero .reveal-el', { opacity: 0, y: 30 });

  function runHeroEntrance(){
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(word1Chars, { yPercent: 0, opacity: 1, duration: .9, stagger: .035 })
      .to(word2Chars, { yPercent: 0, opacity: 1, duration: .9, stagger: .035 }, '-=.65')
      .to('.hero .reveal-el', { opacity: 1, y: 0, duration: .8, stagger: .08 }, '-=.5');
  }
  if (reduceMotion) {
    gsap.set([word1Chars, word2Chars], { yPercent: 0, opacity: 1 });
    gsap.set('.hero .reveal-el', { opacity: 1, y: 0 });
  }

  /* ---------- Generic scroll reveals ---------- */
  var revealGroups = {};
  document.querySelectorAll('.reveal-el').forEach(function(el){
    if (el.closest('.hero')) return; // hero handled by load-timeline
    var section = el.closest('section') || document.body;
    var key = section.id || 'root';
    revealGroups[key] = revealGroups[key] || [];
    revealGroups[key].push(el);
  });
  Object.keys(revealGroups).forEach(function(key){
    var els = revealGroups[key];
    gsap.set(els, { opacity: 0, y: 36 });
    ScrollTrigger.create({
      trigger: els[0],
      start: 'top 88%',
      once: true,
      onEnter: function(){
        gsap.to(els, { opacity: 1, y: 0, duration: .9, ease: 'power3.out', stagger: .1 });
      }
    });
  });

  /* Process steps + footer columns stagger by their own containers */
  gsap.set('.process-step', { opacity: 0, y: 40 });
  ScrollTrigger.create({
    trigger: '.process-steps', start: 'top 85%', once: true,
    onEnter: function(){ gsap.to('.process-step', { opacity: 1, y: 0, duration: .8, stagger: .18, ease: 'power3.out' }); }
  });

  gsap.set('.split-word', { opacity: 0, y: 50 });
  ScrollTrigger.create({
    trigger: '.process-split', start: 'top 90%', once: true,
    onEnter: function(){ gsap.to('.split-word', { opacity: .95, y: 0, duration: 1, stagger: .15, ease: 'power3.out' }); }
  });

  gsap.set('.footer-col', { opacity: 0, y: 30 });
  ScrollTrigger.create({
    trigger: '.footer-grid', start: 'top 90%', once: true,
    onEnter: function(){ gsap.to('.footer-col', { opacity: 1, y: 0, duration: .7, stagger: .12, ease: 'power3.out' }); }
  });

  /* ---------- Services: pinned scroll-scrub split ----------
     "We" and "make" sit adjacent at rest; scrolling through the
     pin splits them toward the edges while the 7 service lines
     stagger-reveal in the middle — matched to the reference. */
  var servicesPin = document.getElementById('servicesPin');
  var serviceStack = document.getElementById('serviceList');
  var serviceItemsEls = document.querySelectorAll('.service-item');

  if (!reduceMotion && servicesPin) {
    gsap.set(serviceItemsEls, { opacity: 0, y: 24 });
    var splitTl = gsap.timeline({
      scrollTrigger: {
        trigger: servicesPin,
        start: 'top top',
        end: '+=140%',
        scrub: 0.6,
        pin: true,
        anticipatePin: 1
      }
    });
    splitTl
      .to(serviceStack, { maxWidth: 'min(70vw, 900px)', opacity: 1, duration: .4, ease: 'none' })
      .to(serviceItemsEls, { opacity: 1, y: 0, stagger: .15, duration: .6, ease: 'none' }, '<0.05');
  } else if (serviceStack) {
    gsap.set(serviceStack, { maxWidth: 'none', opacity: 1 });
    gsap.set(serviceItemsEls, { opacity: 1, y: 0 });
  }

  /* ---------- Stat count-up ---------- */
  document.querySelectorAll('.count-up').forEach(function(el){
    var target = parseInt(el.dataset.target, 10) || 0;
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: function(){
        var obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 1.6, ease: 'power2.out',
          onUpdate: function(){ el.textContent = Math.round(obj.val); }
        });
      }
    });
  });

  /* ---------- Image parallax (hero photos) ---------- */
  document.querySelectorAll('[data-speed]').forEach(function(el){
    var speed = parseFloat(el.dataset.speed);
    gsap.to(el, {
      yPercent: (1 - speed) * 40,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  });

  /* ---------- Navbar show/hide + custom cursor ---------- */
  var navbar = document.getElementById('navbar');
  var lastY = window.scrollY;
  var scrollSource = lenis || { on: function(){} };

  function onScrollUpdate(y){
    navbar.classList.toggle('is-scrolled', y > 40);
    if (y > lastY && y > 120) navbar.classList.add('is-hidden');
    else navbar.classList.remove('is-hidden');
    lastY = y;
  }
  if (lenis) {
    lenis.on('scroll', function(e){ onScrollUpdate(e.scroll); });
  } else {
    window.addEventListener('scroll', function(){ onScrollUpdate(window.scrollY); });
  }

  var cursor = document.getElementById('cursor');
  var cursorLabel = document.getElementById('cursorLabel');
  var mouseX = 0, mouseY = 0, curX = 0, curY = 0;
  if (!isTouch) {
    window.addEventListener('mousemove', function(e){ mouseX = e.clientX; mouseY = e.clientY; });
    gsap.ticker.add(function(){
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.transform = 'translate(' + curX + 'px,' + curY + 'px)';
    });
    document.querySelectorAll('a, button, .service-item, .work-item').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursor.classList.add('is-hover'); });
      el.addEventListener('mouseleave', function(){ cursor.classList.remove('is-hover'); cursorLabel.textContent = ''; });
    });
    document.querySelectorAll('.work, .contact, .footer').forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursor.classList.add('on-dark'); });
      el.addEventListener('mouseleave', function(){ cursor.classList.remove('on-dark'); });
    });
  } else {
    cursor.style.display = 'none';
  }

  /* ---------- Mobile menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  function closeMobileMenu(){
    hamburger.classList.remove('is-open');
    mobileMenu.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }
  hamburger.addEventListener('click', function(){
    var open = mobileMenu.classList.toggle('is-open');
    hamburger.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) { open ? lenis.stop() : lenis.start(); }
  });

  /* ---------- Hero video play/pause ---------- */
  var heroVideo = document.getElementById('heroVideo');
  var heroToggle = document.getElementById('heroVideoToggle');
  heroToggle.addEventListener('click', function(){
    var playing = !heroVideo.paused;
    if (playing) { heroVideo.pause(); } else { heroVideo.play(); }
    heroToggle.querySelector('.icon-pause').style.display = playing ? 'none' : 'block';
    heroToggle.querySelector('.icon-play').style.display = playing ? 'block' : 'none';
    heroToggle.setAttribute('aria-label', playing ? 'Play video' : 'Pause video');
  });

  /* ---------- Services hover-reveal preview ---------- */
  var svcPreview = document.getElementById('servicesPreview');
  var svcPreviewImg = document.getElementById('servicesPreviewImg');
  if (!isTouch) {
    document.querySelectorAll('.service-item').forEach(function(item){
      item.addEventListener('mouseenter', function(){
        svcPreviewImg.src = item.dataset.img;
        svcPreview.classList.add('is-visible');
      });
    });
    document.getElementById('serviceList').addEventListener('mouseleave', function(){
      svcPreview.classList.remove('is-visible');
    });
  }

  /* ---------- Work cursor-follow preview ---------- */
  var workPreview = document.getElementById('workPreview');
  var workPreviewImg = document.getElementById('workPreviewImg');
  if (!isTouch) {
    var wpX = 0, wpY = 0, wpCurX = 0, wpCurY = 0, wpActive = false;
    window.addEventListener('mousemove', function(e){ wpX = e.clientX + 24; wpY = e.clientY - 110; });
    gsap.ticker.add(function(){
      if (!wpActive) return;
      wpCurX += (wpX - wpCurX) * 0.16;
      wpCurY += (wpY - wpCurY) * 0.16;
      workPreview.style.transform = 'translate(' + wpCurX + 'px,' + wpCurY + 'px)';
    });
    document.querySelectorAll('.work-item').forEach(function(item){
      item.addEventListener('mouseenter', function(){
        workPreviewImg.src = item.dataset.img;
        workPreview.classList.add('is-visible');
        wpActive = true;
      });
      item.addEventListener('mouseleave', function(){
        workPreview.classList.remove('is-visible');
        wpActive = false;
      });
    });
  } else {
    // touch fallback: tap toggles a static preview under the row
    document.querySelectorAll('.work-item').forEach(function(item){
      item.addEventListener('click', function(e){
        var already = item.classList.contains('is-tapped');
        document.querySelectorAll('.work-item.is-tapped').forEach(function(i){ i.classList.remove('is-tapped'); });
        if (!already) { item.classList.add('is-tapped'); }
      });
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var successEl = document.getElementById('formSuccess');
  var errorEl = document.getElementById('formError');
  var submitBtn = document.getElementById('submitBtn');
  var submitLabel = document.getElementById('submitBtnLabel');

  function validate(){
    var name = form.fName.value.trim();
    var email = form.fEmail.value.trim();
    var message = form.fMessage.value.trim();
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return name.length > 0 && emailOk && message.length > 0;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    successEl.classList.remove('is-visible');
    errorEl.classList.remove('is-visible');

    if (!validate()) {
      gsap.to(form, { opacity: 0, y: -12, duration: .4, ease: 'power2.in', onComplete: function(){
        form.style.display = 'none';
        errorEl.classList.add('is-visible');
      }});
      return;
    }

    submitBtn.classList.add('is-loading');
    submitLabel.textContent = 'Sending…';

    setTimeout(function(){
      submitBtn.classList.remove('is-loading');
      submitLabel.textContent = 'Send now';
      gsap.to(form, { opacity: 0, y: -12, duration: .4, ease: 'power2.in', onComplete: function(){
        form.style.display = 'none';
        successEl.classList.add('is-visible');
      }});
    }, 900);
  });

  /* ---------- Resize hygiene ---------- */
  var resizeTimer;
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){ ScrollTrigger.refresh(); }, 250);
  });

})();