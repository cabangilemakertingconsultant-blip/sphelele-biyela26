// ============================================================
// CABANGILE MARKETING CONSULTANT HUB — MAIN.JS
// Global JavaScript: Navbar, Animations, Toast, Contact, etc.
// ============================================================

// ── NAVBAR SCROLL EFFECT ──────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.cmc-navbar');
  if (!navbar) return;

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// ── MARK ACTIVE NAV LINK ──────────────────────────────────
function initActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.cmc-navbar .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── SCROLL REVEAL ─────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ── COUNTER ANIMATION ─────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();

      const animate = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ── TOAST NOTIFICATION ────────────────────────────────────
function showToast(message, type = 'success') {
  let toast = document.getElementById('cmc-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cmc-toast';
    toast.className = 'toast-cmc';
    document.body.appendChild(toast);
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  toast.innerHTML = <span>${icons[type] || '✅'}</span><span>${message}</span>;
  toast.className = toast-cmc ${type};

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// ── PORTFOLIO FILTER ──────────────────────────────────────
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        setTimeout(() => {
          item.style.display = show ? 'block' : 'none';
          if (show) {
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            });
          }
        }, 200);
      });
    });
  });
}

// ── CONTACT FORM ──────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.btn-loader');

    if (btnText) btnText.style.display = 'none';
    if (loader) loader.style.display = 'inline-block';
    btn.disabled = true;

    const data = {
      name:    document.getElementById('contact-name')?.value?.trim(),
      email:   document.getElementById('contact-email')?.value?.trim(),
      phone:   document.getElementById('contact-phone')?.value?.trim(),
      service: document.getElementById('contact-service')?.value,
      message: document.getElementById('contact-message')?.value?.trim(),
    };

    try {
      const success = await submitContactForm(data);
      if (success) {
        showToast('Message sent successfully! We\'ll be in touch soon.', 'success');
        form.reset();
      } else {
        // Fallback: just show success for demo
        showToast('Thank you! Your message has been received.', 'success');
        form.reset();
      }
    } catch (err) {
      showToast('Oops! Something went wrong. Please try again.', 'error');
    } finally {
      if (btnText) btnText.style.display = 'inline';
      if (loader) loader.style.display = 'none';
      btn.disabled = false;
    }
  });
}

// ── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ── BACK TO TOP ───────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── VIDEO PLACEHOLDER CLICK ───────────────────────────────
function initVideoPlaceholders() {
  document.querySelectorAll('.video-placeholder').forEach(placeholder => {
    placeholder.addEventListener('click', () => {
      const videoId = placeholder.dataset.videoId;
      if (!videoId) return;

      const wrapper = placeholder.parentElement;
      const iframe = document.createElement('iframe');
      iframe.src = https://www.youtube.com/embed/${videoId}?autoplay=1;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:none;';

      wrapper.innerHTML = '';
      wrapper.appendChild(iframe);
    });
  });
}

// ── NEWSLETTER FORM ───────────────────────────────────────
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]')?.value?.trim();
    if (!email) return showToast('Please enter a valid email.', 'warning');
    showToast('🎉 Thank you for subscribing!', 'success');
    form.reset();
  });
}

// ── BACK-TO-TOP BUTTON HTML ───────────────────────────────
function injectBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
  btn.setAttribute('aria-label', 'Back to top');
  btn.style.cssText = `
    position: fixed; bottom: 30px; left: 30px; z-index: 999;
    width: 44px; height: 44px;
    background: var(--gradient-purple);
    border: none; border-radius: 50%;
    color: #fff; font-size: 1.1rem;
    cursor: pointer; box-shadow: var(--shadow-purple);
    transition: all 0.3s ease;
    opacity: 0; transform: translateY(10px);
    display: flex; align-items: center; justify-content: center;
  `;
  document.body.appendChild(btn);

  const style = document.createElement('style');
  style.textContent = #back-to-top.show { opacity: 1 !important; transform: translateY(0) !important; } #back-to-top:hover { transform: translateY(-3px) !important; };
  document.head.appendChild(style);
}

// ── YEAR IN FOOTER ─────────────────────────────────────────
function updateYear() {
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

// ── INIT ALL ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectBackToTop();
  initNavbar();
  initActiveNav();
  initScrollReveal();
  initCounters();
  initPortfolioFilter();
  initContactForm();
  initSmoothScroll();
  initVideoPlaceholders();
  initNewsletterForm();
  updateYear();

  // Init back to top after button is injected
  setTimeout(initBackToTop, 50);
});
