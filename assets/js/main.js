// Maritim Malaysia – skrip laman utama
(function () {
  // Tarikh semasa (Bahasa Melayu)
  var el = document.getElementById('tarikh');
  if (el) {
    el.textContent = new Date().toLocaleDateString('ms-MY', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

  // Header bayang semasa skrol
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  });

  // Menu mudah alih
  var nav = document.getElementById('nav');
  var overlay = document.getElementById('overlay');
  function openNav() { nav.classList.add('is-open'); overlay.classList.add('is-open'); document.body.classList.add('nav-open'); document.body.style.overflow = 'hidden'; }
  function closeNav() { nav.classList.remove('is-open'); overlay.classList.remove('is-open'); document.body.classList.remove('nav-open'); document.body.style.overflow = ''; }
  document.getElementById('navOpen').addEventListener('click', openNav);
  document.getElementById('navClose').addEventListener('click', closeNav);
  overlay.addEventListener('click', closeNav);

  // Akordion submenu (mudah alih)
  var mq = window.matchMedia('(max-width: 991px)');

  // Elak halaman "terkunci": jika skrin dibesarkan ke saiz desktop semasa menu
  // mudah alih terbuka, tutup menu dan buka semula skrol. Esc juga menutup menu.
  function onViewportChange(e) {
    if (!e.matches) {
      closeNav();
      document.querySelectorAll('.has-sub.is-open').forEach(function (i) { i.classList.remove('is-open'); });
    }
  }
  if (mq.addEventListener) mq.addEventListener('change', onViewportChange); else mq.addListener(onViewportChange);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav(); });
  document.querySelectorAll('.has-sub > .menu__link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (!mq.matches) return;
      var item = link.parentElement;
      var wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.has-sub.is-open').forEach(function (i) { i.classList.remove('is-open'); });
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  // Tiada pautan sebenar buat masa ini
  document.querySelectorAll('a[href="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });

  // Tab perkhidmatan
  var tabs = document.querySelectorAll('.tab');
  var cards = document.querySelectorAll('.svc');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('is-active'); });
      tab.classList.add('is-active');
      var cat = tab.dataset.tab;
      cards.forEach(function (c) {
        var show = cat === 'semua' || c.dataset.cat === cat;
        c.classList.toggle('is-hidden', !show);
      });
    });
  });
})();
