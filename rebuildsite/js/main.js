/* ========================================
   Vanta.js Reactive Background + Seamless Loading
   ======================================== */

(function() {
  'use strict';

  // ========================================
  // Vanta.js NET - 2D Network Mesh
  // ========================================
  let vantaEffect = null;

  function initTopographyBackground() {
    const heroBackground = document.getElementById('hero-background');

    if (heroBackground && window.VANTA) {
      console.log('Initializing Vanta NET...');
      try {
        vantaEffect = VANTA.NET({
          el: heroBackground,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x001f3f,          // Navy lines
          backgroundColor: 0xffffff, // White background
          points: 10.00,             // Number of points
          maxDistance: 20.00,        // Connection distance
          spacing: 16.00             // Spacing between points
        });
        console.log('Vanta NET initialized successfully');
      } catch (error) {
        console.error('Vanta NET error:', error);
      }
    } else {
      console.error('Vanta or hero-background not found');
    }
  }

  // ========================================
  // Loading Screen Transition - Circular Progress
  // ========================================
  const loadingScreen = document.getElementById('loading-screen');
  const loadingCircleProgress = document.getElementById('loading-circle-progress');

  // Circle circumference: 2 * PI * radius = 2 * 3.14159 * 90 = 565.48
  const circumference = 565.48;

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress > 100) progress = 100;

    if (loadingCircleProgress) {
      // Calculate dash offset (100% = 0 offset, 0% = full circumference)
      const offset = circumference - (progress / 100) * circumference;
      loadingCircleProgress.style.strokeDashoffset = offset;
    }

    if (progress >= 100) {
      clearInterval(progressInterval);
    }
  }, 150);

  // Wait for page load
  window.addEventListener('load', () => {
    // Ensure progress reaches 100%
    if (loadingCircleProgress) {
      loadingCircleProgress.style.strokeDashoffset = 0;
    }

    // Initialize Vanta NET background before transition
    initTopographyBackground();

    // Start mask transition after brief delay
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('loaded');
      }
      clearInterval(progressInterval);
    }, 600);
  });

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
  // Cleanup on page unload
  // ========================================
  window.addEventListener('beforeunload', () => {
    if (vantaEffect) vantaEffect.destroy();
  });

  // ========================================
  // Console Easter Egg
  // ========================================
  console.log('%c🏎️ Built with inspiration from Lando Norris', 'font-size: 16px; color: #0066cc; font-weight: bold;');
  console.log('%cIsiah Udofia - Yale University 2026', 'font-size: 14px; color: #001f3f;');
  console.log('%cVanta.js NET + Seamless Loading Transition', 'font-size: 12px; color: #6c757d;');

})();
