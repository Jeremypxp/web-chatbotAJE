// static/js/scroll.js
// Revela elementos con animación a medida que entran en el viewport.

const revealObserver = new IntersectionObserver(
  entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }),
  { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
