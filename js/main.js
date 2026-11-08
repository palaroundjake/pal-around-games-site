// The page opens on the cream background (framed trailer), so the header is
// always solid rather than transparent over a photo.
document.querySelector('.site-header').classList.add('is-solid');

// Marks <body> as "scrolling" for the duration of active scroll input, so
// scroll-only effects (like the alarm clock icon rocking) pause once the
// user stops.
let scrollStopTimer;
window.addEventListener('scroll', () => {
  document.body.classList.add('is-scrolling');
  clearTimeout(scrollStopTimer);
  scrollStopTimer = setTimeout(() => {
    document.body.classList.remove('is-scrolling');
  }, 150);
}, { passive: true });

// Hero trailer — the banner is a poster; the YouTube player (privacy-enhanced
// youtube-nocookie domain) is only created once the visitor presses play.
(() => {
  const hero = document.getElementById('heroVideo');
  const frame = hero && hero.querySelector('.hero-frame');
  if (!frame) return;

  function play() {
    if (frame.classList.contains('is-playing')) return;
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' +
      encodeURIComponent(hero.dataset.videoId) + '?autoplay=1&rel=0&playsinline=1';
    iframe.title = 'Get Up trailer';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.appendChild(iframe);
    frame.classList.add('is-playing');
    iframe.focus();
  }

  frame.addEventListener('click', play);
})();

// Photo gallery — looping carousel. Each slide is positioned by its offset from
// the current photo (--o: 0 = main, +/-1 = peeking neighbors, +/-2 = parked
// offscreen), so it wraps around forever with a neighbor on both sides.
(() => {
  const stage = document.getElementById('galleryStage');
  if (!stage) return;

  const slides = [...stage.querySelectorAll('.gallery-slide')];
  const n = slides.length;
  let current = 0;

  function render() {
    slides.forEach((slide, i) => {
      let o = (((i - current) % n) + n) % n;
      if (o > n / 2) o -= n;
      slide.style.setProperty('--o', Math.abs(o) > 1 ? Math.sign(o) * 2 : o);
      slide.classList.toggle('is-active', o === 0);
      slide.classList.toggle('is-near', Math.abs(o) === 1);
      slide.setAttribute('aria-hidden', String(o !== 0));
      // Start loading photos just before they slide into view.
      if (Math.abs(o) <= 2) slide.querySelector('img').loading = 'eager';
    });
  }

  const go = (delta) => { current = (current + delta + n) % n; render(); };

  stage.querySelector('.gallery-prev').addEventListener('click', () => go(-1));
  stage.querySelector('.gallery-next').addEventListener('click', () => go(1));

  // Clicking a peeking photo brings it to the middle.
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (slide.classList.contains('is-near')) {
        const o = (((i - current) % n) + n) % n;
        go(o > n / 2 ? -1 : 1);
      }
    });
  });

  // Swipe on touch screens / drag with a mouse.
  let startX = null;
  stage.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  stage.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  });
  stage.addEventListener('pointercancel', () => { startX = null; });

  // Left/right arrow keys while focus is inside the gallery.
  stage.closest('section').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
  });

  render();
})();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => revealObserver.observe(el));

// Sloth cards flip from their sleepy back to the character front, scrubbed directly
// to scroll position — the card is fully "back" when it enters the viewport and fully
// "front" once it's scrolled further up, so the flip speed matches your scroll speed.
const slothCards = [...document.querySelectorAll('.sloth-card')];
const slothInners = slothCards.map((card) => card.querySelector('.sloth-card-inner'));
let slothTicking = false;

function updateSlothFlips() {
  const vh = window.innerHeight;
  const flipDistance = 300; // px of scroll to complete the flip once triggered
  const maxStagger = 150;   // px — how much later the rightmost card starts flipping
  const gridRect = document.querySelector('.sloth-grid').getBoundingClientRect();
  slothCards.forEach((card, i) => {
    const rect = card.getBoundingClientRect();
    const xRatio = gridRect.width > 0 ? (rect.left - gridRect.left) / gridRect.width : 0;
    const stagger = xRatio * maxStagger;
    // Trigger point: the scroll position at which the card is fully visible
    // (its bottom edge has just crossed into the viewport), offset later for cards
    // further right so the flip sweeps left-to-right.
    const triggerTop = (vh - rect.height) - stagger;
    const progress = Math.min(1, Math.max(0, (triggerTop - rect.top) / flipDistance));
    slothInners[i].style.transform = `rotateY(${progress * 180}deg)`;
  });
  slothTicking = false;
}

function onSlothScroll() {
  if (!slothTicking) {
    requestAnimationFrame(updateSlothFlips);
    slothTicking = true;
  }
}

if (slothCards.length) {
  updateSlothFlips();
  window.addEventListener('scroll', onSlothScroll, { passive: true });
  window.addEventListener('resize', onSlothScroll);
}

