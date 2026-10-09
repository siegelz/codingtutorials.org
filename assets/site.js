/* Independently authored navigation and manual video paging. */
'use strict';
document.querySelectorAll('.menu-group').forEach(group => {
  const toggle = group.querySelector('.menu-toggle');
  function close() {
    group.classList.remove('is-open');
    group.classList.add('menu-dismissed');
    toggle.setAttribute('aria-expanded', 'false');
  }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    group.classList.toggle('is-open', open);
    group.classList.toggle('menu-dismissed', !open);
    toggle.setAttribute('aria-expanded', String(open));
  });
  group.addEventListener('pointerenter', () => group.classList.remove('menu-dismissed'));
  group.addEventListener('focusout', event => {
    if (!group.contains(event.relatedTarget)) close();
  });
  group.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      toggle.focus();
      close();
    }
  });
  document.addEventListener('click', event => {
    if (!group.contains(event.target)) close();
  });
});

document.querySelectorAll('.carousel').forEach(carousel => {
  const slides = Array.from(carousel.querySelectorAll('.slide'));
  const controls = carousel.querySelector('.carousel-controls');
  const count = carousel.querySelector('.slide-count');
  let active = 0;
  function show(index) {
    const previous = slides[active];
    const next = (index + slides.length) % slides.length;
    if (next !== active) {
      // Unload the old player to stop audio when its slide becomes hidden.
      previous.querySelectorAll('iframe').forEach(frame => {
        frame.dataset.playerSrc = frame.getAttribute('src');
        frame.removeAttribute('src');
      });
    }
    active = next;
    slides.forEach((slide, i) => {
      slide.hidden = i !== active;
      if (i === active) slide.querySelectorAll('iframe[data-player-src]').forEach(frame => {
        frame.src = frame.dataset.playerSrc;
        delete frame.dataset.playerSrc;
      });
    });
    count.textContent = `${active + 1} / ${slides.length}`;
  }
  controls.hidden = false;
  controls.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => show(active + Number(button.dataset.step)));
  });
  show(0);
});
