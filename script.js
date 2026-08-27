(() => {
  'use strict';

  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ===== Header scroll state + descriptor swap ===== */
  const header = document.getElementById('siteHeader');
  const descriptor = document.getElementById('brandDescriptor');
  const sections = [
    { id: 'hero', text: 'Terapia Cognitivo-Comportamental' },
    { id: 'metodo', text: 'O Método COGNI' },
    { id: 'formacao', text: 'COGNI Formação' },
    { id: 'clinica', text: 'COGNI Clínica' },
    { id: 'ecossistema', text: 'Ecossistema COGNI' },
    { id: 'faq', text: 'Dúvidas Frequentes' }
  ].map(s => ({ ...s, el: document.getElementById(s.id) })).filter(s => s.el);

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 12);

    let current = sections[0];
    for (const s of sections) {
      if (s.el.getBoundingClientRect().top - 120 <= 0) current = s;
    }
    if (descriptor && descriptor.textContent !== current.text) {
      descriptor.style.opacity = 0;
      setTimeout(() => {
        descriptor.textContent = current.text;
        descriptor.style.opacity = 1;
      }, 150);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ===== Mobile nav toggle ===== */
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  navToggle.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open);
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', false);
  }));

  /* ===== Scroll reveal ===== */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ===== Accordions ===== */
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const panel = item.querySelector('.accordion-panel');
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      item.parentElement.querySelectorAll('.accordion-trigger').forEach(t => {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          t.closest('.accordion-item').querySelector('.accordion-panel').style.maxHeight = null;
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + 'px';
    });
  });

  /* ===== Method mark interactive hover ===== */
  const methodCards = document.querySelectorAll('.method-card');
  const methodBlocks = document.querySelectorAll('.method-block');
  function setActiveStep(step) {
    methodBlocks.forEach(block => block.classList.toggle('active', block.dataset.step === step));
    methodCards.forEach(card => card.classList.toggle('active', card.dataset.step === step));
  }
  methodCards.forEach(card => {
    card.addEventListener('mouseenter', () => setActiveStep(card.dataset.step));
    card.addEventListener('focus', () => setActiveStep(card.dataset.step));
  });
  document.querySelector('.method-cards')?.addEventListener('mouseleave', () => setActiveStep(null));
  setActiveStep('1');

  /* ===== Magnetic button effect ===== */
  if (!isTouch) {
    document.querySelectorAll('[data-magnetic]').forEach(btn => {
      const strength = 0.35;
      const radius = 60;

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${relX * strength}px, ${relY * strength}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ===== 3D tilt on cards ===== */
  if (!isTouch) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    });
  } else {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('touchstart', () => {
        card.style.transform = 'scale(0.98)';
        card.style.boxShadow = '0 4px 12px rgba(22,63,75,0.08)';
      }, { passive: true });
      card.addEventListener('touchend', () => {
        card.style.transform = 'scale(1.02)';
        card.style.boxShadow = '0 20px 44px rgba(22,63,75,0.18)';
        setTimeout(() => {
          card.style.transform = 'scale(1)';
          card.style.boxShadow = '';
        }, 220);
      }, { passive: true });
    });
  }

  /* ===== Custom cursor (desktop only) ===== */
  if (!isTouch) {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function raf() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(raf);
    }
    raf();

    const hoverTargets = 'a, button, .method-card, [data-tilt], [data-magnetic]';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  } else {
    document.getElementById('cursorDot')?.remove();
    document.getElementById('cursorRing')?.remove();
  }
})();
