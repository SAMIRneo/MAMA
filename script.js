/* ============ BOUM! — interactions ============ */

document.addEventListener('DOMContentLoaded', () => {

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Curseur-fleur ---------- */
  const cursor = document.getElementById('cursor');
  if (finePointer && cursor) {
    document.documentElement.classList.add('has-cursor');
    let cx = -100, cy = -100, tx = -100, ty = -100;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
      cursor.classList.add('is-on');
    });
    document.addEventListener('mouseleave', () => cursor.classList.remove('is-on'));

    const follow = () => {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-40%, -30%)`;
      requestAnimationFrame(follow);
    };
    follow();

    document.addEventListener('mouseover', (e) => {
      const hot = e.target.closest('a, button, summary, .chip, .pola, .plan');
      cursor.classList.toggle('is-big', !!hot);
    });
  }

  /* ---------- Stickers parallax ---------- */
  const stickers = document.querySelectorAll('.sticker[data-depth]');
  if (finePointer && stickers.length) {
    document.addEventListener('mousemove', (e) => {
      const dx = (e.clientX / window.innerWidth - 0.5);
      const dy = (e.clientY / window.innerHeight - 0.5);
      stickers.forEach(s => {
        const d = Number(s.dataset.depth) || 16;
        s.style.translate = `${dx * d}px ${dy * d}px`;
      });
    });
  }

  /* ---------- Nav : état au scroll + menu mobile ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  const closeMenu = () => {
    navLinks.classList.remove('is-open');
    burger.classList.remove('is-active');
    burger.setAttribute('aria-expanded', 'false');
  };
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-active', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Apparition au scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const idx = Array.from(el.parentNode.children).indexOf(el) % 4;
          setTimeout(() => el.classList.add('is-visible'), idx * 110);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Bascule mensuel / annuel ---------- */
  const toggleBtns = document.querySelectorAll('.toggle__btn');
  const values = document.querySelectorAll('.plan__value');
  const billings = document.querySelectorAll('.plan__billing');

  const animateNumber = (el, from, to) => {
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / 420, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = to;
    };
    requestAnimationFrame(step);
  };

  const setPeriod = (period) => {
    toggleBtns.forEach(btn => {
      const active = btn.dataset.period === period;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    values.forEach(el => {
      const target = Number(el.dataset[period]);
      const current = Number(el.textContent) || target;
      animateNumber(el, current, target);
    });
    billings.forEach((el, i) => {
      if (i === 2) {
        el.textContent = period === 'annual'
          ? 'soit 29 € la semaine — facturé 1 488 €/an'
          : 'soit 34 € la semaine — facturé chaque mois';
      } else {
        el.textContent = period === 'annual' ? 'facturé 1 fois par an (2 mois offerts)' : 'facturé chaque mois';
      }
    });
  };
  toggleBtns.forEach(btn => btn.addEventListener('click', () => setPeriod(btn.dataset.period)));

  /* ---------- FAQ : un seul ouvert à la fois ---------- */
  const faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach(other => { if (other !== item) other.open = false; });
    });
  });

  /* ---------- Ancres vides ---------- */
  document.querySelectorAll('a[href="#"]').forEach(a =>
    a.addEventListener('click', e => e.preventDefault())
  );

  /* ---------- Confettis ---------- */
  const CONFETTI_COLORS = ['#E8452B', '#F6B72B', '#4B1D62', '#FF9BB0', '#8FBF88', '#8CC9F2'];
  let confettiCanvas = null, parts = [], raf = null;

  const ensureCanvas = () => {
    if (!confettiCanvas) {
      confettiCanvas = document.createElement('canvas');
      confettiCanvas.id = 'confetti';
      document.body.appendChild(confettiCanvas);
      const resize = () => {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
      };
      resize();
      window.addEventListener('resize', resize);
    }
    return confettiCanvas;
  };

  const confettiLoop = () => {
    const ctx = confettiCanvas.getContext('2d');
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    parts = parts.filter(p => p.life > 0 && p.y < confettiCanvas.height + 40);
    parts.forEach(p => {
      p.vy += 0.32;
      p.vx *= 0.99;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life -= 0.004;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(p.life, 0);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (parts.length) raf = requestAnimationFrame(confettiLoop);
    else { raf = null; ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); }
  };

  const burstConfetti = (count = 140) => {
    const canvas = ensureCanvas();
    for (let i = 0; i < count; i++) {
      parts.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.7,
        y: canvas.height * 0.4 + Math.random() * 40,
        w: 7 + Math.random() * 9,
        h: 5 + Math.random() * 7,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        vx: (Math.random() - 0.5) * 11,
        vy: -7 - Math.random() * 9,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.35,
        life: 1
      });
    }
    if (!raf) raf = requestAnimationFrame(confettiLoop);
  };

  /* ---------- Quiz ---------- */
  const QUIZ = [
    {
      q: 'Lundi matin, 7 h 42. Ton premier réflexe ?',
      a: [
        { face: '🧘', label: 'Je respire, je bois mon thé, tout va bien', s: 1 },
        { face: '😬', label: 'Je grimace, mais je m\'y mets quand même', s: 2 },
        { face: '🌪️', label: 'Je cours après le bus en criant dans ma tête', s: 3 }
      ]
    },
    {
      q: 'On te dit « à ton âge ? ». Tu réponds…',
      a: [
        { face: '😅', label: 'Je change de sujet discrètement', s: 1 },
        { face: '🙄', label: 'Un sourire poli, et une note mentale', s: 2 },
        { face: '🎤', label: '« À mon âge, je n\'ai plus le temps de vous écouter »', s: 3 }
      ]
    },
    {
      q: 'Ton projet qui dort depuis 3 ans, il fait quoi ?',
      a: [
        { face: '😴', label: 'Il ronronne tranquille, on verra plus tard', s: 1 },
        { face: '⏰', label: 'Il me réveille la nuit, par moments', s: 2 },
        { face: '🚀', label: 'Il a fait ses valises, il veut décoller MAINTENANT', s: 3 }
      ]
    }
  ];

  const RESULTS = {
    douce: {
      emoji: '🫖',
      level: 'Profil : la gentille qui dit oui',
      title: 'Commence par La Douce.',
      text: 'Tu n\'as pas besoin de pression, tu as besoin d\'un rythme qui te ressemble. On remet les bases en place, doucement, et l\'envie revient toute seule.',
      cta: 'Voir La Douce →'
    },
    solide: {
      emoji: '☕',
      level: 'Profil : le grincement élégant',
      title: 'C\'est La Solide pour toi.',
      text: 'Tu grinces des dents (on t\'entend), mais tu veux des outils concrets et un plan. La Solide te donne la structure et le groupe pour passer à l\'action.',
      cta: 'Voir La Solide →'
    },
    totale: {
      emoji: '🌪️',
      level: 'Profil : mode tornade en escarpins',
      title: 'C\'est La Totale, sans hésiter.',
      text: 'Tu n\'en es plus à ta période d\'essai : tu veux tout changer, vite, et avec quelqu\'un à tes côtés. Coach dédiée, plan sur-mesure, garantie résultat.',
      cta: 'Voir La Totale →'
    }
  };

  const q = {
    section: document.getElementById('quiz'),
    count: document.getElementById('quizCount'),
    question: document.getElementById('quizQuestion'),
    answers: document.getElementById('quizAnswers'),
    back: document.getElementById('quizBack'),
    bar: document.getElementById('quizBar'),
    result: document.getElementById('quizResult'),
    emoji: document.getElementById('resultEmoji'),
    level: document.getElementById('resultLevel'),
    title: document.getElementById('resultTitle'),
    text: document.getElementById('resultText'),
    cta: document.getElementById('resultCta'),
    restart: document.getElementById('quizRestart')
  };

  if (q.answers) {
    let step = 0;
    const scores = [];

    const showStep = () => {
      const item = QUIZ[step];
      q.count.textContent = `Question ${step + 1} sur ${QUIZ.length}`;
      q.question.textContent = item.q;
      q.bar.style.width = `${((step + 1) / QUIZ.length) * 100}%`;
      q.back.hidden = step === 0;
      q.answers.innerHTML = '';
      item.a.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.innerHTML = `<span class="qa-face">${opt.face}</span><span>${opt.label}</span>`;
        btn.addEventListener('click', () => {
          scores[step] = opt.s;
          step++;
          if (step < QUIZ.length) showStep();
          else showResult();
        });
        q.answers.appendChild(btn);
      });
    };

    const showResult = () => {
      const total = scores.reduce((a, b) => a + b, 0);
      const tier = total <= 5 ? 'douce' : total <= 7 ? 'solide' : 'totale';
      const r = RESULTS[tier];

      [q.count, q.question, q.answers, q.back].forEach(el => el.hidden = true);
      q.bar.style.width = '100%';
      q.emoji.textContent = r.emoji;
      q.level.textContent = r.level;
      q.title.textContent = r.title;
      q.text.textContent = r.text;
      q.cta.textContent = r.cta;
      q.result.hidden = false;

      q.section.classList.add('is-celebrating');
      setTimeout(() => q.section.classList.remove('is-celebrating'), 700);
      burstConfetti(tier === 'totale' ? 170 : 90);
    };

    q.back.addEventListener('click', () => {
      if (step > 0) { step--; showStep(); }
    });

    q.restart.addEventListener('click', () => {
      step = 0;
      scores.length = 0;
      q.result.hidden = true;
      [q.count, q.question, q.answers].forEach(el => el.hidden = false);
      showStep();
    });

    showStep();
  }


});
