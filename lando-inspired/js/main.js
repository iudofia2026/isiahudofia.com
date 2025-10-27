/* ========================================
   Topography Animation with Mouse Interaction
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
  // Enhanced Topography Animation - Lando Style
  // ========================================
  const canvas = document.getElementById('topography-canvas');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let time = 0;
    let animationId;

    // Finer grid for smoother topography
    const gridSize = 30;
    const points = [];

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      width = rect.width;
      height = rect.height;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      // Recreate grid points
      points.length = 0;
      const cols = Math.ceil(width / gridSize) + 4;
      const rows = Math.ceil(height / gridSize) + 4;

      for (let y = -2; y < rows; y++) {
        for (let x = -2; x < cols; x++) {
          points.push({
            baseX: x * gridSize,
            baseY: y * gridSize,
            x: x * gridSize,
            y: y * gridSize,
            vx: 0,
            vy: 0
          });
        }
      }
    }

    // Mouse tracking
    window.addEventListener('mousemove', (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      targetMouseX = width / 2;
      targetMouseY = height / 2;
    });

    function animate() {
      time += 0.003;

      // Ultra smooth mouse following with easing
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Clear canvas with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // Update points with smooth physics
      const cols = Math.ceil(width / gridSize) + 4;

      points.forEach((point, index) => {
        // Distance from mouse
        const dx = point.baseX - mouseX;
        const dy = point.baseY - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Smoother mouse influence with falloff
        const maxDistance = 250;
        const force = Math.max(0, 1 - distance / maxDistance);
        const easedForce = force * force * force; // Cubic easing for smoother falloff
        const angle = Math.atan2(dy, dx);

        const pushX = Math.cos(angle) * easedForce * 40;
        const pushY = Math.sin(angle) * easedForce * 40;

        // Multiple wave layers for richer movement
        const wave1 = Math.sin(point.baseX * 0.008 + time * 1.5) * Math.cos(point.baseY * 0.008 + time * 1.5) * 8;
        const wave2 = Math.sin(point.baseX * 0.015 + time * 0.7) * 3;
        const wave3 = Math.cos(point.baseY * 0.012 + time * 1.2) * 4;

        // Target position
        const targetX = point.baseX + pushX + wave1 + wave2;
        const targetY = point.baseY + pushY + wave1 + wave3;

        // Smooth spring physics
        const springStrength = 0.02;
        const damping = 0.85;

        point.vx += (targetX - point.x) * springStrength;
        point.vy += (targetY - point.y) * springStrength;

        point.vx *= damping;
        point.vy *= damping;

        point.x += point.vx;
        point.y += point.vy;
      });

      // Draw with smooth bezier curves instead of straight lines
      ctx.strokeStyle = 'rgba(0, 31, 63, 0.12)';
      ctx.lineWidth = 0.8;

      // Horizontal smooth curves
      for (let row = 0; row < points.length / cols; row++) {
        ctx.beginPath();
        for (let col = 0; col < cols - 1; col++) {
          const index = row * cols + col;
          const point = points[index];
          const nextPoint = points[index + 1];

          if (col === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            // Use quadratic curves for smoothness
            const cpX = (point.x + nextPoint.x) / 2;
            const cpY = (point.y + nextPoint.y) / 2;
            ctx.quadraticCurveTo(point.x, point.y, cpX, cpY);
          }
        }
        ctx.stroke();
      }

      // Vertical smooth curves
      for (let col = 0; col < cols; col++) {
        ctx.beginPath();
        for (let row = 0; row < points.length / cols - 1; row++) {
          const index = row * cols + col;
          const point = points[index];
          const nextPoint = points[(row + 1) * cols + col];

          if (row === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            // Use quadratic curves for smoothness
            const cpX = (point.x + nextPoint.x) / 2;
            const cpY = (point.y + nextPoint.y) / 2;
            ctx.quadraticCurveTo(point.x, point.y, cpX, cpY);
          }
        }
        ctx.stroke();
      }

      // Draw glowing points near mouse with gradient
      points.forEach(point => {
        const dx = point.x - mouseX;
        const dy = point.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 180) {
          const opacity = (1 - distance / 180) * 0.9;
          const radius = 2 + (1 - distance / 180) * 2;

          // Gradient glow
          const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 2);
          gradient.addColorStop(0, `rgba(0, 102, 204, ${opacity})`);
          gradient.addColorStop(1, `rgba(0, 102, 204, 0)`);

          ctx.beginPath();
          ctx.arc(point.x, point.y, radius * 2, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          // Core point
          ctx.beginPath();
          ctx.arc(point.x, point.y, radius * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 102, 204, ${opacity})`;
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
      resize();
      // Initialize mouse to center
      mouseX = width / 2;
      mouseY = height / 2;
      targetMouseX = width / 2;
      targetMouseY = height / 2;

      animate();

      window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        resize();
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
  // Console Easter Egg
  // ========================================
  console.log('%c🏎️ Built with inspiration from Lando Norris', 'font-size: 16px; color: #0066cc; font-weight: bold;');
  console.log('%cIsiah Udofia - Yale University 2026', 'font-size: 14px; color: #001f3f;');
  console.log('%cTopography animation with mouse interaction', 'font-size: 12px; color: #6c757d;');

})();
