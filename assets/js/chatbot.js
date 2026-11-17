/*!
 * Pembantu Soalan Lazim – Maritim Malaysia (mockup)
 * --------------------------------------------------
 * Chatbot ringkas untuk Soalan Lazim. Tiada pelayan diperlukan:
 * soalan dipadankan dengan kata kunci dalam senarai FAQ di bawah.
 *
 * Cara guna:
 *   <link rel="stylesheet" href="assets/css/chatbot.css">
 *   <script src="assets/js/chatbot.js" defer></script>
 *   Mana-mana elemen dengan atribut  data-chat-open  akan membuka chatbot.
 *
 * Sambung kepada AI sebenar kemudian:
 *   Tukar fungsi getAnswer(text) supaya memanggil API anda dan
 *   pulangkan Promise yang menghasilkan teks/HTML jawapan.
 */
(function () {
  'use strict';
  if (window.MaritimChat) return;

  /* Gambar avatar pembantu. Tukar melalui atribut pada tag skrip:
     <script src="assets/js/chatbot.js" data-avatar="assets/img/chatbot-avatar.png" defer></script> */
  var SCRIPT = document.currentScript || document.querySelector('script[src*="chatbot.js"]');
  var AVATAR_SRC = (SCRIPT && SCRIPT.getAttribute('data-avatar')) || 'assets/img/chatbot-avatar.png';
  function avatar(cls) { return '<img class="' + cls + '" src="' + AVATAR_SRC + '" alt="" aria-hidden="true">'; }

  /* ================= Pangkalan Soalan Lazim =================
     k = kata kunci (huruf kecil), a = jawapan (HTML ringkas dibenarkan) */
  var FAQ = [
    { id: 'kecemasan', label: 'Nombor kecemasan di laut',
      k: ['kecemasan', 'emergency', '999', 'darurat', 'tolong', 'tenggelam', 'karam', 'lemas', 'hanyut', 'terkandas', 'tersadai', 'rosak', 'kemalangan', 'hilang di laut', 'bantuan', 'carilamat', 'menyelamat', 'sar', 'pomm'],
      a: 'Untuk <b>kecemasan di laut</b>, hubungi <b>999</b> dengan segera.<br><br>Anda juga boleh menghubungi <b>Pusat Operasi Maritim Malaysia (POMM)</b> yang beroperasi 24 jam:<br>• 03-8995 7208<br>• 019-261 1833' },
    { id: 'alamat', label: 'Alamat ibu pejabat',
      k: ['alamat', 'ibu pejabat', 'hq', 'lokasi', 'telefon', 'nombor telefon', 'hubungi', 'faks', 'putrajaya', 'pejabat utama'],
      a: '<b>Agensi Penguatkuasaan Maritim Malaysia</b><br>Aras 4-12, One IOI Square, IOI Resort,<br>62502 Putrajaya.<br><br>Tel: <b>03-8995 7000</b><br>Faks: 03-8941 4000' },
    { id: 'aduan', label: 'Cara membuat aduan',
      k: ['aduan', 'adu', 'complain', 'eaduan', 'rungutan', 'maklum balas', 'cadangan', 'tidak puas hati'],
      a: 'Anda boleh menghantar aduan secara dalam talian melalui <b>eAduan</b> (pautan di bahagian Pautan Pantas).<br><br>Untuk cadangan atau penghargaan, gunakan borang <b>Maklum Balas Pelanggan</b>.' },
    { id: 'integriti', label: 'Laporkan salah laku',
      k: ['rasuah', 'integriti', 'salah laku', 'sprm', 'sogok', 'suapan', 'penyelewengan'],
      a: 'Salah laku atau rasuah boleh dilaporkan melalui <b>Aduan Integriti</b>. Maklumat pengadu dirahsiakan.<br><br>Maritim Malaysia memegang pensijilan <b>MS ISO 37001:2016</b> (Sistem Pengurusan Anti Rasuah).' },
    { id: 'kerjaya', label: 'Jawatan kosong',
      k: ['kerja', 'kerjaya', 'jawatan', 'kosong', 'mohon', 'permohonan', 'sertai', 'pengambilan', 'latihan', 'amsas', 'syarat'],
      a: 'Maklumat <b>jawatan kosong</b>, syarat kelayakan dan tarikh pengambilan diumumkan di halaman <b>Kerjaya</b>.<br><br>Latihan pegawai dan anggota dijalankan oleh <b>Akademi Maritim Sultan Ahmad Shah (AMSAS)</b>.' },
    { id: 'tender', label: 'Tender & sebut harga',
      k: ['tender', 'sebut harga', 'sebutharga', 'perolehan', 'pembekal', 'kontraktor'],
      a: 'Notis <b>tender, sebut harga</b> dan senarai perolehan berjaya dipaparkan di halaman <b>Tender &amp; Sebut Harga</b>.' },
    { id: 'negeri', label: 'Pejabat maritim negeri',
      k: ['negeri', 'cawangan', 'direktori', 'pejabat negeri', 'kedah', 'perlis', 'pulau pinang', 'penang', 'perak', 'selangor', 'melaka', 'negeri sembilan', 'johor', 'pahang', 'terengganu', 'kelantan', 'sabah', 'sarawak'],
      a: 'Selain Ibu Pejabat di Putrajaya, Maritim Malaysia mempunyai pejabat <b>Maritim Negeri</b> di:<br>Kedah/Perlis, Pulau Pinang, Perak, Selangor, Melaka &amp; Negeri Sembilan, Johor, Pahang, Terengganu, Kelantan, Sabah dan Sarawak.<br><br>Alamat penuh ada di menu <b>Direktori</b>.' },
    { id: 'fungsi', label: 'Fungsi Maritim Malaysia',
      k: ['fungsi', 'peranan', 'tugas', 'apa itu', 'apmm', 'mmea', 'coast guard', 'tanggungjawab'],
      a: 'Antara fungsi utama Maritim Malaysia:<br>• Menguatkuasa undang-undang di Zon Maritim Malaysia<br>• Mencari dan menyelamat di laut<br>• Mencegah dan menyekat jenayah maritim<br>• Pengawasan udara dan pantai<br>• Mengawal dan mencegah pencemaran maritim' },
    { id: 'portal', label: 'Kenal pasti portal rasmi',
      k: ['palsu', 'scam', 'penipuan', 'gov.my', 'https', 'laman palsu', 'tipu', 'rasmi ke'],
      a: 'Portal rasmi kerajaan berakhir dengan <b>.gov.my</b> dan menggunakan <b>https://</b> (ikon kunci mangga). Jika tidak, tutup halaman tersebut serta-merta.' },
    { id: 'sosial', label: 'Media sosial rasmi',
      k: ['facebook', 'instagram', 'tiktok', 'youtube', 'twitter', 'media sosial', 'sosial media'],
      a: 'Ikuti Maritim Malaysia di media sosial:<br>• Facebook: maritimmalaysia<br>• X: @KPMaritimmsia<br>• Instagram: malaysia_coastguard<br>• YouTube: malaysiacoastguard' },
    { id: 'aplikasi', label: 'Aplikasi mudah alih',
      k: ['aplikasi', 'app', 'apps', 'mudah alih', 'muat turun', 'download', 'telefon pintar'],
      a: '<b>Aplikasi Mudah Alih</b> Maritim Malaysia boleh dimuat turun melalui App Store dan Google Play. Pautan ada di bahagian <b>e-Perkhidmatan</b>.' }
  ];
  var SUGGEST = ['kecemasan', 'alamat', 'aduan', 'kerjaya', 'tender', 'negeri'];

  var SMALLTALK = [
    { k: ['hai', 'hi', 'hello', 'helo', 'assalamualaikum', 'salam', 'selamat pagi', 'selamat petang', 'selamat malam'],
      a: 'Salam sejahtera! Saya Pembantu Maritim. Apa yang boleh saya bantu hari ini?' },
    { k: ['terima kasih', 'thanks', 'thank you', 'tq'], a: 'Sama-sama! Ada apa-apa lagi yang boleh saya bantu?' }
  ];
  var FALLBACK = 'Maaf, saya belum mempunyai jawapan untuk soalan itu. Cuba pilih salah satu topik di bawah, atau hubungi Ibu Pejabat di <b>03-8995 7000</b>.';

  /* ================= Pemadanan ringkas ================= */
  function norm(s) { return (' ' + s.toLowerCase().replace(/[^a-z0-9.\s]/g, ' ').replace(/\s+/g, ' ') + ' '); }
  function score(text, keys) {
    var t = norm(text), n = 0;
    keys.forEach(function (k) { if (t.indexOf(' ' + k + ' ') > -1 || (k.length > 4 && t.indexOf(k) > -1)) n += k.split(' ').length; });
    return n;
  }
  function getAnswer(text) {
    var best = null, top = 0;
    FAQ.forEach(function (f) { var s = score(text, f.k); if (s > top) { top = s; best = f; } });
    if (best) return Promise.resolve({ html: best.a, id: best.id });
    for (var i = 0; i < SMALLTALK.length; i++) if (score(text, SMALLTALK[i].k)) return Promise.resolve({ html: SMALLTALK[i].a });
    return Promise.resolve({ html: FALLBACK, fallback: true });
  }

  /* ================= Antara muka ================= */
  var I = {
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="9" cy="10.5" r="1.2" fill="currentColor"/><circle cx="12" cy="10.5" r="1.2" fill="currentColor"/><circle cx="15" cy="10.5" r="1.2" fill="currentColor"/></svg>',
    bot: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="12" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3v4M8.5 19v2M15.5 19v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="9.5" cy="13" r="1.5" fill="currentColor"/><circle cx="14.5" cy="13" r="1.5" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12 20 4l-6 16-3-7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  var root, panel, log, input, chips, launcher, opened = false, started = false;

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function build() {
    root = el('div', 'mchat');
    root.innerHTML =
      '<button type="button" class="mchat-launch" aria-controls="mchatPanel" aria-expanded="false" aria-label="Tanya Kami – Pembantu Maritim">' + avatar('mchat-launch__img') + '<span>Tanya Kami</span></button>' +
      '<section class="mchat-panel" id="mchatPanel" role="dialog" aria-label="Pembantu Soalan Lazim" aria-hidden="true">' +
        '<header class="mchat-head">' +
          '<span class="mchat-avatar">' + avatar('mchat-avatar__img') + '</span>' +
          '<div class="mchat-title"><strong>Pembantu Maritim</strong><small><i class="mchat-dot"></i>Soalan Lazim · dalam talian</small></div>' +
          '<button type="button" class="mchat-icon" data-act="reset" aria-label="Mula semula">' + I.reset + '</button>' +
          '<button type="button" class="mchat-icon" data-act="close" aria-label="Tutup">' + I.close + '</button>' +
        '</header>' +
        '<div class="mchat-log" aria-live="polite"></div>' +
        '<div class="mchat-chips"></div>' +
        '<form class="mchat-form" autocomplete="off">' +
          '<input type="text" class="mchat-input" placeholder="Taip soalan anda…" aria-label="Soalan anda" maxlength="200">' +
          '<button type="submit" class="mchat-send" aria-label="Hantar">' + I.send + '</button>' +
        '</form>' +
        '<p class="mchat-note">Jawapan automatik berdasarkan Soalan Lazim. Kecemasan: hubungi <b>999</b>.</p>' +
      '</section>';
    document.body.appendChild(root);

    launcher = root.querySelector('.mchat-launch');
    panel = root.querySelector('.mchat-panel');
    log = root.querySelector('.mchat-log');
    chips = root.querySelector('.mchat-chips');
    input = root.querySelector('.mchat-input');

    launcher.addEventListener('click', function () { opened ? close() : open(); });
    root.querySelector('[data-act="close"]').addEventListener('click', close);
    root.querySelector('[data-act="reset"]').addEventListener('click', reset);
    root.querySelector('.mchat-form').addEventListener('submit', function (e) {
      e.preventDefault(); var t = input.value.trim(); if (!t) return; input.value = ''; ask(t);
    });
    chips.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      var f = FAQ.filter(function (x) { return x.id === b.dataset.id; })[0]; if (f) ask(f.label, f);
    });
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-chat-open]');
      if (t) { e.preventDefault(); open(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && opened) close(); });
  }

  function renderChips(exclude) {
    chips.innerHTML = '';
    SUGGEST.filter(function (id) { return id !== exclude; }).forEach(function (id) {
      var f = FAQ.filter(function (x) { return x.id === id; })[0];
      chips.appendChild(el('button', 'mchat-chip', f.label)).dataset.id = id;
    });
  }

  function add(who, html) {
    var row = el('div', 'mchat-row mchat-row--' + who);
    if (who === 'bot') row.appendChild(el('span', 'mchat-mini', avatar('mchat-mini__img')));
    row.appendChild(el('div', 'mchat-bubble', html));
    log.appendChild(row); log.scrollTop = log.scrollHeight; return row;
  }
  function typing() { var r = add('bot', '<span class="mchat-typing"><i></i><i></i><i></i></span>'); r.classList.add('is-typing'); return r; }

  function ask(text, faq) {
    add('user', text.replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }));
    var t = typing();
    var p = faq ? Promise.resolve({ html: faq.a, id: faq.id }) : getAnswer(text);
    p.then(function (res) {
      setTimeout(function () {
        t.remove(); add('bot', res.html); renderChips(res.id);
      }, 550 + Math.min(900, res.html.length * 4));
    });
  }

  function greet() {
    add('bot', 'Salam sejahtera! Saya <b>Pembantu Maritim</b>. Tanya apa-apa berkaitan perkhidmatan Maritim Malaysia, atau pilih topik di bawah.');
    renderChips();
  }
  function reset() { log.innerHTML = ''; greet(); input.focus(); }

  function open() {
    if (!started) { greet(); started = true; }
    opened = true; root.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false'); launcher.setAttribute('aria-expanded', 'true');
    setTimeout(function () { input.focus(); }, 200);
  }
  function close() {
    opened = false; root.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true'); launcher.setAttribute('aria-expanded', 'false'); launcher.focus();
  }

  window.MaritimChat = { open: function () { open(); }, close: function () { close(); }, ask: function (t) { open(); ask(t); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
