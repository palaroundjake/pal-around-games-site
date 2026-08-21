// Header gains a solid background once scrolled past the hero banner
const siteHeader = document.querySelector('.site-header');
const setHeaderSolid = () => {
  siteHeader.classList.toggle('is-solid', window.scrollY > 40);
};
setHeaderSolid();
window.addEventListener('scroll', setHeaderSolid, { passive: true });

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

// Nav dropdown menu
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

const closeNav = () => {
  navLinks.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
};

navToggle.addEventListener('click', (event) => {
  event.stopPropagation();
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', (event) => {
  if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) {
    closeNav();
  }
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeNav);
});

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

