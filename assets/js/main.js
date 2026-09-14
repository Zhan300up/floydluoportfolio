/* =========================================================
   南京新媒天文化传媒 · 脚本
   功能：导航、移动端菜单、滚动效果、作品筛选、滚动渐入
   ========================================================= */
(function () {
  'use strict';

  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /* ---------------- 年份 ---------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- 导航 - 滚动状态 ---------------- */
  const nav = $('#nav');
  const setNavStuck = () => {
    if (!nav) return;
    if (window.scrollY > 24) nav.classList.add('is-stuck');
    else nav.classList.remove('is-stuck');
  };
  setNavStuck();
  window.addEventListener('scroll', setNavStuck, { passive: true });

  /* ---------------- 移动端菜单 ---------------- */
  const burger = $('#burger');
  const menu   = $('.nav__menu');
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    /* 点击菜单项后自动关闭 */
    $$('.nav__menu a').forEach(a => {
      a.addEventListener('click', () => {
        if (menu.classList.contains('is-open')) {
          menu.classList.remove('is-open');
          burger.classList.remove('is-open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ---------------- 平滑滚动到锚点 ---------------- */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 64;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------------- 作品筛选 ---------------- */
  const filterBtns = $$('.filter__btn');
  const works = $$('.work');
  if (filterBtns.length && works.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-selected', 'true');

        const cat = btn.dataset.filter;
        works.forEach(w => {
          const match = cat === 'all' || w.dataset.cat === cat;
          w.classList.toggle('is-hidden', !match);
          /* 触发渐入动画 */
          if (match) {
            w.classList.remove('fx', 'is-in');
            // 强制重排后重新启动动画
            // eslint-disable-next-line no-unused-expressions
            w.offsetWidth;
          }
        });
      });
    });
  }

  /* ---------------- 滚动渐入 ---------------- */
  const fxTargets = [
    '.section__head',
    '.about__copy',
    '.about__media',
    '.stats li',
    '.timeline__item',
    '.filter',
    '.work',
    '.teach__card',
    '.affiliations',
    '.contact__card'
  ];
  $$(fxTargets.join(',')).forEach(el => el.classList.add('fx'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    $$('.fx').forEach(el => io.observe(el));
  } else {
    $$('.fx').forEach(el => el.classList.add('is-in'));
  }
})();
