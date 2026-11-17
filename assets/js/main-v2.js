// Maritim Malaysia – skrip konsep 2 (personalisasi & e-poster)
(function () {
  // ---- Personalisasi: panel Orang Awam / Warga APMM / e-Perkhidmatan ----
  // Desktop: panel melebar bila dihalakan tetikus atau diklik.
  // Mudah alih: akordion (klik untuk buka). Pilihan terakhir diingati.
  var KEY = 'maritim-aud';
  var panels = document.querySelectorAll('.aud__panel');
  var canHover = window.matchMedia('(hover: hover) and (min-width: 992px)');

  function openPanel(name, remember) {
    panels.forEach(function (p) {
      var on = p.dataset.aud === name;
      p.classList.toggle('is-open', on);
      p.querySelector('.aud__head').setAttribute('aria-expanded', on);
    });
    if (remember) { try { localStorage.setItem(KEY, name); } catch (e) {} }
  }
  panels.forEach(function (p) {
    p.addEventListener('click', function (e) {
      if (e.target.closest('.aud__links a')) return;
      openPanel(p.dataset.aud, true);
    });
    p.addEventListener('mouseenter', function () {
      if (canHover.matches) openPanel(p.dataset.aud, true);
    });
  });
  try {
    var saved = localStorage.getItem(KEY);
    if (saved && document.querySelector('[data-aud="' + saved + '"]')) openPanel(saved, false);
  } catch (e) {}

  // ---- e-Poster slider ----
  var track = document.getElementById('hutTrack');
  var dotsWrap = document.getElementById('hutDots');
  if (!track) return;
  var items = track.children;

  for (var i = 0; i < items.length; i++) {
    var d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('aria-label', 'Poster ' + (i + 1));
    d.dataset.i = i;
    d.addEventListener('click', function () { goTo(+this.dataset.i); });
    dotsWrap.appendChild(d);
  }
  var dots = dotsWrap.children;

  function current() {
    var x = track.scrollLeft, best = 0, min = Infinity;
    for (var i = 0; i < items.length; i++) {
      var dist = Math.abs(items[i].offsetLeft - track.offsetLeft - x);
      if (dist < min) { min = dist; best = i; }
    }
    return best;
  }
  function goTo(i) {
    var max = items.length - 1;
    if (i > max) i = 0;
    if (i < 0) i = max;
    track.scrollTo({ left: items[i].offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }
  function updateDots() {
    var c = current();
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('is-active', i === c);
  }
  track.addEventListener('scroll', function () { window.requestAnimationFrame(updateDots); });
  updateDots();

  document.querySelectorAll('[data-slide]').forEach(function (b) {
    b.addEventListener('click', function () {
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
      if (b.dataset.slide === 'next') goTo(atEnd ? 0 : current() + 1);
      else goTo(current() - 1);
    });
  });

  // Auto main setiap 5 saat, berhenti bila tetikus di atas
  var timer, paused = false;
  track.addEventListener('mouseenter', function () { paused = true; });
  track.addEventListener('mouseleave', function () { paused = false; });
  timer = setInterval(function () {
    if (paused || document.hidden) return;
    var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    goTo(atEnd ? 0 : current() + 1);
  }, 5000);
})();
