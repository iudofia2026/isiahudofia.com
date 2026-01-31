/**
 * SCROLL POSITION FIX - Production Version
 *
 * Fixes scroll jump bug during Barba.js page transitions
 *
 * Usage: Add <script src="/js/scroll-fix.js"></script> before closing </body>
 */

(function() {
  'use strict';

  const SCROLL_RESET_TIMEOUT = 50;
  const MAX_RETRIES = 3;

  /**
   * Force scroll to top using multiple methods
   * Handles Lenis smooth scroll, native scroll, and edge cases
   */
  function forceScrollTop() {
    // Primary method: Native instant scroll
    window.scrollTo(0, 0);

    // Fallback for older browsers
    if (document.documentElement.scrollTop) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body.scrollTop) {
      document.body.scrollTop = 0;
    }

    // Lenis smooth scroll - if available
    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      try {
        window.lenis.scrollTo(0, { immediate: true, lock: true });
      } catch(e) {
        // Lenis might not be ready, that's ok
      }
    }

    // Disable browser scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }

  /**
   * Verify scroll is at top, retry if not
   */
  function verifyScrollTop(retryCount = 0) {
    if (window.scrollY <= 5 && window.scrollX <= 5) {
      return; // Success, already at top
    }

    if (retryCount < MAX_RETRIES) {
      requestAnimationFrame(() => {
        forceScrollTop();
        setTimeout(() => verifyScrollTop(retryCount + 1), SCROLL_RESET_TIMEOUT);
      });
    }
  }

  /**
   * Set up Barba.js transition hooks
   */
  function setupBarbaFix() {
    // Wait for Barba to be available
    const initBarbaHooks = () => {
      if (!window.barba) {
        setTimeout(initBarbaHooks, 50);
        return;
      }

      // BEFORE new content renders - immediate reset
      window.barba.hooks.beforeEnter(() => {
        forceScrollTop();
      });

      // DURING transition - ensure scroll stays at top
      window.barba.hooks.enter(() => {
        forceScrollTop();
        setTimeout(verifyScrollTop, SCROLL_RESET_TIMEOUT);
      });

      // AFTER transition - final verification
      window.barba.hooks.after(() => {
        setTimeout(() => {
          forceScrollTop();
          verifyScrollTop();
        }, SCROLL_RESET_TIMEOUT);
      });
    };

    initBarbaHooks();
  }

  /**
   * Set up Lenis smooth scroll coordination
   */
  function setupLenisCoordination() {
    // Wait for Lenis to initialize
    const initLenisHooks = () => {
      if (!window.lenis) {
        setTimeout(initLenisHooks, 100);
        return;
      }

      if (!window.barba) return;

      // Pause Lenis during transitions to prevent conflicts
      window.barba.hooks.before(() => {
        if (window.lenis && typeof window.lenis.stop === 'function') {
          window.lenis.stop();
        }
      });

      // Resume Lenis after transitions
      window.barba.hooks.after(() => {
        if (window.lenis) {
          if (typeof window.lenis.start === 'function') {
            window.lenis.start();
          }
          // Sync Lenis scroll position
          if (typeof window.lenis.scrollTo === 'function') {
            try {
              window.lenis.scrollTo(0, { immediate: true });
            } catch(e) {
              // Ignore if Lenis not ready
            }
          }
        }
      });
    };

    setTimeout(initLenisHooks, 100);
  }

  /**
   * Inject CSS to prevent visual glitches
   */
  function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Prevent scroll jump during transitions */
      html {
        scroll-behavior: auto !important;
      }

      body {
        overflow-x: hidden;
        scroll-behavior: auto !important;
      }

      [data-barba="container"] {
        position: relative;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Initialize on page load
   */
  function init() {
    // Inject CSS fixes
    injectCSS();

    // Set up transition hooks
    setupBarbaFix();
    setupLenisCoordination();

    // Initial scroll reset if needed
    if (window.scrollY > 0 || window.scrollX > 0) {
      forceScrollTop();
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
