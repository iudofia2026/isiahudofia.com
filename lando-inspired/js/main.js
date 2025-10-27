/* ========================================
   Lando Norris-Inspired JavaScript
   Smooth Scroll, Animations, Canvas Effects
   ======================================== */

(function() {
  'use strict';

  // ========================================
  // Smooth Scrolling with Lenis
  // ========================================
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Anchor link smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, {
          offset: -100,
          duration: 1.5
        });

        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          hamburger.classList.remove('active');
        }
      }
    });
  });

  // ========================================
  // Navigation Theme Switching
  // ========================================
  const nav = document.querySelector('.main-nav');
  const sections = document.querySelectorAll('section[data-nav-theme]');

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '-100px 0px -50% 0px'
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const theme = entry.target.dataset.navTheme;
        nav.setAttribute('data-nav-theme', theme);
      }
    });
  }, observerOptions);

  sections.forEach(section => navObserver.observe(section));

  // Add scrolled class to nav
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ========================================
  // Hamburger Menu
  // ========================================
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');

      // Prevent scroll when menu is open
      if (mobileMenu.classList.contains('active')) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        lenis.start();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        lenis.start();
      }
    });
  }

  // ========================================
  // Split Text Animation
  // ========================================
  function splitText(element) {
    const text = element.textContent;
    const words = text.split(' ');

    element.innerHTML = '';

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';
      wordSpan.style.display = 'inline-block';
      wordSpan.style.marginRight = '0.3em';

      const chars = word.split('');
      chars.forEach((char, charIndex) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        charSpan.textContent = char;
        charSpan.style.transitionDelay = `${(wordIndex * 0.1 + charIndex * 0.03)}s`;
        wordSpan.appendChild(charSpan);
      });

      element.appendChild(wordSpan);
    });
  }

  // Apply split text to elements
  const splitElements = document.querySelectorAll('[data-split]');
  splitElements.forEach(splitText);

  // Animate on scroll
  const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        splitObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  splitElements.forEach(el => splitObserver.observe(el));

  // ========================================
  // Hero Canvas Animation (Rive-inspired)
  // ========================================
  const heroCanvas = document.getElementById('hero-rive');

  if (heroCanvas) {
    const ctx = heroCanvas.getContext('2d');
    let width, height, particles = [];
    let animationId;

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = heroCanvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      heroCanvas.width = rect.width * dpr;
      heroCanvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
    }

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = 0;
        this.speed = Math.random() * 0.5 + 0.2;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.y += this.speed;

        if (this.y > height) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(193, 255, 114, ${this.opacity})`;
        ctx.fill();
      }
    }

    function init() {
      resize();
      particles = [];

      const particleCount = Math.floor((width * height) / 15000);

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, 'rgba(10, 31, 26, 0.3)');
      gradient.addColorStop(1, 'rgba(19, 49, 42, 0.5)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(193, 255, 114, ${(1 - distance / 150) * 0.2})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      init();
      animate();

      window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        init();
        animate();
      });

      // Pause animation when tab is not visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          cancelAnimationFrame(animationId);
        } else {
          animate();
        }
      });
    }
  }

  // ========================================
  // Helmet Gallery Hover Effects
  // ========================================
  const helmetItems = document.querySelectorAll('.helmet-item');

  helmetItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05) rotateZ(2deg)';
    });

    item.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  // ========================================
  // Track Card Tilt Effect
  // ========================================
  const trackCards = document.querySelectorAll('.track-card');

  trackCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;

      this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = '';
    });
  });

  // ========================================
  // Scroll-triggered Fade In Animations
  // ========================================
  const fadeElements = document.querySelectorAll('.track-card, .helmet-item, .partnership-item, .contact-card');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    fadeObserver.observe(el);
  });

  // ========================================
  // Device Rotation Detection (Mobile)
  // ========================================
  function checkOrientation() {
    const rotationPrompt = document.querySelector('.rotation-prompt');

    if (window.innerWidth <= 768 && window.innerHeight < window.innerWidth) {
      // Landscape on mobile
      if (rotationPrompt) {
        rotationPrompt.style.display = 'flex';
        lenis.stop();
      }
    } else {
      if (rotationPrompt) {
        rotationPrompt.style.display = 'none';
        lenis.start();
      }
    }
  }

  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
  checkOrientation();

  // ========================================
  // Parallax Effect on Hero Section
  // ========================================
  const heroSection = document.querySelector('.hero-section');

  if (heroSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallax = scrolled * 0.5;

      if (scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${parallax}px)`;
      }
    });
  }

  // ========================================
  // Custom Cursor Effect (Optional)
  // ========================================
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--color-lime);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease;
    display: none;
  `;
  document.body.appendChild(cursor);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    const diffX = mouseX - cursorX;
    const diffY = mouseY - cursorY;

    cursorX += diffX * 0.1;
    cursorY += diffY * 0.1;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(animateCursor);
  }

  // Only show custom cursor on desktop
  if (window.innerWidth > 1024) {
    cursor.style.display = 'block';
    animateCursor();

    // Scale cursor on hoverable elements
    const hoverables = document.querySelectorAll('a, button, .track-card, .helmet-item');

    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursor.style.borderColor = 'var(--color-lime)';
      });

      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
      });
    });
  }

  // ========================================
  // Console Easter Egg
  // ========================================
  console.log('%c🏎️ Built with inspiration from Lando Norris', 'font-size: 16px; color: #c1ff72; font-weight: bold;');
  console.log('%cIsiah Udofia - Yale University 2026', 'font-size: 14px; color: #69a8ff;');
  console.log('%cInterested in the code? Check out the repo!', 'font-size: 12px; color: #999;');

  // ========================================
  // Performance Monitoring
  // ========================================
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.renderTime || entry.loadTime);
        }
      }
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // ========================================
  // Service Worker Registration (Optional)
  // ========================================
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker not available, continue without it
      });
    });
  }

})();
