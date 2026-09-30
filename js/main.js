(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- header : fond plein dès qu'on quitte le haut ---- */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 30); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- menu mobile ---- */
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Ouvrir le menu' : 'Fermer le menu');
      mobileNav.classList.toggle('is-open', !open);
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        burger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('is-open');
      }
    });
  }

  /* ---- apparition au scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    Array.prototype.forEach.call(reveals, function (el) { obs.observe(el); });
  }

  /* ---- formulaire de contact ---- */
  var form = document.getElementById('contact-form');
  if (form) {
    var showError = function (field, msg) {
      field.classList.add('has-error');
      field.querySelector('.err').textContent = msg;
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      Array.prototype.forEach.call(form.querySelectorAll('.field'), function (f) {
        f.classList.remove('has-error');
      });

      var nom = form.querySelector('#nom');
      if (!nom.value.trim()) { showError(nom.closest('.field'), 'Indiquez votre prénom.'); ok = false; }

      var email = form.querySelector('#email');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        showError(email.closest('.field'), 'Adresse e-mail invalide.');
        ok = false;
      }

      var sujet = form.querySelector('#sujet');
      if (!sujet.value) { showError(sujet.closest('.field'), 'Choisissez un sujet.'); ok = false; }

      if (!ok) {
        form.querySelector('.has-error input, .has-error select, .has-error textarea').focus();
        return;
      }

      var box = document.getElementById('form-ok');
      form.reset();
      box.classList.add('is-on');
      box.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });
  }
})();
