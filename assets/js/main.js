/* MIKUAL · JS del sitio (sin dependencias). La configuración vive en config.js. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var CONFIG = window.MIKUAL_CONFIG || {};

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Sugerencia de idioma según el navegador ---------- */
  var banner = document.querySelector('.lang-banner');
  if (banner) {
    var pageLang = document.documentElement.lang || 'es';
    var stored = null;
    try { stored = localStorage.getItem('mikual-lang-banner'); } catch (e) {}
    var langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
    var prefersEs = String(langs[0] || '').toLowerCase().indexOf('es') === 0;
    var show = (pageLang === 'es' && !prefersEs) || (pageLang === 'en' && prefersEs);
    if (show && stored !== 'dismissed') banner.hidden = false;
    var close = banner.querySelector('button');
    if (close) close.addEventListener('click', function () {
      banner.hidden = true;
      try { localStorage.setItem('mikual-lang-banner', 'dismissed'); } catch (e) {}
    });
  }

  /* ---------- Agenda una llamada: página de reservas de Google Calendar ----------
     Solo se aceptan direcciones https de Google Calendar; el iframe se crea con
     la API del DOM (sin innerHTML) para no interpretar texto como HTML. */
  function safeUrl(value, hosts) {
    try {
      var u = new URL(value);
      return (u.protocol === 'https:' && hosts.indexOf(u.hostname) !== -1) ? u.href : null;
    } catch (e) { return null; }
  }

  var link = safeUrl(CONFIG.agendaLink, ['calendar.app.google', 'calendar.google.com']);
  if (link) {
    document.querySelectorAll('[data-agenda-link]').forEach(function (a) { a.href = link; });
  }

  var box = document.getElementById('agenda-box');
  var embed = safeUrl(CONFIG.agendaEmbedUrl, ['calendar.google.com']);
  if (box && embed) {
    var frame = document.createElement('iframe');
    frame.src = embed;
    frame.title = document.documentElement.lang === 'en' ? 'Book a call with MIKUAL' : 'Agenda una llamada con MIKUAL';
    frame.className = 'agenda-frame';
    frame.loading = 'lazy';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    box.replaceChildren(frame);
    box.style.padding = '0';
    box.style.border = '1px solid var(--grid)';
    box.style.background = 'var(--white)';
    box.style.overflow = 'hidden';
  }
})();
