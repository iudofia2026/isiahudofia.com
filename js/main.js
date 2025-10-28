/* ========================================
   Custom Hero Network Background + Seamless Loading
   ======================================== */

(function() {
  'use strict';

  // ========================================
  // Hero Network Background (Three.js)
  // ========================================
  class HeroNetwork {
    constructor(container) {
      this.container = container;
      this.width = container.clientWidth || window.innerWidth;
      this.height = container.clientHeight || window.innerHeight;
      this.pointCount = 90;
      this.maxLinkDistance = 45;
      this.bounds = { x: 120, y: 70, z: 120 };

      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(this.width, this.height);
      this.renderer.domElement.classList.add('hero-canvas');
      this.container.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
      this.camera.position.set(0, 0, 220);

      this.positions = new Float32Array(this.pointCount * 3);
      this.velocities = new Float32Array(this.pointCount * 3);
      this._initParticles();

      this.pointsMaterial = new THREE.PointsMaterial({
        color: 0x001f3f,
        size: 2.4,
        sizeAttenuation: true
      });

      this.pointsGeometry = new THREE.BufferGeometry();
      this.pointsGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
      this.pointsMesh = new THREE.Points(this.pointsGeometry, this.pointsMaterial);
      this.scene.add(this.pointsMesh);

      const maxSegments = this.pointCount * this.pointCount * 2;
      const lineArray = new Float32Array(maxSegments * 3);
      this.linesGeometry = new THREE.BufferGeometry();
      this.linesGeometry.setAttribute('position', new THREE.BufferAttribute(lineArray, 3));
      this.linesGeometry.setDrawRange(0, 0);
      this.linesMaterial = new THREE.LineBasicMaterial({
        color: 0x001f3f,
        transparent: true,
        opacity: 0.25
      });
      this.linesMesh = new THREE.LineSegments(this.linesGeometry, this.linesMaterial);
      this.scene.add(this.linesMesh);

      this.palettes = {
        default: {
          point: new THREE.Color(0x001f3f),
          line: new THREE.Color(0x001f3f),
          lineOpacity: 0.25,
          clearColor: 0x000000,
          clearAlpha: 0
        },
        inverted: {
          point: new THREE.Color(0xffffff),
          line: new THREE.Color(0xffffff),
          lineOpacity: 0.4,
          clearColor: 0x001f3f,
          clearAlpha: 1
        }
      };

      this.setInverted(false);

      this.labelLayer = document.createElement('div');
      this.labelLayer.className = 'hero-label-layer';
      this.labelLayer.style.width = '100%';
      this.labelLayer.style.height = '100%';
      this.container.appendChild(this.labelLayer);

      // Each entry maps a point index to a clickable label. Adjust to match your sections/links.
      this.trackedLabels = [
        { index: 8, text: 'Projects', href: '#projects' },
        { index: 21, text: 'Research', href: '#research' },
        { index: 55, text: 'Contact', href: '#contact' }
      ];
      this.labelElements = [];
      this._createLabels();

      this.tempVector = new THREE.Vector3();
      this.clock = new THREE.Clock();
      this.frameId = null;

      this.handleResize = this.handleResize.bind(this);
      this.animate = this.animate.bind(this);

      window.addEventListener('resize', this.handleResize);
      this.animate();
    }

    _initParticles() {
      for (let i = 0; i < this.pointCount; i += 1) {
        const idx = i * 3;
        this.positions[idx] = (Math.random() - 0.5) * this.bounds.x * 2;
        this.positions[idx + 1] = (Math.random() - 0.5) * this.bounds.y * 2;
        this.positions[idx + 2] = (Math.random() - 0.5) * this.bounds.z * 2;

        this.velocities[idx] = (Math.random() - 0.5) * 0.25;
        this.velocities[idx + 1] = (Math.random() - 0.5) * 0.18;
        this.velocities[idx + 2] = (Math.random() - 0.5) * 0.25;
      }
    }

    _createLabels() {
      this.trackedLabels.forEach((label) => {
        if (label.index >= this.pointCount) return;
        const element = document.createElement('a');
        element.className = 'hero-label';
        element.textContent = label.text;
        element.href = label.href || '#';
        element.setAttribute('data-index', String(label.index));
        this.labelLayer.appendChild(element);
        this.labelElements.push({ config: label, element });
      });
    }

    _updatePositions(delta) {
      for (let i = 0; i < this.pointCount; i += 1) {
        const idx = i * 3;
        this.positions[idx] += this.velocities[idx] * delta;
        this.positions[idx + 1] += this.velocities[idx + 1] * delta;
        this.positions[idx + 2] += this.velocities[idx + 2] * delta;

        const limitX = this.bounds.x;
        const limitY = this.bounds.y;
        const limitZ = this.bounds.z;

        if (this.positions[idx] > limitX || this.positions[idx] < -limitX) {
          this.velocities[idx] *= -1;
        }
        if (this.positions[idx + 1] > limitY || this.positions[idx + 1] < -limitY) {
          this.velocities[idx + 1] *= -1;
        }
        if (this.positions[idx + 2] > limitZ || this.positions[idx + 2] < -limitZ) {
          this.velocities[idx + 2] *= -1;
        }
      }

      this.pointsGeometry.attributes.position.needsUpdate = true;
    }

    _updateLines() {
      const linePositions = this.linesGeometry.attributes.position.array;
      let ptr = 0;

      for (let i = 0; i < this.pointCount; i += 1) {
        const ix = i * 3;
        for (let j = i + 1; j < this.pointCount; j += 1) {
          const jx = j * 3;
          const dx = this.positions[ix] - this.positions[jx];
          const dy = this.positions[ix + 1] - this.positions[jx + 1];
          const dz = this.positions[ix + 2] - this.positions[jx + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance <= this.maxLinkDistance && ptr + 6 <= linePositions.length) {
            linePositions[ptr] = this.positions[ix];
            linePositions[ptr + 1] = this.positions[ix + 1];
            linePositions[ptr + 2] = this.positions[ix + 2];
            linePositions[ptr + 3] = this.positions[jx];
            linePositions[ptr + 4] = this.positions[jx + 1];
            linePositions[ptr + 5] = this.positions[jx + 2];
            ptr += 6;
          }
        }
      }

      this.linesGeometry.attributes.position.needsUpdate = true;
      this.linesGeometry.setDrawRange(0, ptr / 3);
    }

    _updateLabels() {
      if (!this.labelElements.length) return;

      this.labelElements.forEach(({ config, element }) => {
        const idx = config.index * 3;
        if (idx >= this.positions.length) return;

        this.tempVector.fromArray(this.positions, idx);
        this.pointsMesh.localToWorld(this.tempVector);
        this.tempVector.project(this.camera);

        if (this.tempVector.z < -1 || this.tempVector.z > 1) {
          element.style.opacity = '0';
          return;
        }

        const x = (this.tempVector.x * 0.5 + 0.5) * this.width;
        const y = (-this.tempVector.y * 0.5 + 0.5) * this.height;

        element.style.opacity = '1';
        element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    }

    setInverted(isInverted) {
      const palette = isInverted ? this.palettes.inverted : this.palettes.default;
      this.pointsMaterial.color.copy(palette.point);
      this.linesMaterial.color.copy(palette.line);
      this.linesMaterial.opacity = palette.lineOpacity;
      this.renderer.setClearColor(palette.clearColor, palette.clearAlpha);
      this.pointsMaterial.needsUpdate = true;
      this.linesMaterial.needsUpdate = true;
      this.container.classList.toggle('hero-background--inverted', isInverted);
    }

    handleResize() {
      this.width = this.container.clientWidth || window.innerWidth;
      this.height = this.container.clientHeight || window.innerHeight;
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    }

    animate() {
      this.frameId = requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta() * 60;
      this._updatePositions(delta);
      this._updateLines();
      this._updateLabels();
      this.renderer.render(this.scene, this.camera);
    }

    destroy() {
      cancelAnimationFrame(this.frameId);
      window.removeEventListener('resize', this.handleResize);
      this.setInverted(false);
      this.renderer.dispose();
      this.pointsGeometry.dispose();
      this.linesGeometry.dispose();
      this.pointsMaterial.dispose();
      this.linesMaterial.dispose();
      if (this.renderer.domElement.parentNode === this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
      if (this.labelLayer.parentNode === this.container) {
        this.container.removeChild(this.labelLayer);
      }
    }
  }

  let heroNetwork = null;
  let heroHoverEffect = null;
  let navLogoHoverEffect = null;

  function initTopographyBackground() {
    const heroBackground = document.getElementById('hero-background');

    if (!heroBackground) {
      console.error('Hero background element not found');
      return;
    }

    if (!window.THREE) {
      console.error('Three.js is not available');
      return;
    }

    if (heroNetwork) {
      heroNetwork.destroy();
    }

    heroNetwork = new HeroNetwork(heroBackground);
  }

  function initHeroLogoDistortion() {
    const heroIcon = document.getElementById('hero-icon');
    if (!heroIcon) {
      console.error('Hero icon element not found');
      return;
    }

    const heroSection = document.querySelector('.hero-section');
    const heroBackground = document.getElementById('hero-background');

    const toggleHeroInversion = (isActive) => {
      document.body.classList.toggle('is-hero-inverted', isActive);
      if (heroSection) heroSection.classList.toggle('hero-section--inverted', isActive);
      if (heroBackground) heroBackground.classList.toggle('hero-background--inverted', isActive);
      if (heroNetwork && typeof heroNetwork.setInverted === 'function') {
        heroNetwork.setInverted(isActive);
      }
    };

    if (heroIcon.dataset.hoverHandlersAttached !== 'true') {
      const enterHandler = () => toggleHeroInversion(true);
      const leaveHandler = () => toggleHeroInversion(false);

      heroIcon.addEventListener('pointerenter', enterHandler);
      heroIcon.addEventListener('pointerleave', leaveHandler);
      heroIcon.addEventListener('pointercancel', leaveHandler);
      heroIcon.addEventListener('focusin', enterHandler);
      heroIcon.addEventListener('focusout', leaveHandler);
      window.addEventListener('blur', leaveHandler);

      heroIcon.dataset.hoverHandlersAttached = 'true';
    }

    const { imageDefault, imageHover, displacement, imagesRatio } = heroIcon.dataset;
    const fallbackSrc = imageDefault || 'assets/hero-icon.png';

    const supportsHover = window.matchMedia('(hover: hover)').matches && window.matchMedia('(pointer: fine)').matches;

    // Create fallback function to ensure logo always displays
    const createFallbackImage = () => {
      if (!heroIcon.querySelector('img') && !heroIcon.querySelector('canvas')) {
        const fallbackImg = document.createElement('img');
        fallbackImg.src = fallbackSrc;
        fallbackImg.alt = 'Isiah Udofia';
        fallbackImg.className = 'hero-icon-fallback';
        heroIcon.appendChild(fallbackImg);
      }
      heroIcon.classList.add('distortion-fallback');
    };

    // Check if hoverEffect library is available
    const hasHoverEffect = typeof window.hoverEffect === 'function';
    console.log('hoverEffect available:', hasHoverEffect, 'supportsHover:', supportsHover);

    if (!hasHoverEffect || !supportsHover) {
      console.log('Using fallback image (hoverEffect unavailable or no hover support)');
      createFallbackImage();
      return;
    }

    if (heroHoverEffect) {
      return;
    }

    try {
      heroHoverEffect = new window.hoverEffect({
        parent: heroIcon,
        hover: true,
        intensity: 0.45,
        speedIn: 1.1,
        speedOut: 1.05,
        easing: 'easeOutQuad',
        image1: fallbackSrc,
        image2: imageHover || 'assets/logo-hover.png',
        displacementImage: displacement || 'assets/hero-displacement.png',
        imagesRatio: imagesRatio ? parseFloat(imagesRatio) : 1
      });

      console.log('Hero hover effect initialized successfully');
      heroIcon.classList.add('distortion-ready');
    } catch (error) {
      console.error('Hero distortion effect failed, using fallback:', error);
      createFallbackImage();
    }
  }

  function initNavLogoDistortion() {
    const navLogo = document.getElementById('nav-logo');
    if (!navLogo) {
      console.error('Nav logo element not found');
      return;
    }

    const { imageDefault, imageHover, displacement, imagesRatio } = navLogo.dataset;
    const fallbackSrc = imageDefault || 'assets/logo.png';

    const supportsHover = window.matchMedia('(hover: hover)').matches && window.matchMedia('(pointer: fine)').matches;

    // Create fallback function to ensure nav logo always displays
    const createFallbackImage = () => {
      if (!navLogo.querySelector('img') && !navLogo.querySelector('canvas')) {
        const fallbackImg = document.createElement('img');
        fallbackImg.src = fallbackSrc;
        fallbackImg.alt = 'Isiah Udofia';
        fallbackImg.className = 'nav-logo-fallback';
        navLogo.appendChild(fallbackImg);
      }
      navLogo.classList.add('distortion-fallback');
    };

    // Check if hoverEffect library is available
    const hasHoverEffect = typeof window.hoverEffect === 'function';
    console.log('Nav logo - hoverEffect available:', hasHoverEffect, 'supportsHover:', supportsHover);

    if (!hasHoverEffect || !supportsHover) {
      console.log('Using fallback image for nav logo (hoverEffect unavailable or no hover support)');
      createFallbackImage();
      return;
    }

    if (navLogoHoverEffect) {
      return;
    }

    try {
      navLogoHoverEffect = new window.hoverEffect({
        parent: navLogo,
        hover: true,
        intensity: 0.45,
        speedIn: 1.1,
        speedOut: 1.05,
        easing: 'easeOutQuad',
        image1: fallbackSrc,
        image2: imageHover || 'assets/logo-nav-hover.png',
        displacementImage: displacement || 'assets/hero-displacement.png',
        imagesRatio: imagesRatio ? parseFloat(imagesRatio) : 1
      });

      console.log('Nav logo hover effect initialized successfully');
      navLogo.classList.add('distortion-ready');
    } catch (error) {
      console.error('Nav logo distortion effect failed, using fallback:', error);
      createFallbackImage();
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

  // Function to complete loading screen transition
  let transitionCompleted = false;
  function completeLoadingTransition() {
    if (transitionCompleted) return;
    transitionCompleted = true;

    // Ensure progress reaches 100%
    if (loadingCircleProgress) {
      loadingCircleProgress.style.strokeDashoffset = 0;
    }

    // Initialize Three.js hero background before transition
    try {
      initTopographyBackground();
      initHeroLogoDistortion();
      initNavLogoDistortion();
    } catch (error) {
      console.warn('Hero initialization failed:', error);
    }

    // Start mask transition after brief delay
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('loaded');
      }
      clearInterval(progressInterval);
    }, 600);
  }

  // Wait for page load
  window.addEventListener('load', completeLoadingTransition);

  // Failsafe: Force loading screen to complete after 5 seconds maximum
  setTimeout(() => {
    if (loadingScreen && !loadingScreen.classList.contains('loaded')) {
      console.warn('Loading timeout reached, forcing transition');
      completeLoadingTransition();
    }
  }, 5000);

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
    if (heroNetwork) heroNetwork.destroy();
  });

  // ========================================
  // Console Easter Egg
  // ========================================
  console.log('%c🏎️ Built with inspiration from Lando Norris', 'font-size: 16px; color: #0066cc; font-weight: bold;');
  console.log('%cIsiah Udofia - Yale University 2026', 'font-size: 14px; color: #001f3f;');
  console.log('%cCustom Three.js hero network + Seamless Loading Transition', 'font-size: 12px; color: #6c757d;');

})();

