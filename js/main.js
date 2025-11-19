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

      // Adaptive particle count for performance - increased for more visibility
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
      
      // Store original camera position for return animations
      this.originalCameraPosition = new THREE.Vector3(0, 0, cameraZ);
      this.originalCameraFov = fov;
      this.isAnimating = false;
      this.currentAnimation = null;

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
          point: new THREE.Color(0xffffff),
          line: new THREE.Color(0xffffff),
          lineOpacity: 0.3,
          clearColor: 0x000000,
          clearAlpha: 0
        },
        inverted: {
          point: new THREE.Color(0x001f3f),
          line: new THREE.Color(0x001f3f),
          lineOpacity: 0.25,
          clearColor: 0x001f3f,
          clearAlpha: 1
        }
      };

      // Initialize with default (white) palette manually since setInverted is paused
      const palette = this.palettes.default;
      this.pointsMaterial.color.copy(palette.point);
      this.linesMaterial.color.copy(palette.line);
      this.linesMaterial.opacity = palette.lineOpacity;
      this.renderer.setClearColor(palette.clearColor, palette.clearAlpha);
      this.pointsMaterial.needsUpdate = true;
      this.linesMaterial.needsUpdate = true;

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
      this.mouseForce = this.isMobile ? 0.15 : 0.3;

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
      
      // Special radius for tracked labels - very close on fixed plane
      const labelRadius = 70; // Fixed radius for contact, research, projects (very close)
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
            // 20% of nodes in close region - just outside globe
            radius = 110 + Math.random() * 15; // 110-125px
          } else if (randomValue < 0.5) {
            // 30% of nodes in mid region - very close
            radius = 125 + Math.random() * 20; // 125-145px
          } else {
            // 50% of nodes in far region - still close enough to see
            radius = 145 + Math.random() * 25; // 145-170px
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
      // TEMPORARY: Pause color inversion for now - remove this return to restore
      return;

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

    // Animate camera to zoom into a specific node - dramatic zoom towards viewer
    animateToNode(nodeIndex, duration = 0.8, onComplete = null) {
      if (this.isAnimating && this.currentAnimation) {
        this.currentAnimation.kill();
      }

      if (nodeIndex < 0 || nodeIndex >= this.pointCount) {
        console.warn('Invalid node index for camera animation:', nodeIndex);
        return;
      }

      this.isAnimating = true;

      // Get the target node position
      const idx = nodeIndex * 3;
      const targetX = this.positions[idx];
      const targetY = this.positions[idx + 1];
      const targetZ = this.positions[idx + 2];

      // Get current camera position for perspective calculation
      const startX = this.camera.position.x;
      const startY = this.camera.position.y;
      const startZ = this.camera.position.z;

      // Calculate direction vector from camera to target node
      const dirX = targetX - startX;
      const dirY = targetY - startY;
      const dirZ = targetZ - startZ;
      const distance = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);

      // Normalize direction
      const normDirX = dirX / distance;
      const normDirY = dirY / distance;
      const normDirZ = dirZ / distance;

      // Move camera THROUGH the node and beyond to create zoom-through effect
      // This makes all other nodes appear to zoom past the viewer
      const zoomThroughDistance = this.isMobile ? 150 : 200; // Distance to travel through
      const targetCameraX = targetX + normDirX * zoomThroughDistance;
      const targetCameraY = targetY + normDirY * zoomThroughDistance;
      const targetCameraZ = targetZ + normDirZ * zoomThroughDistance;

      // Target FOV (zoom in dramatically by reducing FOV significantly)
      const targetFov = this.isMobile ? 20 : 15;

      // Use GSAP to animate camera - faster and more dramatic
      if (window.gsap) {
        this.currentAnimation = gsap.to(this.camera.position, {
          x: targetCameraX,
          y: targetCameraY,
          z: targetCameraZ,
          duration: duration,
          ease: 'power3.inOut', // More aggressive easing
          onUpdate: () => {
            // Calculate look-at point that moves with camera for smooth perspective
            // Look slightly ahead in the direction of movement
            const progress = this.currentAnimation.progress();
            const lookAheadDistance = 50;
            const lookX = this.camera.position.x + normDirX * lookAheadDistance;
            const lookY = this.camera.position.y + normDirY * lookAheadDistance;
            const lookZ = this.camera.position.z + normDirZ * lookAheadDistance;
            
            this.camera.lookAt(lookX, lookY, lookZ);
            this.camera.updateProjectionMatrix();
          },
          onComplete: () => {
            this.isAnimating = false;
            this.currentAnimation = null;
            if (onComplete) onComplete();
          }
        });

        // Animate FOV for dramatic zoom effect
        gsap.to(this.camera, {
          fov: targetFov,
          duration: duration,
          ease: 'power3.inOut',
          onUpdate: () => {
            this.camera.updateProjectionMatrix();
          }
        });
      } else {
        // Fallback if GSAP not available
        console.warn('GSAP not available for camera animation');
        this.isAnimating = false;
        if (onComplete) onComplete();
      }
    }

    // Return camera to home position - fast and reactive
    returnToHome(duration = 0.7, onComplete = null) {
      if (this.isAnimating && this.currentAnimation) {
        this.currentAnimation.kill();
      }

      this.isAnimating = true;

      // Use GSAP to animate camera back - quick zoom out effect
      if (window.gsap) {
        this.currentAnimation = gsap.to(this.camera.position, {
          x: this.originalCameraPosition.x,
          y: this.originalCameraPosition.y,
          z: this.originalCameraPosition.z,
          duration: duration,
          ease: 'power3.inOut', // Match the zoom-in easing
          onUpdate: () => {
            // Look at center during return
            this.camera.lookAt(0, 0, 0);
            this.camera.updateProjectionMatrix();
          },
          onComplete: () => {
            this.isAnimating = false;
            this.currentAnimation = null;
            if (onComplete) onComplete();
          }
        });

        // Animate FOV back to original
        gsap.to(this.camera, {
          fov: this.originalCameraFov,
          duration: duration,
          ease: 'power3.inOut',
          onUpdate: () => {
            this.camera.updateProjectionMatrix();
          }
        });
      } else {
        // Fallback if GSAP not available
        console.warn('GSAP not available for camera animation');
        this.isAnimating = false;
        if (onComplete) onComplete();
      }
    }

    // Get node position by index
    getNodePosition(nodeIndex) {
      if (nodeIndex < 0 || nodeIndex >= this.pointCount) {
        return null;
      }
      const idx = nodeIndex * 3;
      return {
        x: this.positions[idx],
        y: this.positions[idx + 1],
        z: this.positions[idx + 2]
      };
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

  // Initialize circle animation with proper starting state
  let circleAnimation = null;
  
  function initCircleAnimation() {
    if (!window.gsap) {
      console.log('GSAP not loaded yet');
      return false;
    }
    if (!loadingCircleProgress) {
      console.log('loadingCircleProgress not found');
      return false;
    }
    
    console.log('Initializing circle animation...');
    // Set initial state - circle should be "empty" (fully offset)
    gsap.set(loadingCircleProgress, { strokeDashoffset: 565.48 });
    
    // Create animation to fill the circle
    circleAnimation = gsap.to(loadingCircleProgress, {
      strokeDashoffset: 0,
      duration: 2.5,
      ease: "power2.inOut",
      paused: true
    });
    console.log('Circle animation created:', circleAnimation);
    return true;
  }
  
  // Try to initialize immediately
  if (!initCircleAnimation()) {
    // If failed, wait for GSAP to load
    console.log('Waiting for GSAP...');
    const checkGsap = setInterval(() => {
      if (initCircleAnimation()) {
        clearInterval(checkGsap);
      }
    }, 100);
  }

  // Function to complete loading screen transition
  let transitionCompleted = false;
  function completeLoadingTransition() {
    if (transitionCompleted) return;
    transitionCompleted = true;
    
    console.log('completeLoadingTransition called');
    console.log('circleAnimation exists:', !!circleAnimation);

    // Initialize Three.js hero background before transition
    try {
      initTopographyBackground();
      initSyncedLogoHover();
      initInteractiveGlobe();
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
          // Calculate position to stay in center of hero area
          const loadingLogoRect = loadingLogo.getBoundingClientRect();
          const heroRect = heroIconWrapper.getBoundingClientRect();

          // Keep logo centered in hero area without going off screen
          const deltaX = heroRect.left + (heroRect.width / 2) - (loadingLogoRect.left + (loadingLogoRect.width / 2));
          const deltaY = heroRect.top + (heroRect.height / 2) - (loadingLogoRect.top + (loadingLogoRect.height / 2));

          // Ensure scaling doesn't cause overflow - limit to reasonable bounds
          const targetWidth = heroRect.width * 0.6; // Background icon size
          const scaleRatio = Math.min(targetWidth / loadingLogoRect.width, 2); // Cap scale to prevent huge sizes

          tl.to(loadingLogo, {
            x: deltaX,
            y: deltaY,
            scale: scaleRatio,
            duration: 0.9,
            ease: "power3.inOut"
          })
          .add(() => {
            document.body.classList.add('page-loaded'); // Trigger background icon and globe growth
            if (window.heroNetwork && typeof window.heroNetwork.triggerRipple === 'function') {
              window.heroNetwork.triggerRipple(0, 0, 12);
            }
          }, 0) // Trigger at the end of logo transition
          .to(loadingScreen, {
            backgroundColor: "rgba(0, 31, 63, 0)", // Navy transparent
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
            delay: 0.2 // Brief pause to ensure background icon is visible
          });
        } else {
          tl.to(loadingScreen, {
            backgroundColor: "rgba(0, 31, 63, 0)", // Navy transparent
            duration: 0.6,
            ease: "power2.out",
            delay: 0.8
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

    const startNodesTransition = () => {
      if (!window.gsap || !window.interactiveGlobe) {
        startMainTransition();
        return;
      }

      console.log('Starting globe build transition...');
      
      // Move the globe to loading screen temporarily
      const globeContainer = document.querySelector('#interactive-globe');
      const loadingContent = document.querySelector('.loading-content');
      
      if (!globeContainer || !loadingContent) {
        console.warn('Globe container or loading content not found');
        startMainTransition();
        return;
      }
      
      // Get the hero position for proper placement
      const heroRect = heroIconWrapper.getBoundingClientRect();
      
      // Position globe container on loading screen at hero position
      globeContainer.style.cssText = `
        position: fixed;
        left: ${heroRect.left}px;
        top: ${heroRect.top}px;
        width: ${heroRect.width}px;
        height: ${heroRect.height}px;
        z-index: 10001;
        pointer-events: none;
      `;
      loadingScreen.appendChild(globeContainer);
      
      // Animate the transition
      const tl = gsap.timeline({
        onComplete: () => {
          console.log('Globe build complete, starting main transition');
          startMainTransition();
        }
      });

      // Keep loading circle visible and morph it into the globe
      tl.add(() => {
          // Start fading out the loading circle fill, keep stroke
          gsap.to(loadingCircleProgress, { 
            opacity: 0.3, 
            duration: 0.5, 
            ease: "power2.out" 
          });
        })
        // Fade out loading logo to see globe clearly
        .to(loadingLogo, { opacity: 0, duration: 0.4, ease: "power2.out" }, "-=0.3")
        // Transform circle into globe position and start building
        .add(() => {
          console.log('Starting dramatic globe buildout...');
          
          const globe = window.interactiveGlobe;
          const cityMarkers = globe.cityMarkers || [];
          const projectMarkers = globe.projectMarkers || [];
          const projectLabels = globe.projectLabels || [];
          const connectionLines = globe.connectionLines ? [globe.connectionLines] : [];
          const globeMesh = globe.globeMesh;
          
          console.log('Building globe with', cityMarkers.length, 'cities and', projectMarkers.length, 'projects');
          
          // Push background nodes away from globe area (137.5px radius on screen)
          if (window.heroNetwork) {
            const heroNetwork = window.heroNetwork;
            const pushRadius = 140; // Slightly larger than canvas radius (275px / 2)
            const positions = heroNetwork.positions;
            
            console.log('Pushing background nodes away from globe...');
            
            for (let i = 0; i < heroNetwork.pointCount; i++) {
              const idx = i * 3;
              const x = positions[idx];
              const y = positions[idx + 1];
              const z = positions[idx + 2];
              
              // Calculate distance from center
              const distance = Math.sqrt(x * x + y * y + z * z);
              
              // If node is within push radius, push it out
              if (distance < pushRadius) {
                const pushDistance = pushRadius + 10; // Push slightly beyond
                const scale = pushDistance / distance;
                
                // Animate to new position
                gsap.to(positions, {
                  duration: 0.6,
                  ease: "back.out(2)",
                  [idx]: x * scale,
                  [idx + 1]: y * scale,
                  [idx + 2]: z * scale,
                  onUpdate: () => {
                    heroNetwork.pointsGeometry.attributes.position.needsUpdate = true;
                  }
                });
              }
            }
          }
          
          // Start globe sphere invisible
          if (globeMesh && globeMesh.material) {
            globeMesh.material.opacity = 0;
          }
          
          // Fade in globe sphere first - make it more visible
          if (globeMesh && globeMesh.material) {
            gsap.to(globeMesh.material, {
              opacity: 0.08,
              duration: 1.0,
              ease: "power2.out"
            });
          }
          
          // Move loading circle to homepage hero (remove from loading screen)
          const heroRect = heroIconWrapper.getBoundingClientRect();
          
          // Clone the circle and move it to hero section
          const circleClone = loadingLogoContainer.cloneNode(true);
          circleClone.style.cssText = `
            position: fixed;
            left: ${heroRect.left + (heroRect.width / 2)}px;
            top: ${heroRect.top + (heroRect.height / 2)}px;
            transform: translate(-50%, -50%);
            width: ${heroRect.width}px;
            height: ${heroRect.height}px;
            z-index: 2;
            pointer-events: none;
          `;
          
          // Add to hero section
          document.body.appendChild(circleClone);
          
          // Store for later animation
          window.heroCircle = circleClone;
          window.heroCircleProgress = circleClone.querySelector('.loading-circle-progress');
          
          // Hide original circle
          loadingLogoContainer.style.opacity = '0';
          
          // Hide all nodes initially
          cityMarkers.forEach(marker => {
            if (marker.material) {
              marker.material.opacity = 0;
              marker.scale.set(0, 0, 0);
            }
          });
          
          projectMarkers.forEach(marker => {
            if (marker.material) {
              marker.material.opacity = 0;
              marker.scale.set(0, 0, 0);
            }
          });
          
          projectLabels.forEach(label => {
            if (label.material) {
              label.material.opacity = 0;
              label.scale.set(0, 0, 0);
            }
          });
          
          connectionLines.forEach(line => {
            if (line && line.material) {
              line.material.opacity = 0;
            }
          });
          
          // Animate city markers with pronounced popout effect
          cityMarkers.forEach((marker, i) => {
            if (marker.material) {
              const delay = 0.4 + (i * 0.08); // Sequential with spacing
              
              gsap.to(marker.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.6,
                delay: delay,
                ease: "back.out(3)"
              });
              
              gsap.to(marker.material, {
                opacity: 1,
                duration: 0.4,
                delay: delay,
                ease: "power2.out"
              });
            }
          });
          
          // Animate project markers after cities
          const projectDelay = 0.4 + (cityMarkers.length * 0.08);
          projectMarkers.forEach((marker, i) => {
            if (marker.material) {
              const delay = projectDelay + (i * 0.1);
              
              gsap.to(marker.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.7,
                delay: delay,
                ease: "back.out(3)"
              });
              
              gsap.to(marker.material, {
                opacity: 0.9,
                duration: 0.4,
                delay: delay,
                ease: "power2.out"
              });
            }
          });
          
          // Animate project labels with markers
          projectLabels.forEach((label, i) => {
            if (label.material) {
              const delay = projectDelay + (i * 0.1);
              
              gsap.to(label.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.7,
                delay: delay,
                ease: "back.out(3)"
              });
              
              gsap.to(label.material, {
                opacity: 0.9,
                duration: 0.4,
                delay: delay,
                ease: "power2.out"
              });
            }
          });
          
          // Connection lines appear last
          const linesDelay = projectDelay + (projectMarkers.length * 0.1);
          connectionLines.forEach(line => {
            if (line && line.material) {
              gsap.to(line.material, {
                opacity: 0.15,
                duration: 1.0,
                delay: linesDelay,
                ease: "power2.out"
              });
            }
          });
        })
        // Wait longer for full globe build to be visible
        .to({}, { duration: 4.5 })
        // Start subtle loading screen fade while globe is still visible
        .to(loadingScreen, {
          backgroundColor: "rgba(0, 31, 63, 0)",
          duration: 1.2,
          ease: "power1.out"
        })
        // Trigger page loaded state during fade
        .add(() => {
          console.log('Globe build complete, transitioning to homepage');
          document.body.classList.add('page-loaded');
        }, "-=0.8")
        // Very subtle opacity fade - almost imperceptible
        .to(loadingScreen, {
          opacity: 0,
          duration: 0.8,
          ease: "power1.inOut",
          onComplete: () => {
            loadingScreen.style.display = 'none';
          }
        }, "-=0.4")
        // Animate hero circle reverse - full white to nothing (clockwise unravel)
        .add(() => {
          const heroCircleProgress = window.heroCircleProgress;
          if (!heroCircleProgress) return;
          
          // Make circle fully opaque white
          gsap.to(heroCircleProgress, {
            opacity: 1,
            strokeDashoffset: 0, // Full circle
            duration: 0.3,
            ease: "power2.out"
          });
        }, "-=1.5")
        // Unravel clockwise (increase strokeDashoffset in opposite direction)
        .to(window.heroCircleProgress, {
          strokeDashoffset: -565.48, // Negative for clockwise
          duration: 2.0,
          ease: "power2.inOut"
        }, "+=0.5")
        // Fade out the circle container after unravel
        .to(window.heroCircle, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            if (window.heroCircle) {
              window.heroCircle.remove();
            }
          }
        }, "-=0.3");
    };

    if (circleAnimation) {
      console.log('Playing circle animation...');
      circleAnimation.eventCallback('onComplete', () => {
        console.log('Circle animation complete');
        startNodesTransition();
      });
      circleAnimation.play();
    } else {
      console.log('No circle animation, starting nodes transition immediately');
      startNodesTransition();
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

  // ========================================
  // Maximum Scroll Limit
  // ========================================
  // Maximum scroll position will be set by ScrollTrigger animation
  // This prevents scrolling beyond when hero is fully zoomed out
  let maxScrollPosition = null;
  let scrollTriggerEndPosition = null;

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

  // Define sub-page data for networks
  const subPageData = {
    'projects': {
      title: 'projects',
      labels: [
        { text: 'Github', href: 'https://github.com/iudofia2026' },
        { text: 'Demo', href: '#' },
        { text: 'Code', href: '#' }
      ]
    },
    'research': {
      title: 'research',
      labels: [
        { text: 'Papers', href: '#' },
        { text: 'Publications', href: '#' },
        { text: 'Notes', href: '#' }
      ]
    },
    'contact': {
      title: 'contact',
      labels: [
        { text: 'Email', href: 'mailto:isiah.udofia@yale.edu' },
        { text: 'LinkedIn', href: 'https://linkedin.com/in/isiahudofia' },
        { text: 'Twitter', href: 'https://twitter.com' }
      ]
    }
  };

  function createSubPageNetwork(section) {
    // Destroy existing subpage network
    if (activeSubPageNetwork) {
      activeSubPageNetwork.destroy();
      activeSubPageNetwork = null;
    }

    // Get subpage data
    const data = subPageData[section];
    if (!data) {
      console.warn('No data found for section:', section);
      return;
    }

    // Create new subpage network in the body
    try {
      activeSubPageNetwork = new SubPageNetwork(
        document.body,
        data.title,
        data.labels
      );
      console.log('SubPageNetwork created for', section);
    } catch (error) {
      console.error('Failed to create SubPageNetwork:', error);
    }
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
    
    // Map overlay IDs to node indices
    const overlayToNodeIndex = {
      'section-projects': 8,
      'section-research': 21,
      'section-contact': 55
    };
    
    const nodeIndex = overlayToNodeIndex[overlayId];
    let cameraAnimationDelay = 0;
    
    // Animate camera to zoom into the specific node
    if (nodeIndex !== undefined && window.heroNetwork) {
      // Camera animation takes ~0.8s (quick and reactive)
      // Overlay fades in AFTER zoom completes to keep background visible
      window.heroNetwork.animateToNode(nodeIndex, 0.8, () => {
        console.log('Camera animation completed for', overlayId);
        
        // Create SubPageNetwork after zoom completes
        const section = sectionFromOverlayId(overlayId);
        createSubPageNetwork(section);
        
        // Show overlay content after zoom completes
        if (window.gsap) {
          gsap.to(overlay, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
      
      // Hide hero labels immediately during transition
      const heroLabels = document.querySelectorAll('.hero-label');
      if (heroLabels.length > 0 && window.gsap) {
        gsap.to(heroLabels, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.out'
        });
      }
      
      // Show overlay container immediately but keep it transparent during zoom
      overlay.style.display = 'flex';
      overlay.style.opacity = '0';
    } else {
      // Fallback if no camera animation
      overlay.style.display = 'flex';
      if (window.gsap) {
        gsap.fromTo(overlay, 
          { opacity: 0 },
          { 
            opacity: 1, 
            duration: 0.4,
            ease: 'power3.out'
          }
        );
      } else {
        overlay.style.opacity = '1';
      }
    }
  };

  const hideAllOverlays = (animate = true) => {
    const overlays = document.querySelectorAll('.section-overlay');
    
    // Destroy active SubPageNetwork
    if (activeSubPageNetwork) {
      activeSubPageNetwork.destroy();
      activeSubPageNetwork = null;
    }
    
    // Return camera to home position - quick and reactive
    if (window.heroNetwork && animate) {
      window.heroNetwork.returnToHome(0.7, () => {
        console.log('Camera returned to home');
      });
    }
    
    // Show hero labels again
    const heroLabels = document.querySelectorAll('.hero-label');
    if (heroLabels.length > 0 && window.gsap && animate) {
      gsap.to(heroLabels, {
        opacity: 1,
        duration: 0.3,
        delay: 0.2,
        ease: 'power2.out'
      });
    } else if (heroLabels.length > 0) {
      heroLabels.forEach(label => {
        label.style.opacity = '1';
      });
    }
    
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
      // Use hideAllOverlays which handles camera return animation
      const returnDuration = 700; // 0.7s camera animation (quick and reactive)
      
      // Hide overlay early, let camera animate over it
      const overlays = document.querySelectorAll('.section-overlay');
      if (window.gsap) {
        overlays.forEach(o => {
          if (o.style.opacity !== '0' && o.style.display !== 'none') {
            gsap.to(o, {
              opacity: 0,
              duration: 0.3,
              delay: 0.1,
              ease: 'power3.in',
              onComplete: () => {
                o.style.display = 'none';
              }
            });
          }
        });
      }
      
      // Hide overlays and return camera
      hideAllOverlays(true);

      // Final cleanup after return animation completes
      setTimeout(() => {
        restoreHomeExperience();
      }, returnDuration + 100);
      
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

        // Track scroll lock state
        let scrollTriggerInstance = null;

        // Pin the hero section and zoom it out - keep it on screen (no upward movement)
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
            toggleActions: 'play none none reset',
            onUpdate: (self) => {
              // Store reference to ScrollTrigger instance
              if (!scrollTriggerInstance) {
                scrollTriggerInstance = self;
              }
            },
            onEnter: (self) => {
              // Set max scroll position when ScrollTrigger starts
              if (self.end) {
                scrollTriggerEndPosition = self.end;
                maxScrollPosition = self.end;
                console.log('Max scroll position set to ScrollTrigger end:', maxScrollPosition);
              }
            },
            onRefresh: (self) => {
              // Update max scroll position when ScrollTrigger refreshes
              if (self.end) {
                scrollTriggerEndPosition = self.end;
                maxScrollPosition = self.end;
              }
            }
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
        
        // Set max scroll position after ScrollTrigger is created and refreshed
        const updateMaxScroll = () => {
          if (scrollTriggerInstance && scrollTriggerInstance.end) {
            scrollTriggerEndPosition = scrollTriggerInstance.end;
            maxScrollPosition = scrollTriggerInstance.end;
            console.log('Max scroll position updated to:', maxScrollPosition);
          }
        };
        
        // Update immediately after a short delay
        setTimeout(updateMaxScroll, 100);
        
        // Update on window resize (ScrollTrigger will refresh)
        let resizeTimeout;
        window.addEventListener('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
            setTimeout(updateMaxScroll, 50);
          }, 100);
        });

        // Prevent scrolling beyond max position (when hero is fully zoomed out)
        // This ensures hero and carousel stay on screen
        const maxScrollHandler = ({ scroll, direction }) => {
          if (maxScrollPosition !== null && scroll > maxScrollPosition) {
            // Force scroll back to max position
            requestAnimationFrame(() => {
              lenis.scrollTo(maxScrollPosition, { immediate: true });
            });
          }
        };
        
        lenis.on('scroll', maxScrollHandler);

        // Prevent wheel events from scrolling beyond max
        const maxScrollWheelHandler = (e) => {
          if (maxScrollPosition !== null) {
            const currentScroll = lenis.scroll || window.scrollY || document.documentElement.scrollTop;
            // If at or past max scroll and trying to scroll down, prevent it
            if (currentScroll >= maxScrollPosition && e.deltaY > 0) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          }
        };
        
        window.addEventListener('wheel', maxScrollWheelHandler, { passive: false });
        
        // Prevent touch scrolling beyond max
        let maxScrollTouchStartY = 0;
        window.addEventListener('touchstart', (e) => {
          if (maxScrollPosition !== null) {
            maxScrollTouchStartY = e.touches[0].clientY;
          }
        }, { passive: true });
        
        window.addEventListener('touchmove', (e) => {
          if (maxScrollPosition !== null) {
            const currentScroll = lenis.scroll || window.scrollY || document.documentElement.scrollTop;
            const touchY = e.touches[0].clientY;
            // If at max scroll and trying to scroll down (touch moving up), prevent it
            if (currentScroll >= maxScrollPosition && touchY < maxScrollTouchStartY) {
              e.preventDefault();
              return false;
            }
          }
        }, { passive: false });

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
  // SubPage Network - For Projects/Research/Contact
  // ========================================
  class SubPageNetwork {
    constructor(container, pageTitle, pageLabels = []) {
      this.container = container;
      this.pageTitle = pageTitle;
      this.pageLabels = pageLabels;
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      // Mobile detection
      this.isMobile = window.innerWidth <= 768;
      this.isSmallMobile = window.innerWidth <= 480;

      // Smaller network for sub-pages
      this.pointCount = this.isSmallMobile ? 30 : (this.isMobile ? 50 : 80);
      this.maxLinkDistance = this.isMobile ? 40 : 50;
      this.bounds = this.isMobile ? { x: 60, y: 50, z: 60 } : { x: 80, y: 60, z: 80 };

      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !this.isMobile,
        powerPreference: this.isMobile ? 'low-power' : 'default'
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
      this.renderer.setSize(this.width, this.height);
      this.renderer.domElement.classList.add('subpage-canvas');
      this.renderer.domElement.style.position = 'fixed';
      this.renderer.domElement.style.top = '0';
      this.renderer.domElement.style.left = '0';
      this.renderer.domElement.style.width = '100%';
      this.renderer.domElement.style.height = '100%';
      this.renderer.domElement.style.zIndex = '1';
      this.renderer.domElement.style.pointerEvents = 'none';
      this.renderer.domElement.style.opacity = '0';
      this.container.appendChild(this.renderer.domElement);
      
      // Fade in canvas
      if (window.gsap) {
        gsap.to(this.renderer.domElement, {
          opacity: 1,
          duration: 0.4,
          delay: 0.1,
          ease: 'power2.out'
        });
      } else {
        this.renderer.domElement.style.opacity = '1';
      }
      
      console.log('SubPageNetwork canvas created for:', pageTitle);

      this.scene = new THREE.Scene();
      const fov = this.isMobile ? 50 : 45;
      const cameraZ = this.isMobile ? 100 : 120;
      this.camera = new THREE.PerspectiveCamera(fov, this.width / this.height, 0.1, 1000);
      this.camera.position.set(0, 0, cameraZ);

      this.positions = new Float32Array(this.pointCount * 3);
      this.velocities = new Float32Array(this.pointCount * 3);
      this._initParticles();

      // Navy particles for white background
      this.pointsMaterial = new THREE.PointsMaterial({
        color: 0x001f3f,
        size: this.isMobile ? 1.8 : 2.2,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.7
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
        opacity: 0.2
      });
      this.linesMesh = new THREE.LineSegments(this.linesGeometry, this.linesMaterial);
      this.scene.add(this.linesMesh);

      this.renderer.setClearColor(0x000000, 0);

      // Create circular text label in center
      this.labelLayer = document.createElement('div');
      this.labelLayer.className = 'subpage-label-layer';
      this.labelLayer.style.position = 'fixed';
      this.labelLayer.style.top = '0';
      this.labelLayer.style.left = '0';
      this.labelLayer.style.width = '100%';
      this.labelLayer.style.height = '100%';
      this.labelLayer.style.zIndex = '2';
      this.labelLayer.style.pointerEvents = 'none';
      this.container.appendChild(this.labelLayer);

      this._createCenterLabel();
      this._createOrbitingLabels();

      this.clock = new THREE.Clock();
      this.frameId = null;

      // Orbital settings - same as homepage
      this.centerPoint = { x: 0, y: 0, z: 0 };
      this.orbitalForce = 0.000002;
      this.rotationSpeed = 0.0008;
      this.randomMovementStrength = 0.005;
      this.randomMovementFrequency = 1.0;

      this.handleResize = this.handleResize.bind(this);
      this.animate = this.animate.bind(this);

      window.addEventListener('resize', this.handleResize);
      this.animate();
    }

    _initParticles() {
      // Create spherical distribution around center
      for (let i = 0; i < this.pointCount; i += 1) {
        const idx = i * 3;

        // Spherical distribution
        const radius = 30 + Math.random() * 50; // Smaller radius for tighter network
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        this.positions[idx] = radius * Math.sin(phi) * Math.cos(theta);
        this.positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
        this.positions[idx + 2] = radius * Math.cos(phi);

        this.velocities[idx] = (Math.random() - 0.5) * 0.3;
        this.velocities[idx + 1] = (Math.random() - 0.5) * 0.2;
        this.velocities[idx + 2] = (Math.random() - 0.5) * 0.3;
      }
    }

    _createCenterLabel() {
      const centerLabel = document.createElement('div');
      centerLabel.className = 'subpage-center-label';
      centerLabel.style.position = 'absolute';
      centerLabel.style.top = '50%';
      centerLabel.style.left = '50%';
      centerLabel.style.transform = 'translate(-50%, -50%)';
      centerLabel.style.fontSize = this.isMobile ? '4rem' : '6rem';
      centerLabel.style.fontFamily = "'Outfit', sans-serif";
      centerLabel.style.fontWeight = '800';
      centerLabel.style.color = '#001f3f';
      centerLabel.style.textTransform = 'lowercase';
      centerLabel.style.letterSpacing = '-0.03em';
      centerLabel.style.opacity = '0';
      centerLabel.style.textAlign = 'center';
      centerLabel.style.lineHeight = '1';
      
      // Create circular text effect by repeating if needed
      const repeatCount = this.pageTitle.length < 8 ? 2 : 1;
      centerLabel.textContent = Array(repeatCount).fill(this.pageTitle).join(' • ');
      
      this.labelLayer.appendChild(centerLabel);
      this.centerLabel = centerLabel;

      // Fade in center label
      if (window.gsap) {
        gsap.to(centerLabel, {
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: 'power2.out'
        });
      }
    }

    _createOrbitingLabels() {
      this.orbitingLabelElements = [];
      
      // Create orbiting labels around center title
      this.pageLabels.forEach((labelData, index) => {
        const label = document.createElement('a');
        label.className = 'subpage-orbiting-label';
        label.textContent = labelData.text;
        label.href = labelData.href || '#';
        label.style.position = 'absolute';
        label.style.fontSize = this.isMobile ? '0.85rem' : '0.9rem';
        label.style.fontFamily = "'Inter', sans-serif";
        label.style.fontWeight = '500';
        label.style.color = '#001f3f';
        label.style.background = 'rgba(255, 255, 255, 0.9)';
        label.style.padding = this.isMobile ? '0.6rem 1rem' : '0.5rem 1.1rem';
        label.style.borderRadius = '999px';
        label.style.boxShadow = '0 8px 24px rgba(0, 31, 63, 0.12)';
        label.style.letterSpacing = '0.05em';
        label.style.textDecoration = 'none';
        label.style.opacity = '0';
        label.style.pointerEvents = 'auto';
        label.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        label.style.cursor = 'pointer';
        label.style.userSelect = 'none';
        label.style.webkitUserSelect = 'none';
        label.style.webkitTapHighlightColor = 'transparent';
        
        // Hover effect
        label.addEventListener('mouseenter', () => {
          label.style.transform = 'translate(-50%, -50%) scale(1.05)';
          label.style.boxShadow = '0 12px 32px rgba(0, 31, 63, 0.2)';
        });
        label.addEventListener('mouseleave', () => {
          label.style.transform = 'translate(-50%, -50%)';
          label.style.boxShadow = '0 8px 24px rgba(0, 31, 63, 0.12)';
        });
        
        this.labelLayer.appendChild(label);
        this.orbitingLabelElements.push({
          element: label,
          data: labelData,
          angle: (index / this.pageLabels.length) * Math.PI * 2,
          radius: this.isMobile ? 120 : 150
        });

        // Fade in orbiting labels
        if (window.gsap) {
          gsap.to(label, {
            opacity: 1,
            duration: 0.4,
            delay: 0.4 + index * 0.1,
            ease: 'power2.out'
          });
        }
      });
    }

    _updatePositions(delta) {
      const cappedDelta = Math.min(delta, 3);

      for (let i = 0; i < this.pointCount; i += 1) {
        const idx = i * 3;

        // Calculate distance from center point
        const dx = this.positions[idx] - this.centerPoint.x;
        const dy = this.positions[idx + 1] - this.centerPoint.y;

        // Apply orbital/tangential force for rotation
        if (this.orbitalForce > 0) {
          const orbitalX = -dy;
          const orbitalY = dx;
          const orbitalLength = Math.sqrt(orbitalX * orbitalX + orbitalY * orbitalY);

          if (orbitalLength > 0) {
            this.velocities[idx] += (orbitalX / orbitalLength) * this.orbitalForce;
            this.velocities[idx + 1] += (orbitalY / orbitalLength) * this.orbitalForce;
          }
        }

        // Apply random movement
        if (Math.random() < this.randomMovementFrequency) {
          this.velocities[idx] += (Math.random() - 0.5) * this.randomMovementStrength;
          this.velocities[idx + 1] += (Math.random() - 0.5) * this.randomMovementStrength;
          this.velocities[idx + 2] += (Math.random() - 0.5) * this.randomMovementStrength;
        }

        // Apply damping
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

          const velX = this.velocities[idx];
          const velY = this.velocities[idx + 1];

          this.velocities[idx] = velX * cos - velY * sin;
          this.velocities[idx + 1] = velX * sin + velY * cos;
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

    _updateOrbitingLabels() {
      if (!this.orbitingLabelElements || !this.orbitingLabelElements.length) return;

      const time = Date.now() * 0.0003; // Slow rotation

      this.orbitingLabelElements.forEach((labelObj, index) => {
        // Calculate orbiting position
        const angle = labelObj.angle + time;
        const x = Math.cos(angle) * labelObj.radius;
        const y = Math.sin(angle) * labelObj.radius;

        // Position at center of screen + offset
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        labelObj.element.style.left = `${centerX + x}px`;
        labelObj.element.style.top = `${centerY + y}px`;
        labelObj.element.style.transform = 'translate(-50%, -50%)';
      });
    }

    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    }

    animate() {
      this.frameId = requestAnimationFrame(this.animate);
      const delta = this.clock.getDelta() * 60;
      this._updatePositions(delta);
      this._updateLines();
      this._updateOrbitingLabels();
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
      if (this.labelLayer && this.labelLayer.parentNode) {
        this.labelLayer.parentNode.removeChild(this.labelLayer);
      }
    }
  }

  // Store active subpage network
  let activeSubPageNetwork = null;

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
      if (interactiveGlobe) {
        interactiveGlobe.destroy();
        interactiveGlobe = null;
      }
      
      // Reinitialize everything
      try {
        initTopographyBackground();
        initSyncedLogoHover();
        initInteractiveGlobe();
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
            initInteractiveGlobe();
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
  // Professional Interactive Globe Component
  // ========================================
  class InteractiveGlobe {
    constructor(container) {
      this.container = container;
      this.width = container.clientWidth;
      this.height = container.clientHeight;

      // Mobile detection for performance optimization
      this.isMobile = window.innerWidth <= 768;

      // Scene setup
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !this.isMobile,
        powerPreference: this.isMobile ? 'low-power' : 'default'
      });

      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.isMobile ? 1.5 : 2));
      this.container.appendChild(this.renderer.domElement);

      // Globe properties
      this.globeRadius = 5; // Increased size
      this.majorCities = this.getMajorCities();
      this.projectNodes = this.getProjectNodes();

      // Interaction properties
      this.isDragging = false;
      this.previousMousePosition = { x: 0, y: 0 };
      this.rotationVelocity = { x: 0, y: 0 };
      this.autoRotation = { x: 0, y: 0.003 };
      this.currentRotation = { x: 0, y: 0 };

      // Initialize
      this.init();
      this.setupEventListeners();
      this.animate();
    }

    getMajorCities() {
      return [
        { name: "New York", lat: 40.7128, lng: -74.0060 },
        { name: "London", lat: 51.5074, lng: -0.1278 },
        { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
        { name: "Sydney", lat: -33.8688, lng: 151.2093 },
        { name: "Paris", lat: 48.8566, lng: 2.3522 },
        { name: "Dubai", lat: 25.2048, lng: 55.2708 },
        { name: "Singapore", lat: 1.3521, lng: 103.8198 },
        { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
        { name: "São Paulo", lat: -23.5558, lng: -46.6396 },
        { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
        { name: "Beijing", lat: 39.9042, lng: 116.4074 },
        { name: "Cairo", lat: 30.0444, lng: 31.2357 },
        { name: "Moscow", lat: 55.7558, lng: 37.6176 },
        { name: "Cape Town", lat: -33.9249, lng: 18.4241 },
        { name: "Mexico City", lat: 19.4326, lng: -99.1332 }
      ];
    }

    getProjectNodes() {
      return [
        {
          name: "projects",
          lat: 41.8781, // Chicago area
          lng: -87.6298,
          type: "projects",
          color: 0xffffff // White for navy background
        },
        {
          name: "research",
          lat: 55.7558, // Moscow area
          lng: 37.6176,
          type: "research",
          color: 0xffffff // White for navy background
        },
        {
          name: "contact",
          lat: -33.8688, // Sydney area
          lng: 151.2093,
          type: "contact",
          color: 0xffffff // White for navy background
        }
      ];
    }

    latLngToVector3(lat, lng, radius) {
      const phi = (lat * Math.PI) / 180;
      const theta = ((lng - 180) * Math.PI) / 180;

      const x = -radius * Math.cos(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.sin(theta);

      return new THREE.Vector3(x, y, z);
    }

    init() {
      // Create globe group
      this.globeGroup = new THREE.Group();
      this.scene.add(this.globeGroup);

      // Create earth sphere with wireframe
      this.createEarthSphere();

      // Create translucent inner layer
      this.createTranslucentLayer();

      // Create city markers
      this.createCityMarkers();

      // Create project nodes
      this.createProjectNodes();

      // Create connection lines between cities and project nodes
      this.createConnectionLines();

      // Position camera (adjusted for larger globe)
      this.camera.position.set(0, 0, 14);

      // Add subtle lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      this.scene.add(directionalLight);
    }

    createEarthSphere() {
      // Create wireframe sphere
      const sphereGeometry = new THREE.SphereGeometry(this.globeRadius, 32, 16);

      // Create wireframe material
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // White for navy background
        wireframe: true,
        transparent: true,
        opacity: 0.2
      });

      this.wireframeSphere = new THREE.Mesh(sphereGeometry, wireframeMaterial);
      this.globeGroup.add(this.wireframeSphere);

      // Create continent outlines using lines
      this.createContinentOutlines();
    }

    createContinentOutlines() {
      // Simplified continent data points
      const continents = [
        // North America
        { lat: 60, lng: -100 }, { lat: 45, lng: -75 }, { lat: 25, lng: -80 }, { lat: 20, lng: -100 }, { lat: 30, lng: -115 }, { lat: 50, lng: -125 },
        // South America
        { lat: 10, lng: -60 }, { lat: -10, lng: -50 }, { lat: -30, lng: -60 }, { lat: -50, lng: -70 }, { lat: -20, lng: -80 }, { lat: 0, lng: -75 },
        // Europe
        { lat: 70, lng: 20 }, { lat: 60, lng: 10 }, { lat: 50, lng: 0 }, { lat: 40, lng: 20 }, { lat: 60, lng: 30 },
        // Africa
        { lat: 30, lng: 0 }, { lat: 0, lng: 20 }, { lat: -30, lng: 25 }, { lat: -35, lng: 20 }, { lat: 10, lng: 10 },
        // Asia
        { lat: 60, lng: 100 }, { lat: 50, lng: 80 }, { lat: 30, lng: 75 }, { lat: 20, lng: 100 }, { lat: 40, lng: 120 }, { lat: 60, lng: 140 },
        // Australia
        { lat: -20, lng: 130 }, { lat: -35, lng: 140 }, { lat: -40, lng: 150 }, { lat: -25, lng: 115 }
      ];

      const lineGeometry = new THREE.BufferGeometry();
      const positions = [];

      // Create curved lines between continent points
      for (let i = 0; i < continents.length - 1; i++) {
        const start = this.latLngToVector3(continents[i].lat, continents[i].lng, this.globeRadius + 0.01);
        const end = this.latLngToVector3(continents[i + 1].lat, continents[i + 1].lng, this.globeRadius + 0.01);

        positions.push(start.x, start.y, start.z);
        positions.push(end.x, end.y, end.z);
      }

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff, // White for navy background
        transparent: true,
        opacity: 0.3
      });

      this.continentLines = new THREE.LineSegments(lineGeometry, lineMaterial);
      this.globeGroup.add(this.continentLines);
    }

    createTranslucentLayer() {
      // Create a white translucent inner sphere for depth - same size as globe
      const innerSphereGeometry = new THREE.SphereGeometry(this.globeRadius, 32, 16);
      const innerSphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // White
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide // Render from inside
      });

      this.innerSphere = new THREE.Mesh(innerSphereGeometry, innerSphereMaterial);
      this.globeGroup.add(this.innerSphere);
    }

    createCityMarkers() {
      this.cityMarkers = [];

      const markerGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // White nodes for navy background
        transparent: true,
        opacity: 0.9
      });

      this.majorCities.forEach(city => {
        const position = this.latLngToVector3(city.lat, city.lng, this.globeRadius + 0.05);
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.copy(position);
        marker.userData = city;

        this.globeGroup.add(marker);
        this.cityMarkers.push(marker);
      });
    }

    createProjectNodes() {
      this.projectMarkers = [];
      this.projectLabels = [];

      this.projectNodes.forEach(node => {
        // Create larger, more prominent markers for project nodes
        const nodeGeometry = new THREE.SphereGeometry(0.12, 12, 12);
        const nodeMaterial = new THREE.MeshBasicMaterial({
          color: node.color,
          transparent: true,
          opacity: 0.9
        });

        const position = this.latLngToVector3(node.lat, node.lng, this.globeRadius + 0.15);
        const marker = new THREE.Mesh(nodeGeometry, nodeMaterial);
        marker.position.copy(position);
        marker.userData = node;

        this.globeGroup.add(marker);
        this.projectMarkers.push(marker);

        // Create extended connection lines from project nodes
        const extendedPosition = this.latLngToVector3(node.lat, node.lng, this.globeRadius + 2);
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [
          position.x, position.y, position.z,
          extendedPosition.x, extendedPosition.y, extendedPosition.z
        ];
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
          color: node.color,
          transparent: true,
          opacity: 0.6
        });

        const line = new THREE.Line(lineGeometry, lineMaterial);
        this.globeGroup.add(line);

        // Create floating label at the end of the line
        const labelGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const labelMaterial = new THREE.MeshBasicMaterial({
          color: node.color,
          transparent: true,
          opacity: 0.9
        });

        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.copy(extendedPosition);
        label.userData = { ...node, isLabel: true };

        this.globeGroup.add(label);
        this.projectLabels.push(label);
      });
    }

    createConnectionLines() {
      const lineGeometry = new THREE.BufferGeometry();
      const positions = [];

      // Create connections between nearby cities
      for (let i = 0; i < this.majorCities.length; i++) {
        for (let j = i + 1; j < this.majorCities.length; j++) {
          const city1 = this.majorCities[i];
          const city2 = this.majorCities[j];

          // Calculate distance and only connect nearby cities
          const distance = this.calculateDistance(city1.lat, city1.lng, city2.lat, city2.lng);

          if (distance < 8000) { // Connect cities within 8000km
            const pos1 = this.latLngToVector3(city1.lat, city1.lng, this.globeRadius + 0.02);
            const pos2 = this.latLngToVector3(city2.lat, city2.lng, this.globeRadius + 0.02);

            positions.push(pos1.x, pos1.y, pos1.z);
            positions.push(pos2.x, pos2.y, pos2.z);
          }
        }
      }

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

      const connectionMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff, // White for navy background
        transparent: true,
        opacity: 0.25
      });

      this.connectionLines = new THREE.LineSegments(lineGeometry, connectionMaterial);
      this.globeGroup.add(this.connectionLines);
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }

    setupEventListeners() {
      const canvas = this.renderer.domElement;

      // Mouse events
      canvas.addEventListener('mousedown', (event) => {
        this.isDragging = true;
        this.previousMousePosition.x = event.clientX;
        this.previousMousePosition.y = event.clientY;
      });

      canvas.addEventListener('mousemove', (event) => {
        if (!this.isDragging) return;

        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;

        this.rotationVelocity.y = deltaX * 0.002;
        this.rotationVelocity.x = -deltaY * 0.002;

        this.previousMousePosition.x = event.clientX;
        this.previousMousePosition.y = event.clientY;
      });

      canvas.addEventListener('mouseup', () => {
        this.isDragging = false;
      });

      canvas.addEventListener('mouseleave', () => {
        this.isDragging = false;
      });

      // Touch events for mobile
      canvas.addEventListener('touchstart', (event) => {
        event.preventDefault();
        if (event.touches.length === 1) {
          this.isDragging = true;
          this.previousMousePosition.x = event.touches[0].clientX;
          this.previousMousePosition.y = event.touches[0].clientY;
        }
      }, { passive: false });

      canvas.addEventListener('touchmove', (event) => {
        event.preventDefault();
        if (!this.isDragging || event.touches.length !== 1) return;

        const deltaX = event.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = event.touches[0].clientY - this.previousMousePosition.y;

        this.rotationVelocity.y = deltaX * 0.002;
        this.rotationVelocity.x = -deltaY * 0.002;

        this.previousMousePosition.x = event.touches[0].clientX;
        this.previousMousePosition.y = event.touches[0].clientY;
      }, { passive: false });

      canvas.addEventListener('touchend', (event) => {
        event.preventDefault();
        this.isDragging = false;
      }, { passive: false });

      // Resize handler
      window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
      this.width = this.container.clientWidth;
      this.height = this.container.clientHeight;

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.width, this.height);
    }

    animate() {
      requestAnimationFrame(() => this.animate());

      // Apply rotation
      if (!this.isDragging) {
        // Auto rotation when not dragging
        this.currentRotation.y += this.autoRotation.y;
        this.globeGroup.rotation.y = this.currentRotation.y;
      } else {
        // User interaction rotation
        this.currentRotation.x += this.rotationVelocity.x;
        this.currentRotation.y += this.rotationVelocity.y;

        // Constrain x rotation
        this.currentRotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.currentRotation.x));

        this.globeGroup.rotation.x = this.currentRotation.x;
        this.globeGroup.rotation.y = this.currentRotation.y;
      }

      // No damping for frictionless feel - globe will continue spinning
      // this.rotationVelocity.x *= 0.98;
      // this.rotationVelocity.y *= 0.98;

      // Animate city markers
      const time = Date.now() * 0.002;
      this.cityMarkers.forEach((marker, index) => {
        const offset = index * 0.5;
        const scale = 1 + Math.sin(time + offset) * 0.15;
        marker.scale.setScalar(scale);
      });

      // Animate project markers with more prominent pulsing
      if (this.projectMarkers) {
        this.projectMarkers.forEach((marker, index) => {
          const offset = index * 1.0;
          const scale = 1 + Math.sin(time * 1.5 + offset) * 0.3;
          marker.scale.setScalar(scale);
        });
      }

      // Animate project labels
      if (this.projectLabels) {
        this.projectLabels.forEach((label, index) => {
          const offset = index * 1.0;
          const scale = 1 + Math.sin(time * 1.2 + offset) * 0.25;
          label.scale.setScalar(scale);
        });
      }

      // Animate connection lines opacity
      if (this.connectionLines) {
        this.connectionLines.material.opacity = 0.25 + Math.sin(time * 0.8) * 0.1;
      }

      this.renderer.render(this.scene, this.camera);
    }

    destroy() {
      if (this.renderer) {
        this.container.removeChild(this.renderer.domElement);
        this.renderer.dispose();
      }
    }
  }

  // Initialize Interactive Globe
  let interactiveGlobe = null;

  function initInteractiveGlobe() {
    const globeContainer = document.getElementById('interactive-globe');
    if (globeContainer && !interactiveGlobe) {
      interactiveGlobe = new InteractiveGlobe(globeContainer);
    }
  }

  // ========================================
  // Console Easter Egg
  // ========================================
  console.log('%c??? Built with inspiration from Lando Norris', 'font-size: 16px; color: #0066cc; font-weight: bold;');
  console.log('%cIsiah Udofia - Yale University 2026', 'font-size: 14px; color: #001f3f;');
  console.log('%cCustom Three.js hero network + Seamless Loading Transition', 'font-size: 12px; color: #6c757d;');

})();
