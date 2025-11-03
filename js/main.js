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

      // Mobile detection
      this.isMobile = window.innerWidth <= 768;
      this.isSmallMobile = window.innerWidth <= 480;

      // Adaptive particle count for performance
      this.pointCount = this.isSmallMobile ? 80 : (this.isMobile ? 120 : 250);
      this.maxLinkDistance = this.isMobile ? 50 : 60;
      this.bounds = this.isMobile ? { x: 120, y: 100, z: 120 } : { x: 200, y: 120, z: 200 };

      // Optimize renderer for mobile
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !this.isMobile, // Disable antialiasing on mobile for performance
        powerPreference: this.isMobile ? 'low-power' : 'default'
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
      this.renderer.setSize(this.width, this.height);
      this.renderer.domElement.classList.add('hero-canvas');
      this.container.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();

      // Adjust camera FOV and position for mobile
      const fov = this.isMobile ? 50 : 45; // Slightly wider FOV on mobile
      const cameraZ = this.isMobile ? 180 : 220; // Closer camera on mobile for better fill
      this.camera = new THREE.PerspectiveCamera(fov, this.width / this.height, 0.1, 1000);
      this.camera.position.set(0, 0, cameraZ);

      this.positions = new Float32Array(this.pointCount * 3);
      this.velocities = new Float32Array(this.pointCount * 3);
      this._initParticles();

      // Smaller particle size on mobile
      this.pointsMaterial = new THREE.PointsMaterial({
        color: 0x001f3f,
        size: this.isMobile ? 2.0 : 2.4,
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

      // Append to hero-section instead of hero-background for higher z-index
      const heroSection = this.container.closest('.hero-section');
      if (heroSection) {
        heroSection.appendChild(this.labelLayer);
      } else {
        this.container.appendChild(this.labelLayer);
      }

      // Each entry maps a point index to a clickable label. Adjust to match your sections/links.
      this.trackedLabels = [
        { index: 8, text: 'projects', href: '#projects', section: 'projects' },
        { index: 21, text: 'research', href: '#research', section: 'research' },
        { index: 55, text: 'contact', href: '#contact', section: 'contact' }
      ];
      this.labelElements = [];
      this._createLabels();

      // Create set of labeled indices for reduced mouse reactivity
      this.labeledIndices = new Set(this.trackedLabels.map(label => label.index));

      this.tempVector = new THREE.Vector3();
      this.clock = new THREE.Clock();
      this.frameId = null;

      // Mouse/Touch interaction - optimized for mobile
      this.mouse = { x: 0, y: 0, isInside: false };
      this.mouseInfluenceRadius = this.isMobile ? 60 : 80;
      this.mouseForce = this.isMobile ? 0.15 : 0.3; // Reduced force on mobile for stability

      // Orbital settings
      this.centerPoint = { x: 0, y: 0, z: 0 }; // Center of rotation
      this.orbitalForce = 0.000002; // Gentle tangential drift
      this.rotationSpeed = 0.0008; // Radians per second, counterclockwise

      // Random movement - smooth continuous forces
      this.randomMovementStrength = 0.005; // Gentle continuous random force
      this.randomMovementFrequency = 1.0; // Apply every frame for smoothness

      // Page visibility handling
      this.isPageVisible = !document.hidden;
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);

      this.handleResize = this.handleResize.bind(this);
      this.animate = this.animate.bind(this);
      this.handleMouseMove = this.handleMouseMove.bind(this);
      this.handleMouseEnter = this.handleMouseEnter.bind(this);
      this.handleMouseLeave = this.handleMouseLeave.bind(this);

      window.addEventListener('resize', this.handleResize);

      // Add touch support for mobile
      if (this.isMobile) {
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: true });
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
      } else {
        this.container.addEventListener('mousemove', this.handleMouseMove);
        this.container.addEventListener('mouseenter', this.handleMouseEnter);
        this.container.addEventListener('mouseleave', this.handleMouseLeave);
      }

      document.addEventListener('visibilitychange', this.handleVisibilityChange);
      this.animate();
    }

    handleVisibilityChange() {
      this.isPageVisible = !document.hidden;

      if (this.isPageVisible) {
        // Reset clock delta to prevent large time jumps
        this.clock.getDelta();
      }
    }

    handleMouseMove(event) {
      const rect = this.container.getBoundingClientRect();
      // Convert mouse position to normalized device coordinates (-1 to +1)
      this.mouse.x = ((event.clientX - rect.left) / this.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / this.height) * 2 + 1;
    }

    handleMouseEnter() {
      this.mouse.isInside = true;
    }

    handleMouseLeave() {
      this.mouse.isInside = false;
    }

    handleTouchMove(event) {
      if (!event.touches || event.touches.length === 0) return;
      const touch = event.touches[0];
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((touch.clientX - rect.left) / this.width) * 2 - 1;
      this.mouse.y = -((touch.clientY - rect.top) / this.height) * 2 + 1;
      this.mouse.isInside = true;
    }

    handleTouchStart(event) {
      if (!event.touches || event.touches.length === 0) return;
      const touch = event.touches[0];
      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((touch.clientX - rect.left) / this.width) * 2 - 1;
      this.mouse.y = -((touch.clientY - rect.top) / this.height) * 2 + 1;
      this.mouse.isInside = true;
    }

    handleTouchEnd() {
      this.mouse.isInside = false;
    }

    _initParticles() {
      // Create concentric spheres around the center point
      const centerRadius = 120; // Base radius from center (increased)
      const radiusVariation = 80; // Variation in radius (increased)
      const numLayers = 4; // Number of concentric layers
      
      // Special radius for tracked labels (closer to center)
      const labelRadius = 60; // Fixed radius for contact, research, projects
      const trackedLabelIndices = [8, 21, 55]; // Indices for tracked labels
      
      // Pre-calculate evenly spaced positions for tracked labels
      const labelPositions = [];
      for (let i = 0; i < trackedLabelIndices.length; i++) {
        const angle = (i / trackedLabelIndices.length) * Math.PI * 2; // Evenly spaced around circle
        const phi = Math.PI / 2; // Keep them at same height level
        labelPositions.push({
          x: labelRadius * Math.sin(phi) * Math.cos(angle),
          y: labelRadius * Math.sin(phi) * Math.sin(angle),
          z: labelRadius * Math.cos(phi)
        });
      }
      
      for (let i = 0; i < this.pointCount; i += 1) {
        const idx = i * 3;
        
        let x, y, z;
        
        // Check if this is a tracked label node
        if (trackedLabelIndices.includes(i)) {
          // Use pre-calculated evenly spaced position
          const labelIndex = trackedLabelIndices.indexOf(i);
          const pos = labelPositions[labelIndex];
          x = pos.x;
          y = pos.y;
          z = pos.z;
        } else {
          let radius;
          // Create balanced density across all regions
          const randomValue = Math.random();
          
          if (randomValue < 0.2) {
            // 20% of nodes in close region (60-100px)
            radius = 60 + Math.random() * 40;
          } else if (randomValue < 0.5) {
            // 30% of nodes in mid region (100-140px)
            radius = 100 + Math.random() * 40;
          } else {
            // 50% of nodes in far region (140-200px)
            radius = 140 + Math.random() * 60;
          }
          
          // Generate random spherical coordinates
          const theta = Math.random() * Math.PI * 2; // Azimuth angle (0 to 2?)
          const phi = Math.random() * Math.PI; // Polar angle (0 to ?)
          
          // Convert to Cartesian coordinates
          x = radius * Math.sin(phi) * Math.cos(theta);
          y = radius * Math.sin(phi) * Math.sin(theta);
          z = radius * Math.cos(phi);
        }
        
        this.positions[idx] = x;
        this.positions[idx + 1] = y;
        this.positions[idx + 2] = z;

        // Create varied velocities for natural movement
        this.velocities[idx] = (Math.random() - 0.5) * 0.4;
        this.velocities[idx + 1] = (Math.random() - 0.5) * 0.3;
        this.velocities[idx + 2] = (Math.random() - 0.5) * 0.4;
      }
    }

    _createLabels() {
      console.log('Creating hero labels:', this.trackedLabels);
      this.trackedLabels.forEach((label) => {
        if (label.index >= this.pointCount) return;
        const element = document.createElement('a');
        element.className = 'hero-label';
        element.textContent = label.text;
        element.href = label.href || '#';
        element.setAttribute('data-index', String(label.index));
        this.labelLayer.appendChild(element);
        this.labelElements.push({ config: label, element });
        console.log('Created label:', label.text, 'at index:', label.index);
      });
    }

    _updatePositions(delta) {
      // Cap delta to prevent huge jumps when returning to page
      const cappedDelta = Math.min(delta, 3);

      // Convert mouse position from NDC to world space for interaction
      let mouseWorldX = 0;
      let mouseWorldY = 0;
      if (this.mouse.isInside) {
        mouseWorldX = this.mouse.x * (this.bounds.x * 1.5);
        mouseWorldY = this.mouse.y * (this.bounds.y * 1.5);
      }

      for (let i = 0; i < this.pointCount; i += 1) {
        const idx = i * 3;

        // Calculate distance from center point
        const dx = this.positions[idx] - this.centerPoint.x;
        const dy = this.positions[idx + 1] - this.centerPoint.y;

        // Apply orbital/tangential force for rotation (no inward gravity)
        // Create perpendicular vector for orbital motion (simplified 2D rotation in XY plane)
        if (this.orbitalForce > 0) {
          const orbitalX = -dy;
          const orbitalY = dx;
          const orbitalLength = Math.sqrt(orbitalX * orbitalX + orbitalY * orbitalY);

          if (orbitalLength > 0) {
            this.velocities[idx] += (orbitalX / orbitalLength) * this.orbitalForce;
            this.velocities[idx + 1] += (orbitalY / orbitalLength) * this.orbitalForce;
          }
        }

        // Apply random movement for more natural, organic motion
        if (Math.random() < this.randomMovementFrequency) {
          this.velocities[idx] += (Math.random() - 0.5) * this.randomMovementStrength;
          this.velocities[idx + 1] += (Math.random() - 0.5) * this.randomMovementStrength;
          this.velocities[idx + 2] += (Math.random() - 0.5) * this.randomMovementStrength;
        }

        // Apply damping to prevent excessive speeds
        const damping = 0.98;
        this.velocities[idx] *= damping;
        this.velocities[idx + 1] *= damping;
        this.velocities[idx + 2] *= damping;

        // Apply mouse interaction force (reduced for labeled nodes)
        if (this.mouse.isInside) {
          const mouseDx = this.positions[idx] - mouseWorldX;
          const mouseDy = this.positions[idx + 1] - mouseWorldY;
          const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

          if (mouseDistance < this.mouseInfluenceRadius && mouseDistance > 0) {
            // Reduce mouse force for nodes with labels to make them easier to click
            const isLabeled = this.labeledIndices.has(i);
            const forcMultiplier = isLabeled ? 0.15 : 1.0; // 85% reduction for labeled nodes
            const force = (1 - mouseDistance / this.mouseInfluenceRadius) * this.mouseForce * forcMultiplier;
            this.positions[idx] += (mouseDx / mouseDistance) * force * cappedDelta;
            this.positions[idx + 1] += (mouseDy / mouseDistance) * force * cappedDelta;
          }
        }

        this.positions[idx] += this.velocities[idx] * cappedDelta;
        this.positions[idx + 1] += this.velocities[idx + 1] * cappedDelta;
        this.positions[idx + 2] += this.velocities[idx + 2] * cappedDelta;

        if (this.rotationSpeed) {
          const angle = this.rotationSpeed * cappedDelta;
          if (angle !== 0) {
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);

            const relX = this.positions[idx] - this.centerPoint.x;
            const relY = this.positions[idx + 1] - this.centerPoint.y;

            const rotatedX = relX * cos - relY * sin;
            const rotatedY = relX * sin + relY * cos;

            this.positions[idx] = rotatedX + this.centerPoint.x;
            this.positions[idx + 1] = rotatedY + this.centerPoint.y;

            const velX = this.velocities[idx];
            const velY = this.velocities[idx + 1];

            this.velocities[idx] = velX * cos - velY * sin;
            this.velocities[idx + 1] = velX * sin + velY * cos;
          }
        }

        const limitX = this.bounds.x;
        const limitY = this.bounds.y;
        const limitZ = this.bounds.z;

        // Reverse velocity and clamp position when hitting boundaries
        if (this.positions[idx] > limitX) {
          this.positions[idx] = limitX;
          this.velocities[idx] *= -1;
        } else if (this.positions[idx] < -limitX) {
          this.positions[idx] = -limitX;
          this.velocities[idx] *= -1;
        }

        if (this.positions[idx + 1] > limitY) {
          this.positions[idx + 1] = limitY;
          this.velocities[idx + 1] *= -1;
        } else if (this.positions[idx + 1] < -limitY) {
          this.positions[idx + 1] = -limitY;
          this.velocities[idx + 1] *= -1;
        }

        if (this.positions[idx + 2] > limitZ) {
          this.positions[idx + 2] = limitZ;
          this.velocities[idx + 2] *= -1;
        } else if (this.positions[idx + 2] < -limitZ) {
          this.positions[idx + 2] = -limitZ;
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
      if (!this.labelElements.length) {
        console.log('No label elements to update');
        return;
      }

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

        // Calculate projected position
        let x = (this.tempVector.x * 0.5 + 0.5) * this.width;
        let y = (-this.tempVector.y * 0.5 + 0.5) * this.height;

        // Get label dimensions (with fallback if not yet rendered) - optimized sizing
        const labelWidth = element.offsetWidth || (this.isMobile ? 110 : 130);
        const labelHeight = element.offsetHeight || (this.isMobile ? 48 : 40);

        // Increased padding on mobile for better visibility
        const padding = this.isMobile ? 18 : 14;

        // Clamp position to keep label within viewport bounds
        x = Math.max(padding, Math.min(x, this.width - labelWidth - padding));
        y = Math.max(padding, Math.min(y, this.height - labelHeight - padding));

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

    triggerRipple(centerX = 0, centerY = 0, strength = 15) {
      // Create a ripple effect emanating from a center point
      for (let i = 0; i < this.pointCount; i += 1) {
        const idx = i * 3;

        const dx = this.positions[idx] - centerX;
        const dy = this.positions[idx + 1] - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          // Push particles outward based on distance (inverse relationship)
          const force = strength / Math.max(distance, 5);
          this.velocities[idx] += (dx / distance) * force;
          this.velocities[idx + 1] += (dy / distance) * force;
        }
      }
    }

    handleResize() {
      this.width = this.container.clientWidth || window.innerWidth;
      this.height = this.container.clientHeight || window.innerHeight;

      // Update mobile detection on resize
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;
      this.isSmallMobile = window.innerWidth <= 480;

      // If device type changed, update renderer settings
      if (wasMobile !== this.isMobile) {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
        this.mouseInfluenceRadius = this.isMobile ? 60 : 80;
        this.mouseForce = this.isMobile ? 0.15 : 0.3;
      }

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
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
      this.container.removeEventListener('mousemove', this.handleMouseMove);
      this.container.removeEventListener('mouseenter', this.handleMouseEnter);
      this.container.removeEventListener('mouseleave', this.handleMouseLeave);
      this.setInverted(false);
      this.renderer.dispose();
      this.pointsGeometry.dispose();
      this.linesGeometry.dispose();
      this.pointsMaterial.dispose();
      this.linesMaterial.dispose();
      if (this.renderer.domElement.parentNode === this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
      if (this.labelLayer && this.labelLayer.parentNode) {
        this.labelLayer.parentNode.removeChild(this.labelLayer);
      }
    }
  }

  let heroNetwork = null;

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
    window.heroNetwork = heroNetwork; // Make globally accessible for ripple trigger
  }

  function initSyncedLogoHover() {
    const heroIcon = document.getElementById('hero-icon');
    const navLogoWrapper = document.querySelector('.nav-logo-wrapper');

    if (!heroIcon || !navLogoWrapper) {
      return;
    }

    const heroSection = document.querySelector('.hero-section');
    const heroBackground = document.getElementById('hero-background');

    // Toggle background inversion AND synchronized logo hover states
    const toggleHoverState = (isActive) => {
      // Toggle background inversion
      document.body.classList.toggle('is-hero-inverted', isActive);
      if (heroSection) heroSection.classList.toggle('hero-section--inverted', isActive);
      if (heroBackground) heroBackground.classList.toggle('hero-background--inverted', isActive);
      if (heroNetwork && typeof heroNetwork.setInverted === 'function') {
        heroNetwork.setInverted(isActive);
      }

      // Toggle synchronized hover class on both logos
      heroIcon.classList.toggle('synced-hover', isActive);
      navLogoWrapper.classList.toggle('synced-hover', isActive);
    };

    const enterHandler = () => toggleHoverState(true);
    const leaveHandler = () => toggleHoverState(false);

    // Add event listeners to hero logo
    heroIcon.addEventListener('pointerenter', enterHandler);
    heroIcon.addEventListener('pointerleave', leaveHandler);
    heroIcon.addEventListener('pointercancel', leaveHandler);
    heroIcon.addEventListener('focusin', enterHandler);
    heroIcon.addEventListener('focusout', leaveHandler);

    // Add event listeners to nav logo
    navLogoWrapper.addEventListener('pointerenter', enterHandler);
    navLogoWrapper.addEventListener('pointerleave', leaveHandler);
    navLogoWrapper.addEventListener('pointercancel', leaveHandler);

    window.addEventListener('blur', leaveHandler);
  }

  // ========================================
  // Loading Screen Transition - GSAP Wipe Effect
  // ========================================
  const loadingScreen = document.getElementById('loading-screen');
  const loadingCircleProgress = document.getElementById('loading-circle-progress');
  const loadingLogoContainer = document.querySelector('.loading-logo-container');
  const loadingCircle = document.querySelector('.loading-circle');

  const circleAnimation = window.gsap && loadingCircleProgress
    ? gsap.to(loadingCircleProgress, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: "power2.inOut",
        paused: true
      })
    : null;

  // Function to complete loading screen transition
  let transitionCompleted = false;
  function completeLoadingTransition() {
    if (transitionCompleted) return;
    transitionCompleted = true;

    // Initialize Three.js hero background before transition
    try {
      initTopographyBackground();
      initSyncedLogoHover();
    } catch (error) {
      console.warn('Hero initialization failed:', error);
    }

    // Get hero logo position for seamless transition
    const heroIconWrapper = document.querySelector('.hero-icon-wrapper');
    const loadingLogo = document.querySelector('.loading-logo');

    const startMainTransition = () => {
      if (window.gsap) {
        const tl = gsap.timeline({
          onComplete: () => {
            loadingScreen.style.display = 'none';
          }
        });

        if (!circleAnimation && loadingCircleProgress) {
          tl.to(loadingCircleProgress, {
            strokeDashoffset: 0,
            duration: 2.5,
            ease: "power2.inOut"
          });
        }

        if (heroIconWrapper && loadingLogo) {
          const loadingLogoRect = loadingLogo.getBoundingClientRect();
          const heroRect = heroIconWrapper.getBoundingClientRect();
          const deltaX = heroRect.left + (heroRect.width / 2) - (loadingLogoRect.left + (loadingLogoRect.width / 2));
          const deltaY = heroRect.top + (heroRect.height / 2) - (loadingLogoRect.top + (loadingLogoRect.height / 2));
          const scaleRatio = heroRect.width / loadingLogoRect.width;

          tl.to(loadingLogo, {
            x: deltaX,
            y: deltaY,
            scale: scaleRatio,
            duration: 0.9,
            ease: "power3.inOut"
          })
          .to(loadingScreen, {
            backgroundColor: "rgba(255, 255, 255, 0)",
            duration: 0.4,
            ease: "power2.out"
          }, "-=0.4")
          .add(() => {
            if (window.heroNetwork && typeof window.heroNetwork.triggerRipple === 'function') {
              window.heroNetwork.triggerRipple(0, 0, 12);
            }
          }, "-=0.4")
          .add(() => {
            document.body.classList.add('page-loaded');
          }, "+=0.2");
        } else {
          tl.to(loadingScreen, {
            backgroundColor: "rgba(255, 255, 255, 0)",
            duration: 0.4,
            ease: "power2.out"
          })
          .add(() => {
            document.body.classList.add('page-loaded');
          });
        }
      } else {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          document.body.classList.add('page-loaded');
        }, 500);
      }
    };

    const fadeCircleThenStart = () => {
      if (window.gsap && loadingCircle) {
        gsap.to(loadingCircle, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
          onComplete: startMainTransition
        });
      } else {
        startMainTransition();
      }
    };

    if (circleAnimation) {
      circleAnimation.eventCallback('onComplete', fadeCircleThenStart);
      circleAnimation.play();
    } else {
      fadeCircleThenStart();
    }
  }

  window.addEventListener('load', completeLoadingTransition);

  // Failsafe: Force loading screen to complete after 5 seconds maximum
  setTimeout(() => {
    if (loadingScreen && loadingScreen.style.display !== 'none') {
      console.warn('Loading timeout reached, forcing transition');
      completeLoadingTransition();
    }
  }, 5000);

  // ========================================
  // Smooth Scrolling with Lenis
  // ========================================
  const isMobileDevice = window.innerWidth <= 768;

  const lenis = new Lenis({
    duration: isMobileDevice ? 1.0 : 1.2, // Faster on mobile
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: isMobileDevice, // Enable smooth touch scrolling on mobile
    touchMultiplier: isMobileDevice ? 1.5 : 2, // Adjusted for better mobile feel
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  let toggleMenuHandler = null;

  // Anchor link smooth scroll & overlay routing for #projects/#research/#contact
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const overlayMap = { '#projects': 'section-projects', '#research': 'section-research', '#contact': 'section-contact' };
      if (overlayMap[href]) {
        e.preventDefault();
        showOverlayById(overlayMap[href]);
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          if (typeof toggleMenuHandler === 'function') {
            toggleMenuHandler(false);
          } else {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            try { if (lenis) lenis.stop(); } catch (e2) {}
          }
        }
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        lenis.scrollTo(target, { offset: -100, duration: 1.5 });
        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu');
        const hamburger = document.querySelector('.hamburger-menu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          if (typeof toggleMenuHandler === 'function') {
            toggleMenuHandler(false);
          } else {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('menu-open');
            try { if (lenis) lenis.start(); } catch (e3) {}
          }
        }
      }
    });
  });

  // ========================================
  // Navigation Theme Switching
  // ========================================
  const nav = document.querySelector('.main-nav');
  const sections = document.querySelectorAll('section[data-nav-theme]');

  // Initialize nav theme from body (fallback for pages without sections)
  const bodyTheme = document.body.getAttribute('data-nav-theme');
  if (bodyTheme && nav && sections.length === 0) {
    nav.setAttribute('data-nav-theme', bodyTheme);
  }

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '-100px 0px -50% 0px'
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const theme = entry.target.dataset.navTheme;
        if (nav) {
          nav.setAttribute('data-nav-theme', theme);
        }
      }
    });
  }, observerOptions);

  // Only observe sections if they exist (for SPA pages)
  if (sections.length > 0) {
    sections.forEach(section => navObserver.observe(section));
  }

  // Add scrolled class to nav (bidirectional)
  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ========================================
  // SPA Overlay Routing
  // ========================================
  const routeToOverlayId = (path) => {
    if (/\/projects(\.html)?$/i.test(path)) return 'section-projects';
    if (/\/research(\.html)?$/i.test(path)) return 'section-research';
    if (/\/contact(\.html)?$/i.test(path)) return 'section-contact';
    return null;
  };

  const sectionFromOverlayId = (overlayId) => overlayId ? overlayId.replace('section-', '') : null;

  // Scroll lock helpers (locks at current/highest scroll position)
  function lockScrollAtCurrentPosition() {
    try {
      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
      const highestSoFar = parseInt(document.body.dataset.lockMaxScrollY || '0', 10) || 0;
      const lockY = Math.max(currentScroll, highestSoFar);
      document.body.dataset.lockMaxScrollY = String(lockY);
      document.body.dataset.lockScrollY = String(lockY);
      document.body.style.top = `-${lockY}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100%';
    } catch (_) {}
  }

  function unlockScrollToLockedPosition() {
    try {
      const prev = parseInt(document.body.dataset.lockScrollY || '0', 10) || 0;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      delete document.body.dataset.lockScrollY;
      window.scrollTo(0, prev);
    } catch (_) {}
  }

  function addScrollTrap() {
    try {
      const y = parseInt(document.body.dataset.lockScrollY || '0', 10) || (window.scrollY|0);
      window.__scrollTrapHandler = (e) => {
        if (window.scrollY !== y) {
          window.scrollTo(0, y);
        }
      };
      window.addEventListener('scroll', window.__scrollTrapHandler, { passive: true });
    } catch (_) {}
  }

  function removeScrollTrap() {
    try {
      if (window.__scrollTrapHandler) {
        window.removeEventListener('scroll', window.__scrollTrapHandler, { passive: true });
        delete window.__scrollTrapHandler;
      }
    } catch (_) {}
  }

  // Fully restore homepage smooth experience (Lenis + hero layers)
  function restoreHomeExperience() {
    try {
      // Hide any visible overlays immediately
      document.querySelectorAll('.section-overlay').forEach(o => {
        o.style.display = 'none';
        o.style.opacity = '0';
      });

      // Remove overlay flags
      document.documentElement.classList.remove('overlay-active');
      document.body.classList.remove('overlay-active');

      // Unlock scroll and remove traps/blockers
      try { unlockScrollToLockedPosition(); } catch (_) {}
      removeScrollTrap();

      // Reset body/document styles in case of manual locks
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      delete document.body.dataset.lockScrollY;
      delete document.body.dataset.lockMaxScrollY;

      // Unmute hero layers
      const heroContent = document.querySelector('.hero-content');
      const labelLayer = document.querySelector('.hero-label-layer');
      if (heroContent) {
        heroContent.style.opacity = '';
        heroContent.style.pointerEvents = '';
      }
      if (labelLayer) {
        labelLayer.style.opacity = '';
        labelLayer.style.pointerEvents = '';
      }

      // Ensure nav visible again
      const navEl = document.querySelector('.main-nav');
      if (navEl) {
        navEl.style.display = '';
        navEl.style.opacity = '';
      }

      // Restart Lenis smoothness and ensure RAF loop is running
      try {
        if (lenis) {
          lenis.start();
        }
      } catch (_) {}

      // Refresh ScrollTrigger to restore scroll-based animations
      try {
        if (window.ScrollTrigger && typeof ScrollTrigger.refresh === 'function') {
          ScrollTrigger.refresh();
        }
      } catch (_) {}
    } catch (_) {}
  }

  const showOverlayById = (overlayId) => {
    const overlay = document.getElementById(overlayId);
    if (!overlay) return;
    
    // New simple lock: add overlay-active flag and stop lenis
    document.documentElement.classList.add('overlay-active');
    document.body.classList.add('overlay-active');
    try { if (lenis) lenis.stop(); } catch (e) {}
    
    // Lock scroll at current position
    lockScrollAtCurrentPosition();
    addScrollTrap();
    
    // Use TransitionController for camera + hero icon + labels when available
    let cameraAnimationDelay = 0;
    try {
      if (window.transitionController && typeof window.transitionController.findNodeIndexBySection === 'function') {
        const section = sectionFromOverlayId(overlayId);
        const idx = window.transitionController.findNodeIndexBySection(section);
        if (idx !== null) {
          // Let navigateToSection handle hero icon, labels, and camera
          // Camera animation takes ~1.4s, overlay should fade in partway through
          window.transitionController.navigateToSection(section, idx);
          cameraAnimationDelay = 0.6; // Start overlay fade-in mid-camera animation
        }
      }
    } catch (e) {}
    
    // Show overlay with smooth fade-in, coordinated with camera animation
    overlay.style.display = 'flex';
    gsap.fromTo(overlay, 
      { opacity: 0 },
      { 
        opacity: 1, 
        duration: 0.6,
        delay: cameraAnimationDelay,
        ease: 'power2.out'
      }
    );
  };

  const hideAllOverlays = (animate = true) => {
    const overlays = document.querySelectorAll('.section-overlay');
    if (animate && overlays.length > 0) {
      // Smooth fade-out animation
      overlays.forEach(o => {
        if (o.style.opacity !== '0' && o.style.display !== 'none') {
          gsap.to(o, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
              o.style.display = 'none';
            }
          });
        } else {
          o.style.display = 'none';
          o.style.opacity = '0';
        }
      });
    } else {
      overlays.forEach(o => {
        o.style.display = 'none';
        o.style.opacity = '0';
      });
    }
    
    restoreHomeExperience();
  };

  // Hash-based overlay routing (e.g., http://localhost:3001/#research)
  const hashToOverlayId = (hash) => {
    if (hash === '#projects') return 'section-projects';
    if (hash === '#research') return 'section-research';
    if (hash === '#contact') return 'section-contact';
    return null;
  };

  const handleHashRoute = () => {
    const overlayId = hashToOverlayId(window.location.hash);
    if (overlayId) {
      showOverlayById(overlayId);
    } else {
      // No overlay target: fully restore homepage state
      restoreHomeExperience();
    }
  };

  // Apply on load and on hash changes
  handleHashRoute();
  window.addEventListener('hashchange', handleHashRoute);

  // Nav brand logo: always return to clean homepage root
  const navBrandLink = document.querySelector('.nav-brand');
  if (navBrandLink) {
    navBrandLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Clear hash and navigate to root
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', '/');
      } else {
        window.location.href = '/';
        return;
      }
      // Restore homepage experience immediately
      restoreHomeExperience();
    });
  }

  // Delegate back-rail to return home with smooth reverse transition
  document.addEventListener('click', (e) => {
    const target = e.target.closest('.back-rail');
    if (target) {
      e.preventDefault();
      // Smooth reverse transition via TransitionController if available
      let returnDuration = 1200;
      try {
        if (window.transitionController && typeof window.transitionController.returnHome === 'function') {
          returnDuration = window.transitionController.timing?.returnHome || 1200;
          // Hide overlay early, let camera animate over it
          const overlays = document.querySelectorAll('.section-overlay');
          overlays.forEach(o => {
            if (o.style.opacity !== '0' && o.style.display !== 'none') {
              gsap.to(o, {
                opacity: 0,
                duration: 0.5,
                delay: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                  o.style.display = 'none';
                }
              });
            }
          });
          // Start return animation
          window.transitionController.returnHome();
        } else {
          // Fallback: hide immediately if no controller
          hideAllOverlays(true);
        }
      } catch (e2) {
        hideAllOverlays(true);
      }

      // Final cleanup after return animation completes
      if (window.transitionController) {
        setTimeout(() => {
          restoreHomeExperience();
        }, returnDuration + 100);
      }
      // Normalize URL without reload (remove hash or path overlays)
      const hasPathOverlay = !!routeToOverlayId(window.location.pathname);
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', hasPathOverlay ? '/' : window.location.pathname.replace(/#.*/, ''));
      } else {
        window.location.hash = '';
      }
      // Trigger hashchange handler to clean up state
      setTimeout(() => {
        handleHashRoute();
      }, returnDuration + 100);
    }
  });

  // ========================================
  // Hamburger Menu
  // ========================================
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    const toggleMenu = (forceState) => {
      const isOpen = typeof forceState === 'boolean'
        ? forceState
        : !hamburger.classList.contains('active');

      hamburger.classList.toggle('active', isOpen);
      mobileMenu.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);

      if (isOpen) {
        lenis.stop();
        // Ensure split text is applied to menu items when menu opens
        ensureMenuSplitText();
      } else {
        lenis.start();
      }

      return isOpen;
    };

    toggleMenuHandler = toggleMenu;

    hamburger.addEventListener('click', () => {
      toggleMenu();
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        toggleMenu(false);
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  }

  // ========================================
  // Split Text Animation
  // ========================================
  const splitTargets = Array.from(document.querySelectorAll('[data-split]'));

  splitTargets.forEach((element, index) => {
    if (!element) return;
    
    // Skip menu items - they'll be handled when menu opens
    if (element.dataset.split === 'menu') {
      return;
    }
    
    prepareSplitText(element, index);
  });

  const splitObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('animated');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.45
  });

  splitTargets.forEach(element => {
    if (!element) return;
    
    if (element.dataset.split === 'menu') {
      // Menu items are handled separately - no intersection observer needed
      return;
    }
    
    splitObserver.observe(element);
  });

  function prepareSplitText(element, elementIndex = 0) {
    if (!element || element.dataset.splitReady === 'true') return;

    const originalText = element.textContent.trim();
    if (!originalText.length) return;

    element.dataset.splitReady = 'true';
    element.classList.add('split-text');
    element.setAttribute('aria-label', originalText);
    element.setAttribute('data-text', originalText);

    const words = originalText.split(/\s+/);
    element.textContent = '';

    const context = element.dataset.split || 'default';
    const baseDelay = Number(element.dataset.splitDelay) || elementIndex * 0.08;
    const charStep = Number(element.dataset.splitStep) || (context === 'menu' ? 0.038 : 0.024);
    const wordStep = Number(element.dataset.splitWordStep) || (context === 'menu' ? 0.14 : 0.1);
    const jitterMax = context === 'menu' ? 0.045 : 0.03;

    let globalIndex = 0;

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';

      Array.from(word).forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        charSpan.textContent = char;

        // For menu items, use simple increasing delay of 0.1s per character
        const delay = context === 'menu' ? globalIndex * 0.1 : Math.max(baseDelay + wordIndex * wordStep + globalIndex * charStep + (Math.random() - 0.5) * jitterMax, 0);
        charSpan.style.setProperty('--char-delay', `${delay.toFixed(3)}s`);

        wordSpan.appendChild(charSpan);
        globalIndex += 1;
      });

      element.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        element.appendChild(document.createTextNode('\u00A0'));
      }
    });
  }

  // ========================================
  // Menu Split Text Initialization
  // ========================================
  function ensureMenuSplitText() {
    const menuLinks = document.querySelectorAll('.mobile-menu-link[data-split="menu"]');
    menuLinks.forEach((link, index) => {
      if (!link.dataset.splitReady) {
        prepareSplitText(link, index);
      }
    });
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
  // Cleanup on page unload
  // ========================================
  window.addEventListener('beforeunload', () => {
    if (heroNetwork) heroNetwork.destroy();
  });

  // ========================================
  // Smooth Zoom Effect with GSAP ScrollTrigger + Lenis
  // ========================================
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const heroSection = document.querySelector('.hero-section');
    const aboutSection = document.querySelector('.about-section');
    const aboutContainer = document.querySelector('.about-container');

    if (heroSection && aboutSection) {
      // Wait for page to load
      window.addEventListener('load', () => {
        setTimeout(() => {
          initSmoothZoomEffect();
        }, 3000);
      });

      function initSmoothZoomEffect() {
        const textCarousel = document.querySelector('.text-carousel');
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;

        // Mobile-optimized scroll distances and timings
        const scrollEnd = isSmallMobile ? '+=120%' : (isMobile ? '+=140%' : '+=160%');
        const scrubSpeed = isMobile ? 1.0 : 1.2; // Faster scrub on mobile
        const heroScale = isMobile ? 0.7 : 0.6; // Less aggressive zoom on mobile
        const carouselScale = isMobile ? 0.7 : 0.6;
        const carouselFinalScale = isMobile ? 0.3 : 0.2;
        const upwardMovement = window.innerHeight * (isMobile ? 1.0 : 1.2);

        // Pin the hero section and zoom it out, then move it up and off screen
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: scrollEnd,
            scrub: scrubSpeed,
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            toggleActions: 'play none none reset'
          }
        })
        .to(heroSection, {
          scale: heroScale,
          borderRadius: '0px',
          ease: 'power2.inOut'
        })
        .to(textCarousel, {
          scale: carouselScale,
          ease: 'power2.inOut'
        }, '<');
        
        // Only animate aboutContainer if it exists
        if (aboutContainer) {
          timeline.to(aboutContainer, {
            opacity: 1,
            y: 0,
            ease: 'power2.out'
          }, '<');
        }
        
        timeline
        .to(heroSection, {
          y: -upwardMovement,
          ease: 'power2.inOut'
        }, '>')
        .to(textCarousel, {
          y: -upwardMovement,
          scale: carouselFinalScale,
          ease: 'power2.inOut'
        }, '<');

        // Global scroll listener to handle scroll-to-top from anywhere
        let isScrollingToTop = false;

        lenis.on('scroll', ({ scroll }) => {
          // If user scrolls near top (within first section's range)
          if (scroll < window.innerHeight * 2 && !isScrollingToTop) {
            // ScrollTrigger will automatically handle the reverse animation
            // because scrub makes it bidirectional
          }
        });

        // Refresh ScrollTrigger
        ScrollTrigger.refresh();
      }

      // About Section Animations with GSAP
      function initAboutAnimations() {
        const aboutImage = document.querySelector('.about-image-wrapper');
        const aboutText = document.querySelector('.about-text-wrapper');

        if (aboutImage) {
          gsap.to(aboutImage, {
            scrollTrigger: {
              trigger: aboutImage,
              start: 'top 85%',
              end: 'top 60%',
              scrub: 1,
              toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out'
          });
        }

        if (aboutText) {
          gsap.to(aboutText, {
            scrollTrigger: {
              trigger: aboutText,
              start: 'top 85%',
              end: 'top 60%',
              scrub: 1,
              toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.2
          });
        }
      }

      // Initialize about animations after a delay
      setTimeout(() => {
        initAboutAnimations();
      }, 3500);

    } else {
      console.warn('Required sections not found for scroll animations');
    }
  } else {
    console.warn('GSAP or ScrollTrigger not loaded');
  }

  // ========================================
  // Procedural Text Carousel Generator
  // ========================================
  class ProceduralCarousel {
    constructor() {
      this.row1 = document.querySelector('.carousel-row-1 .carousel-content');
      this.row2 = document.querySelector('.carousel-row-2 .carousel-content');
      this.texts = ['ISIAH', 'UDOFIA'];
      this.fonts = [
        'Montserrat', 'Oswald', 'Archivo Black',
        'Bebas Neue', 'Source Sans Pro'
      ];

      // Mobile detection
      this.isMobile = window.innerWidth <= 768;

      // Performance settings - reduced elements on mobile
      this.maxElements = this.isMobile ? 12 : 20;
      this.viewportWidth = window.innerWidth;
      this.elementWidth = this.isMobile ? 150 : 200;
      this.elementsPerViewport = Math.ceil(this.viewportWidth / this.elementWidth) + 2;

      this.init();
    }
    
    init() {
      // Generate initial elements
      this.generateRow(this.row1, 'ISIAH');
      this.generateRow(this.row2, 'UDOFIA');
      
      // Set up intersection observer for performance
      this.setupObserver();
    }
    
    generateRow(container, text) {
      // Clear existing content
      container.innerHTML = '';

      // Generate enough elements to fill viewport + buffer (fewer on mobile)
      const totalElements = Math.min(this.elementsPerViewport * 2, this.maxElements);

      for (let i = 0; i < totalElements; i++) {
        const span = document.createElement('span');
        span.className = 'carousel-text';
        span.textContent = text;

        // Apply random font for variety
        const fontIndex = i % this.fonts.length;
        span.style.fontFamily = this.fonts[fontIndex];

        // Add will-change for better mobile performance
        if (this.isMobile) {
          span.style.willChange = 'transform';
        }

        container.appendChild(span);
      }
    }
    
    setupObserver() {
      // Only regenerate if viewport changes significantly
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          const newWidth = window.innerWidth;
          const wasMobile = this.isMobile;
          this.isMobile = newWidth <= 768;

          // Update element width based on device type
          this.elementWidth = this.isMobile ? 150 : 200;
          this.maxElements = this.isMobile ? 12 : 20;

          const newElementsPerViewport = Math.ceil(newWidth / this.elementWidth) + 2;

          // Regenerate if device type changed or elements changed significantly
          if (wasMobile !== this.isMobile || Math.abs(newElementsPerViewport - this.elementsPerViewport) > 2) {
            this.elementsPerViewport = newElementsPerViewport;
            this.regenerate();
          }
        }, 250);
      });
    }
    
    regenerate() {
      this.generateRow(this.row1, 'ISIAH');
      this.generateRow(this.row2, 'UDOFIA');
    }
    
    // Method to add more elements if needed (for very wide screens)
    ensureCoverage() {
      const containerWidth = this.row1.scrollWidth;
      const viewportWidth = window.innerWidth;
      
      if (containerWidth < viewportWidth * 1.5) {
        this.regenerate();
      }
    }
  }
  
  // Initialize procedural carousel
  let proceduralCarousel = null;
  
  function initProceduralCarousel() {
    if (proceduralCarousel) return;
    proceduralCarousel = new ProceduralCarousel();
  }
  
  // Initialize after page load
  window.addEventListener('load', () => {
    setTimeout(initProceduralCarousel, 1000);
  });

  // ========================================
  // About Section Network Background (Lightweight)
  // ========================================
  class AboutNetwork {
    constructor(container) {
      this.container = container;
      this.width = container.clientWidth || window.innerWidth;
      this.height = container.clientHeight || window.innerHeight;

      // Mobile detection for performance optimization
      this.isMobile = window.innerWidth <= 768;
      this.isSmallMobile = window.innerWidth <= 480;

      // Aggressive particle reduction on mobile
      this.pointCount = this.isSmallMobile ? 50 : (this.isMobile ? 80 : 120);
      this.maxLinkDistance = this.isMobile ? 60 : 80;
      this.bounds = this.isMobile ? { x: 100, y: 80, z: 100 } : { x: 150, y: 100, z: 150 };

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: this.isMobile ? 'low-power' : 'default'
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1 : 1.5));
      this.renderer.setSize(this.width, this.height);
      this.renderer.domElement.classList.add('about-canvas');
      this.container.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();
      const fov = this.isMobile ? 50 : 45;
      const cameraZ = this.isMobile ? 160 : 200;
      this.camera = new THREE.PerspectiveCamera(fov, this.width / this.height, 0.1, 1000);
      this.camera.position.set(0, 0, cameraZ);

      this.positions = new Float32Array(this.pointCount * 3);
      this.velocities = new Float32Array(this.pointCount * 3);
      this._initParticles();

      // White particles for dark navy background - smaller on mobile
      this.pointsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: this.isMobile ? 1.6 : 2.0,
        sizeAttenuation: true,
        transparent: true,
        opacity: this.isMobile ? 0.5 : 0.6
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
        color: 0xffffff,
        transparent: true,
        opacity: 0.15
      });
      this.linesMesh = new THREE.LineSegments(this.linesGeometry, this.linesMaterial);
      this.scene.add(this.linesMesh);

      this.renderer.setClearColor(0x000000, 0);

      this.clock = new THREE.Clock();
      this.frameId = null;

      // Simplified physics - no mouse interaction for performance
      this.rotationSpeed = 0.0008; // Match hero rotation speed
      this.randomMovementStrength = 0.005; // Add random continuous movement
      this.randomMovementFrequency = 1.0;

      this.handleResize = this.handleResize.bind(this);
      this.animate = this.animate.bind(this);

      window.addEventListener('resize', this.handleResize);
      this.animate();
    }

    _initParticles() {
      for (let i = 0; i < this.pointCount; i += 1) {
        const idx = i * 3;

        // Spherical distribution
        const radius = 60 + Math.random() * 120;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        this.positions[idx] = radius * Math.sin(phi) * Math.cos(theta);
        this.positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
        this.positions[idx + 2] = radius * Math.cos(phi);

        this.velocities[idx] = (Math.random() - 0.5) * 0.4;
        this.velocities[idx + 1] = (Math.random() - 0.5) * 0.3;
        this.velocities[idx + 2] = (Math.random() - 0.5) * 0.4;
      }
    }

    _updatePositions(delta) {
      const cappedDelta = Math.min(delta, 3);

      for (let i = 0; i < this.pointCount; i += 1) {
        const idx = i * 3;

        // Add random movement for natural organic motion
        if (Math.random() < this.randomMovementFrequency) {
          this.velocities[idx] += (Math.random() - 0.5) * this.randomMovementStrength;
          this.velocities[idx + 1] += (Math.random() - 0.5) * this.randomMovementStrength;
          this.velocities[idx + 2] += (Math.random() - 0.5) * this.randomMovementStrength;
        }

        // Simple damping
        const damping = 0.98;
        this.velocities[idx] *= damping;
        this.velocities[idx + 1] *= damping;
        this.velocities[idx + 2] *= damping;

        this.positions[idx] += this.velocities[idx] * cappedDelta;
        this.positions[idx + 1] += this.velocities[idx + 1] * cappedDelta;
        this.positions[idx + 2] += this.velocities[idx + 2] * cappedDelta;

        // Rotation
        if (this.rotationSpeed) {
          const angle = this.rotationSpeed * cappedDelta;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);

          const relX = this.positions[idx];
          const relY = this.positions[idx + 1];

          this.positions[idx] = relX * cos - relY * sin;
          this.positions[idx + 1] = relX * sin + relY * cos;
        }

        // Boundary bounce
        const limitX = this.bounds.x;
        const limitY = this.bounds.y;
        const limitZ = this.bounds.z;

        if (this.positions[idx] > limitX || this.positions[idx] < -limitX) {
          this.velocities[idx] *= -1;
          this.positions[idx] = Math.max(-limitX, Math.min(limitX, this.positions[idx]));
        }
        if (this.positions[idx + 1] > limitY || this.positions[idx + 1] < -limitY) {
          this.velocities[idx + 1] *= -1;
          this.positions[idx + 1] = Math.max(-limitY, Math.min(limitY, this.positions[idx + 1]));
        }
        if (this.positions[idx + 2] > limitZ || this.positions[idx + 2] < -limitZ) {
          this.velocities[idx + 2] *= -1;
          this.positions[idx + 2] = Math.max(-limitZ, Math.min(limitZ, this.positions[idx + 2]));
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
      this.renderer.render(this.scene, this.camera);
    }

    destroy() {
      cancelAnimationFrame(this.frameId);
      window.removeEventListener('resize', this.handleResize);
      this.renderer.dispose();
      this.pointsGeometry.dispose();
      this.linesGeometry.dispose();
      this.pointsMaterial.dispose();
      this.linesMaterial.dispose();
      if (this.renderer.domElement.parentNode === this.container) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
  }

  let aboutNetwork = null;

  function initAboutNetwork() {
    const aboutBackground = document.getElementById('about-background');

    if (!aboutBackground) {
      console.warn('About background element not found');
      return;
    }

    if (!window.THREE) {
      console.warn('Three.js is not available');
      return;
    }

    if (aboutNetwork) {
      aboutNetwork.destroy();
    }

    aboutNetwork = new AboutNetwork(aboutBackground);
  }

  // Initialize About network after page loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      initAboutNetwork();
    }, 3000);
  });

  // Cleanup
  window.addEventListener('beforeunload', () => {
    if (aboutNetwork) aboutNetwork.destroy();
  });

  // ========================================
  // Homepage Background Re-initialization
  // ========================================
  function reinitializeHomepageBackground() {
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
      console.log('Re-initializing homepage background...');
      
      // Force reinitialize by destroying existing networks first
      if (heroNetwork) {
        heroNetwork.destroy();
        heroNetwork = null;
      }
      if (aboutNetwork) {
        aboutNetwork.destroy();
        aboutNetwork = null;
      }
      
      // Reinitialize everything
      try {
        initTopographyBackground();
        initSyncedLogoHover();
        initProceduralCarousel();
        initAboutNetwork();
        console.log('Homepage background re-initialized successfully');
      } catch (error) {
        console.warn('Homepage background re-initialization failed:', error);
      }
    }
  }

  // Reinitialize on page show (when navigating back)
  window.addEventListener('pageshow', (event) => {
    // Always reinitialize when returning to homepage
    reinitializeHomepageBackground();
  });

  // Also ensure background initializes on first load
  window.addEventListener('load', () => {
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
      // Add a small delay to ensure the loading transition has completed
      setTimeout(() => {
        if (!heroNetwork) {
          console.log('Initializing background on first load...');
          try {
            initTopographyBackground();
            initSyncedLogoHover();
            initProceduralCarousel();
            initAboutNetwork();
          } catch (error) {
            console.warn('First load background initialization failed:', error);
          }
        }
      }, 1000);
    }
  });

  // ========================================
  // Console Easter Egg
  // ========================================
  console.log('%c??? Built with inspiration from Lando Norris', 'font-size: 16px; color: #0066cc; font-weight: bold;');
  console.log('%cIsiah Udofia - Yale University 2026', 'font-size: 14px; color: #001f3f;');
  console.log('%cCustom Three.js hero network + Seamless Loading Transition', 'font-size: 12px; color: #6c757d;');

})();
