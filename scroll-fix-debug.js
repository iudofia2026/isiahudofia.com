/**
 * SCROLL POSITION BUG - DIAGNOSTIC & FIX
 *
 * Problem: When navigating between pages (especially index ↔ info), the new page
 * loads with content positioned lower on the screen, then quickly jumps up to the
 * correct top position.
 *
 * Root Cause Analysis:
 * 1. Barba.js SPA navigation replaces content but timing issues between page load
 *    and scroll position reset
 * 2. Lenis smooth scroll (line 5177+ in bundle.js) may be intercepting scroll
 *    changes before Barba can reset position
 * 3. GSAP ScrollTrigger (line 4166: scrollRestoration = "manual") may conflict
 * 4. No explicit scroll reset in Barba lifecycle hooks
 *
 * This script provides diagnostics and implements fixes
 */

(function() {
  'use strict';

  const DEBUG = true;
  const SCROLL_RESET_TIMEOUT = 100;

  // Diagnostic logging
  function log(message, data) {
    if (DEBUG) {
      console.log(`[ScrollFix] ${message}`, data || '');
    }
  }

  /**
   * DIAGNOSTIC: Measure scroll timing during page transitions
   * Add this to see exactly when and how scroll position changes
   */
  function startDiagnostics() {
    if (!DEBUG) return;

    let measurements = [];

    // Track scroll position changes
    const scrollObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes('scroll')) {
          measurements.push({
            time: entry.startTime,
            scrollY: window.scrollY,
            scrollX: window.scrollX
          });
        }
      }
    });

    try {
      scrollObserver.observe({ entryTypes: ['measure', 'layout-shift'] });
    } catch(e) {
      log('PerformanceObserver not available');
    }

    // Log Barba hooks timing
    if (window.barba) {
      window.barba.hooks.before((data) => {
        log('BEFORE transition', {
          from: data.current.namespace,
          to: data.next.namespace,
          scrollY: window.scrollY,
          scrollX: window.scrollX
        });
        measurements.push({ event: 'barba:before', scrollY: window.scrollY });
      });

      window.barba.hooks.after((data) => {
        log('AFTER transition', {
          namespace: data.next.namespace,
          scrollY: window.scrollY,
          scrollX: window.scrollX
        });
        measurements.push({ event: 'barba:after', scrollY: window.scrollY });

        // Print summary
        setTimeout(() => {
          console.table(measurements);
        }, 500);
      });
    }
  }

  /**
   * FIX 1: Force scroll reset immediately in beforeEnter hook
   * This prevents the page from rendering at wrong scroll position
   */
  function forceScrollReset() {
    // Method 1: Native instant scroll
    window.scrollTo(0, 0);

    // Method 2: Document element scroll
    if (document.documentElement.scrollTop) {
      document.documentElement.scrollTop = 0;
    }

    // Method 3: Body scroll
    if (document.body.scrollTop) {
      document.body.scrollTop = 0;
    }

    // Method 4: Lenis scroll reset (if available)
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true, lock: true });
    }

    log('Scroll force reset', {
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      lenisScroll: window.lenis ? window.lenis.scroll : 'N/A'
    });
  }

  /**
   * FIX 2: Register Barba hooks for proper scroll management
   */
  function setupBarbaHooks() {
    if (!window.barba) {
      log('Barba not found, retrying...');
      setTimeout(setupBarbaHooks, 100);
      return;
    }

    log('Setting up Barba scroll hooks');

    // BEFORE page enters - reset scroll BEFORE new content renders
    window.barba.hooks.beforeEnter((data) => {
      log('beforeEnter: Resetting scroll position');

      // Immediate scroll reset
      forceScrollReset();

      // Also reset after a small delay to catch any late-rendering content
      setTimeout(forceScrollReset, SCROLL_RESET_TIMEOUT);

      // Disable scroll restoration to prevent browser interference
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    });

    // AFTER page enters - ensure scroll is still at top
    window.barba.hooks.enter((data) => {
      log('enter: Verifying scroll position');

      // Force scroll again if needed
      setTimeout(forceScrollReset, SCROLL_RESET_TIMEOUT);

      // One more check after animations
      setTimeout(() => {
        if (window.scrollY > 10 || window.scrollX > 10) {
          log('Post-animation scroll correction needed');
          forceScrollReset();
        }
      }, 600);
    });

    // AFTER transition completes - final verification
    window.barba.hooks.after((data) => {
      log('after: Final scroll verification');

      setTimeout(() => {
        if (window.scrollY > 10 || window.scrollX > 10) {
          log('Final scroll correction applied');
          forceScrollReset();
        }
      }, 100);
    });
  }

  /**
   * FIX 3: Prevent Lenis from interfering during transitions
   */
  function setupLenisHooks() {
    // Wait for Lenis to initialize
    const checkLenis = setInterval(() => {
      if (window.lenis) {
        clearInterval(checkLenis);
        log('Lenis detected, setting up hooks');

        // Stop Lenis during Barba transitions
        if (window.barba) {
          window.barba.hooks.before(() => {
            log('Pausing Lenis during transition');
            window.lenis.stop();
          });

          window.barba.hooks.after(() => {
            log('Resuming Lenis after transition');
            window.lenis.start();
            // Ensure Lenis knows we're at top
            window.lenis.scrollTo(0, { immediate: true });
          });
        }
      }
    }, 100);

    // Don't wait forever
    setTimeout(() => clearInterval(checkLenis), 5000);
  }

  /**
   * FIX 4: CSS-based prevention of scroll jump
   * Add this to your CSS to prevent visual jump
   */
  function injectCSSFixes() {
    const style = document.createElement('style');
    style.textContent = `
      /* Prevent scroll jump during page transitions */
      .barba-container {
        position: relative;
        min-height: 100vh;
        overflow-x: hidden;
      }

      /* Ensure no scroll restoration interference */
      html {
        scroll-behavior: auto !important;
        scroll-padding-top: 0 !important;
      }

      body {
        overflow-x: hidden;
        scroll-behavior: auto !important;
      }

      /* Transition guard - hide content until scroll is reset */
      [data-barba="container"].transitioning {
        display: block;
        transform: translateY(0);
      }

      /* Prevent GSAP ScrollTrigger from causing issues */
      .gsap-scroll-fix {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `;

    document.head.appendChild(style);
    log('CSS fixes injected');
  }

  /**
   * DIAGNOSTIC: Monitor scroll position continuously
   */
  function monitorScrollPosition() {
    let lastScrollY = 0;
    let lastScrollX = 0;

    setInterval(() => {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;

      if (Math.abs(currentScrollY - lastScrollY) > 50 ||
          Math.abs(currentScrollX - lastScrollX) > 50) {
        log('Significant scroll change detected', {
          from: { x: lastScrollX, y: lastScrollY },
          to: { x: currentScrollX, y: currentScrollY },
          url: window.location.href
        });
      }

      lastScrollY = currentScrollY;
      lastScrollX = currentScrollX;
    }, 500);
  }

  /**
   * DIAGNOSTIC: Check for common issues
   */
  function runDiagnostics() {
    log('=== SCROLL FIX DIAGNOSTICS ===');

    // Check Barba
    log('Barba status', {
      exists: !!window.barba,
      version: window.barba ? window.barba.version : 'N/A'
    });

    // Check Lenis
    log('Lenis status', {
      exists: !!window.lenis,
      version: window.lenisVersion || 'N/A'
    });

    // Check GSAP
    log('GSAP status', {
      exists: !!window.gsap,
      scrollTrigger: !!(window.gsap && window.gsap.ScrollTrigger)
    });

    // Check scroll restoration
    log('Scroll restoration', {
      mode: history.scrollRestoration || 'not supported'
    });

    // Check current scroll
    log('Current position', {
      scrollY: window.scrollY,
      scrollX: window.scrollX,
      documentScrollTop: document.documentElement.scrollTop,
      bodyScrollTop: document.body.scrollTop
    });

    // Check for CSS conflicts
    const computedStyle = window.getComputedStyle(document.body);
    log('CSS check', {
      scrollBehavior: computedStyle.scrollBehavior,
      overflowX: computedStyle.overflowX
    });
  }

  /**
   * Initialize all fixes and diagnostics
   */
  function init() {
    log('Initializing scroll fix...');

    // Start diagnostics
    startDiagnostics();
    runDiagnostics();

    // Apply fixes
    injectCSSFixes();
    setupBarbaHooks();
    setupLenisHooks();

    // Monitor scroll
    monitorScrollPosition();

    // Initial scroll reset
    if (window.scrollY > 0 || window.scrollX > 0) {
      log('Initial scroll reset on page load');
      forceScrollReset();
    }

    log('Scroll fix initialized');
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Also initialize on window load to catch anything
  window.addEventListener('load', () => {
    setTimeout(() => {
      log('Post-load verification');
      runDiagnostics();
    }, 1000);
  });

  // Export for manual triggering
  window.ScrollFix = {
    forceReset: forceScrollReset,
    diagnose: runDiagnostics,
    log: log
  };

})();
