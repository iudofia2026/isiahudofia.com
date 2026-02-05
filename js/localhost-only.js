/**
 * Localhost-Only Component
 *
 * DESCRIPTION:
 * This component provides functionality to hide specific navigation elements
 * and sections when the site is deployed to production (non-localhost environments).
 *
 * USE CASES:
 * - Hide "Work in Progress" navigation items during development
 * - Hide experimental sections that aren't ready for production
 * - Test features locally before deploying to production
 *
 * USAGE:
 * 1. Add this script to your HTML: <script src="/js/localhost-only.js" defer></script>
 * 2. Add the "localhost-only" class to any element you want to hide in production
 * 3. For navigation items, use specific IDs and add them to the elementsToHide array
 *
 * EXAMPLE HTML:
 * <nav>
 *   <a href="/work" class="nav-link">Work</a>
 *   <a href="/about" class="nav-link">About</a>
 *   <a href="/experimental" id="localhost-only-nav" class="nav-link">Experimental</a>
 * </nav>
 *
 * <section id="localhost-only-section" class="localhost-only">
 *   <!-- Content that only shows on localhost -->
 * </section>
 */

(function() {
  'use strict';

  /**
   * Configuration: IDs of elements to hide in production
   * Add any element IDs that should only be visible on localhost
   */
  const elementsToHide = [
    'localhost-only-track-gallery'  // Mobile track and field gallery section only
  ];

  /**
   * Check if current environment is localhost
   * @returns {boolean} True if running on localhost
   */
  function isLocalhost() {
    const hostname = window.location.hostname;
    return hostname === 'localhost' ||
           hostname === '127.0.0.1' ||
           hostname === '::1';
  }

  /**
   * Hide/Show elements based on localhost environment
   * This function runs immediately and on page load to ensure elements have correct visibility
   */
  function toggleLocalhostOnlyElements() {
    if (!isLocalhost()) {
      // Production: Hide localhost-only elements
      elementsToHide.forEach(function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          element.style.display = 'none';
          console.log('Localhost-only element hidden:', elementId);
        }
      });

      // Also hide any elements with class "localhost-only"
      const localClassElements = document.querySelectorAll('.localhost-only');
      localClassElements.forEach(function(element) {
        element.style.display = 'none';
      });
    } else {
      // Localhost: Show localhost-only elements (override any inline display: none)
      elementsToHide.forEach(function(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          element.style.display = 'block';
          console.log('Localhost-only element shown:', elementId);
        }
      });

      // Also show any elements with class "localhost-only"
      const localClassElements = document.querySelectorAll('.localhost-only');
      localClassElements.forEach(function(element) {
        element.style.display = 'block';
      });

      console.log('Running on localhost - all localhost-only elements visible');
    }
  }

  /**
   * Initialize the component
   * Run immediately and also after page load to catch dynamically loaded content
   */
  function init() {
    // Run immediately
    toggleLocalhostOnlyElements();

    // Run after page load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', toggleLocalhostOnlyElements);
    }

    // Also run on window load as fallback
    window.addEventListener('load', toggleLocalhostOnlyElements);
  }

  // Auto-initialize
  init();

  // Optional: Expose functions globally for manual control
  window.LocalhostOnly = {
    isLocalhost: isLocalhost,
    toggleElements: toggleLocalhostOnlyElements,
    init: init
  };

})();
