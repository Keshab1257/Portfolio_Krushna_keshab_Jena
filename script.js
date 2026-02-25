/* ════════════════════════════════════════
   KRUSHNA KESHAB JENA — PORTFOLIO JS
   Cursor · Canvas · Typewriter · Tilt
   Scroll Reveal · Form Validation
   ════════════════════════════════════════ */

'use strict';

/* ══ 1. CUSTOM CURSOR ══ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  if (!cursor || !trail) return;

  let mx = -100, my = -100;
  let tx = -100, ty = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animTrail() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animTrail);
  }
  animTrail();

  // Hover effects
  document.querySelectorAll('a, button, [data-tilt]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
      cursor.style.opacity = '0.5';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%,-50%) scale(1)';
      cursor.style.opacity = '1';
    });
  });
})();

/* ══ 2. NAV SCROLL ══ */
(function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });
})();

/* ══ 3. HERO CANVAS — PARTICLE NETWORK ══ */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const CYAN   = [0, 229, 255];
  const W      = () => canvas.width;
  const H      = () => canvas.height;
  const COUNT  = 60;
  const RADIUS = 2;
  const SPEED  = 0.3;
  const DIST   = 140;

  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * W(),
    y: Math.random() * H(),
    vx: (Math.random() - 0.5) * SPEED,
    vy: (Math.random() - 0.5) * SPEED,
    r: RADIUS * (0.5 + Math.random() * 0.8),
  }));

  let mouseX = -9999, mouseY = -9999;
  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, W(), H());

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W()) p.vx *= -1;
      if (p.y < 0 || p.y > H()) p.vy *= -1;

      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const md = Math.sqrt(dx*dx + dy*dy);
      if (md < 80) {
        p.x += dx / md * 1.5;
        p.y += dy / md * 1.5;
      }
    });

    // Connections
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < DIST) {
          const alpha = (1 - dist / DIST) * 0.4;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${CYAN[0]},${CYAN[1]},${CYAN[2]},${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Dots
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CYAN[0]},${CYAN[1]},${CYAN[2]},0.6)`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══ 4. TYPEWRITER ══ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const roles = [
    'ML Engineer',
    'Backend Developer',
    'Data Scientist',
    'GDG DS Lead',
  ];

  let roleIdx = 0, charIdx = 0, deleting = false;
  const TYPE_SPEED  = 80;
  const DEL_SPEED   = 40;
  const PAUSE_END   = 2200;
  const PAUSE_START = 300;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, PAUSE_END);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(type, PAUSE_START);
        return;
      }
    }
    setTimeout(type, deleting ? DEL_SPEED : TYPE_SPEED);
  }

  // Start after hero animation
  setTimeout(type, 1200);
})();

/* ══ 5. SCROLL REVEAL ══ */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // Stagger children in a group
        const siblings = Array.from(e.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const idx = siblings.indexOf(e.target);
        setTimeout(() => {
          e.target.classList.add('visible');
        }, Math.min(idx * 80, 320));
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => obs.observe(el));
})();

/* ══ 6. SKILL BAR ANIMATION ══ */
(function initSkillBars() {
  const bars = document.querySelectorAll('.bar-fill[data-pct]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.pct + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => obs.observe(b));
})();

/* ══ 7. 3D TILT EFFECT ══ */
(function initTilt() {
  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    const MAX_TILT = 8; // degrees

    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const rotX  = -dy * MAX_TILT;
      const rotY  =  dx * MAX_TILT;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        translateZ(6px)
      `;
      card.style.transition = 'transform 0.1s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
  });
})();

/* ══ 8. PARALLAX EFFECT ══ */
(function initParallax() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.getElementById('hero');
    if (!hero) return;

    // Parallax hero content
    const heroContent = hero.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  }, { passive: true });
})();

/* ══ 9. ACTIVE NAV LINK ══ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) {
        current = sec.id;
      }
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  }, { passive: true });
})();

/* ══ 10. CONTACT FORM ══ */
(function initForm() {
  const form       = document.getElementById('contactForm');
  const statusEl   = document.getElementById('formStatus');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = document.getElementById('btnText');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('f-name'),    err: document.getElementById('err-name') },
    email:   { el: document.getElementById('f-email'),   err: document.getElementById('err-email') },
    subject: { el: document.getElementById('f-subject'), err: document.getElementById('err-subject') },
    message: { el: document.getElementById('f-message'), err: document.getElementById('err-message') },
  };

  const rules = {
    name:    v => v.length >= 2   ? '' : 'Please enter your name.',
    email:   v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please enter a valid email.',
    subject: v => v.length >= 3   ? '' : 'Subject must be at least 3 characters.',
    message: v => v.length >= 10  ? '' : 'Message must be at least 10 characters.',
  };

  // Live validation
  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('input', () => {
      const err = rules[key](fields[key].el.value.trim());
      fields[key].err.textContent = err;
      fields[key].el.classList.toggle('error', !!err && fields[key].el.value.length > 0);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    statusEl.textContent = '';

    Object.keys(fields).forEach(key => {
      const val = fields[key].el.value.trim();
      const err = rules[key](val);
      fields[key].err.textContent = err;
      fields[key].el.classList.toggle('error', !!err);
      if (err) valid = false;
    });

    if (!valid) return;

    // Simulate sending
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';

    setTimeout(() => {
      statusEl.style.color = 'var(--green)';
      statusEl.textContent = '✓ Message sent! I\'ll get back to you soon.';
      submitBtn.disabled = false;
      btnText.textContent = 'Send Message';
      form.reset();
      Object.keys(fields).forEach(key => fields[key].el.classList.remove('error'));
      setTimeout(() => { statusEl.textContent = ''; }, 6000);
    }, 1200);
  });
})();

/* ══ 11. SMOOTH ANCHOR OFFSET ══ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ══ 12. NUMBER COUNTER ANIMATION ══ */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target;
        const raw = target.textContent;
        const num = parseFloat(raw);
        const suffix = raw.replace(String(num), '');
        let start = 0;
        const step = num / 30;
        const timer = setInterval(() => {
          start = Math.min(start + step, num);
          target.textContent = (Number.isInteger(num) ? Math.round(start) : start.toFixed(1)) + suffix;
          if (start >= num) clearInterval(timer);
        }, 35);
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.8 });
  stats.forEach(s => obs.observe(s));
})();

/* ══ 13. FLOATING ELEMENTS ══ */
(function initFloat() {
  // Adds subtle floating animation to about badge and similar elements
  const badge = document.querySelector('.about-badge');
  if (badge) {
    badge.style.animation = 'float 4s ease-in-out infinite';
  }

  // Inject float keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-8px); }
    }
    .nav-links a.active { color: var(--cyan); }
    .nav-links a.active::after { width: 100%; }
  `;
  document.head.appendChild(style);
})();
