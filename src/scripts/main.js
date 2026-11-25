// The BrandzStory: animations (GSAP + SplitText + ScrollTrigger) and smooth scroll (Lenis)
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Always start at the top on refresh (no jumping to an old #section)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
window.scrollTo(0, 0);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Smooth scroll ----------
if (!reduceMotion) {
  const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70 }); }
    });
  });
}

// Split headings into lines wrapped in masks (text slides up from behind the mask)
function splitLines(el) {
  return SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'line' });
}

// ---------- Header: hide on scroll down, show on scroll up ----------
const nav = document.querySelector('.nav');
let lastY = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y > 120 && y > lastY + 4) nav.classList.add('nav--hidden');
  else if (y < lastY - 4 || y <= 120) nav.classList.remove('nav--hidden');
  lastY = y;
}, { passive: true });

document.fonts.ready.then(() => {
  if (reduceMotion) return;

  // ---------- HERO INTRO ----------
  const lines = gsap.utils.toArray('.hero__line');
  const mid = (lines.length - 1) / 2;
  const heroTitle = splitLines('.hero__title');
  const stripes = gsap.utils.toArray('.logo-b--hero .b-stripe');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  // 1. Background lines: open from the centre and spread equally to both sides
  tl.from(lines, {
    scaleY: 0,
    opacity: 0,
    x: (i) => (mid - i) * 40, // start bunched at the centre
    duration: 1.8,
    stagger: { each: 0.03, from: 'center' },
  })
    // colour shades sweep across, slow down and settle
    .fromTo('.hero__glow', { opacity: 0, scale: 1.4 }, { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' }, '<0.2')

    // 2. Big B arrives: stripes rise one by one from the centre
    .from(stripes, {
      yPercent: 110,
      duration: 1.1,
      stagger: { each: 0.05, from: 'center' },
      ease: 'power4.out',
    }, '-=1.2')
    .from('.logo-b--hero', { scale: 0.9, duration: 1.4, ease: 'power3.out' }, '<')

    // 3. Text: each line slides up from behind its mask
    .from('.hero__tag', { yPercent: 100, opacity: 0, duration: 0.8 }, '-=0.5')
    .from(heroTitle.lines, { yPercent: 110, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=0.5')
    .from('.hero__sub', { y: 30, opacity: 0, duration: 0.9 }, '-=0.6')
    .from('.hero__cta .btn', { y: 30, opacity: 0, duration: 0.8, stagger: 0.1 }, '-=0.6')
    .from('.nav', { yPercent: -100, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' }, '-=0.8');

  // ---------- SCROLL REVEALS ----------
  // ---------- WELCOME: slow, smooth line reveals ----------
  const wTitle = splitLines('.welcome__title');
  const wtl = gsap.timeline({
    scrollTrigger: { trigger: '.welcome', start: 'top 70%' },
    defaults: { ease: 'power3.out' },
  });
  wtl.from('.welcome__photo', { y: 60, opacity: 0, duration: 1.8 })
    .from(wTitle.lines, { yPercent: 110, duration: 1.6, stagger: 0.18, ease: 'power4.out' }, '<0.2')
    .from('.welcome__rule', { scaleX: 0, transformOrigin: 'left', duration: 1.6 }, '-=0.8')
    .from('.welcome__body', { y: 30, opacity: 0, duration: 1.4 }, '<0.2')
    .from('.welcome .btn--outline', { y: 20, opacity: 0, duration: 1.2 }, '<0.3');

  // photo zooms out smoothly (close-up -> full frame) as you scroll in
  gsap.fromTo('.welcome__photo img', { scale: 1.35 }, { scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.welcome', start: 'top bottom', end: 'center center', scrub: 1.5 } });

  // ---------- IMPACT: count up from 0 ----------
  gsap.utils.toArray('.count').forEach((el) => {
    const to = parseFloat(el.dataset.to);
    const dec = parseInt(el.dataset.dec || '0', 10);
    const obj = { v: 0 };
    gsap.to(obj, {
      v: to, duration: 2.4, ease: 'power3.out',
      onUpdate: () => { el.textContent = obj.v.toFixed(dec); },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
  gsap.from('.impact__item', { y: 40, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.impact__grid', start: 'top 85%' } });
  gsap.from('.marquee', { opacity: 0, y: 40, duration: 1.4, ease: 'power3.out',
    scrollTrigger: { trigger: '.marquee', start: 'top 90%' } });

  // ---------- OUR SERVICES: pinned, cards stack on scroll ----------
  const cards = gsap.utils.toArray('.svc__card');
  gsap.set(cards, { yPercent: 130 });
  const stl = gsap.timeline({
    scrollTrigger: {
      trigger: '.svc',
      pin: '.svc__pin',
      start: 'top top',
      end: () => '+=' + window.innerHeight * (cards.length + 0.8),
      scrub: 1.2,
      anticipatePin: 1,
    },
    defaults: { ease: 'none' },
  });
  // intro: arrow rotates from ↙ to ↗ while the title settles
  stl.from('.svc__title span', { yPercent: 30, opacity: 0.15, stagger: 0.15, duration: 0.6 })
    .to('.svc__arrow', { rotation: 360, duration: 0.8 }, 0)
    .to('.svc__intro', { opacity: 0.25, scale: 0.94, duration: 0.6 });
  cards.forEach((card, i) => {
    stl.to(card, { yPercent: 0, duration: 1, ease: 'power2.out' }, i === 0 ? '<' : '>-0.1');
    if (i > 0) stl.to(cards[i - 1], { scale: 0.94, opacity: 0.6, y: -30, duration: 1, ease: 'power2.out' }, '<');
  });

  // nav text turns dark over the white services section
  gsap.utils.toArray('.theme-light').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec, start: 'top 60px', end: 'bottom 60px',
      toggleClass: { targets: '.nav', className: 'is-light' },
    });
  });

  // ---------- WELCOME: white light sweep on the big word ----------
  ScrollTrigger.create({ trigger: '.welcome', start: 'top 15%', once: true,
    onEnter: () => {
      document.querySelector('.welcome').classList.add('is-lit');
      document.querySelector('.welcome__lbl').classList.add('is-swept');
    } });
  gsap.from('.welcome__lbl', { yPercent: 60, opacity: 0, duration: 1.4, ease: 'power4.out',
    scrollTrigger: { trigger: '.welcome__lbl', start: 'top 85%' } });

  // ---------- STORY: lines rise, then "Success" <-> "Growth" flips ----------
  gsap.from('.story .split-line, .story .flip-line', { yPercent: 60, opacity: 0, duration: 1.3, stagger: 0.15, ease: 'power4.out',
    scrollTrigger: { trigger: '.story .stmt', start: 'top 85%' } });
  const flip = document.querySelector('.flip');
  if (flip) setInterval(() => flip.classList.toggle('is-alt'), 2400);

  // ---------- MARQUEE: constant drift, faster while scrolling ----------
  const track = document.querySelector('.marquee__track');
  if (track) {
    let x = 0, boost = 0;
    const base = 0.6;
    ScrollTrigger.create({ onUpdate: (self) => { boost = Math.min(Math.abs(self.getVelocity()) / 120, 14); } });
    gsap.ticker.add(() => {
      boost *= 0.94; // eases back to normal speed
      x -= base + boost;
      const half = track.scrollWidth / 2;
      if (-x >= half) x += half;
      track.style.transform = `translateX(${x}px)`;
    });
  }

  // ---------- STEPS: centre line fills, dots light up, cards slide in ----------
  gsap.to('.steps__fill', { scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.steps__track', start: 'top 65%', end: 'bottom 65%', scrub: 0.8 } });
  gsap.utils.toArray('.step').forEach((step) => {
    const left = step.classList.contains('step--left');
    gsap.fromTo(step.querySelector('.step__card'),
      { rotateY: left ? -100 : 100, opacity: 0.2 },
      { rotateY: 0, opacity: 1, ease: 'power2.out',
        scrollTrigger: { trigger: step, start: 'top 85%', end: 'center 55%', scrub: 1 } });
    const art = step.querySelector('.step__art svg');
    if (art) {
      gsap.fromTo(art, { rotateY: left ? 100 : -100, opacity: 0, scale: 0.7 },
        { rotateY: 0, opacity: 1, scale: 1, ease: 'power2.out',
          scrollTrigger: { trigger: step, start: 'top 85%', end: 'center 55%', scrub: 1 } });
      gsap.to(art.querySelectorAll('.a'), { opacity: 0.35, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
    ScrollTrigger.create({ trigger: step, start: 'center 65%', end: 'bottom top',
      toggleClass: { targets: step, className: 'is-on' } });
  });

  gsap.utils.toArray('.fill-text').forEach((el) => {
    const sp = SplitText.create(el, { type: 'words', wordsClass: 'w' });
    const isTitle = el.classList.contains('team-sec__title');
    gsap.to(sp.words, { color: isTitle ? '#0b1220' : '#4a5568', stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 40%', scrub: 1 } });
  });
  gsap.from('.fan__stage', { y: 120, opacity: 0, scale: 0.9, duration: 1.4, ease: 'power3.out',
    scrollTrigger: { trigger: '.fan', start: 'top 80%' } });

  gsap.utils.toArray('.sec .split, .statement .split, .cta-box .split, .steps .split, .team-sec .split, .site-footer .split').forEach((el) => {
    const s = splitLines(el);
    gsap.from(s.lines, {
      yPercent: 110,
      duration: 1,
      stagger: 0.1,
      ease: 'power4.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  gsap.utils.toArray('.fade-up').forEach((el) => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
});

// ---------- TEAM: fanned card carousel ----------
const fan = document.querySelector('[data-fan]');
if (fan) {
  const cards = [...fan.querySelectorAll('.fan__card')];
  let active = 0;
  const layout = () => {
    const n = cards.length;
    cards.forEach((card, i) => {
      let d = i - active;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      const ad = Math.abs(d);
      const visible = ad <= 2;
      card.style.transform = `translateX(${d * 78}%) translateY(${ad * 18}px) rotate(${d * 7}deg) scale(${1 - ad * 0.08})`;
      card.style.zIndex = String(10 - ad);
      card.style.opacity = visible ? String(1 - ad * 0.18) : '0';
      card.style.filter = ad ? `brightness(${1 - ad * 0.18})` : 'none';
      card.style.pointerEvents = visible ? 'auto' : 'none';
    });
  };
  const go = (step) => { active = (active + step + cards.length) % cards.length; layout(); };
  fan.querySelector('.fan__btn--prev').addEventListener('click', () => go(-1));
  fan.querySelector('.fan__btn--next').addEventListener('click', () => go(1));
  cards.forEach((c, i) => c.addEventListener('click', () => { active = i; layout(); }));
  let auto = setInterval(() => go(1), 3500);
  fan.addEventListener('mouseenter', () => clearInterval(auto));
  fan.addEventListener('mouseleave', () => { auto = setInterval(() => go(1), 3500); });
  window.addEventListener('fan:layout', layout);
  layout();
}
