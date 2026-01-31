/**
 * Common JavaScript Utilities
 * Consolidated shared functions to eliminate code duplication across all HTML pages
 */

(function() {
  'use strict';

  /**
   * Favicon Management
   * Ensures favicon and apple-touch-icon links are present in the document head
   */
  const faviconConfig = {
    url: '/assets/favicon.jpg',
    type: 'image/jpeg',
    appleTouchUrl: '/assets/favicon.jpg'
  };

  function ensureFavicon() {
    const head = document.head;
    const existingIcon = head.querySelector('link[rel="icon"]');
    const existingAppleIcon = head.querySelector('link[rel="apple-touch-icon"]');

    if (!existingIcon) {
      const iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      iconLink.type = faviconConfig.type;
      iconLink.href = faviconConfig.url;
      head.appendChild(iconLink);
    }

    if (!existingAppleIcon) {
      const appleIconLink = document.createElement('link');
      appleIconLink.rel = 'apple-touch-icon';
      appleIconLink.href = faviconConfig.appleTouchUrl;
      head.appendChild(appleIconLink);
    }
  }

  /**
   * Video Autoplay Management
   * Handles autoplay for all videos with proper fallbacks for browser restrictions
   */
  const videoConfig = {
    autoplaySelectors: [
      'video[autoplay]',
      'video.project_img',
      'video.carousel-video'
    ],
    defaultSpeed: 1.0,
    maxRetries: 3
  };

  function attemptAutoplay(retryCount = 0) {
    const videos = document.querySelectorAll(videoConfig.autoplaySelectors.join(', '));
    let autoplayed = 0;

    videos.forEach(function(video) {
      // Skip if already attempted
      if (video.dataset.autoplayAttempted === 'true') return;

      video.dataset.autoplayAttempted = 'true';

      // Ensure muted for autoplay compatibility
      video.muted = true;
      video.setAttribute('muted', '');
      video.volume = 0;

      // Set playback speed if specified
      const speed = video.dataset.speed || videoConfig.defaultSpeed;
      video.playbackRate = parseFloat(speed);

      // Attempt playback
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.then(function() {
          autoplayed++;
          console.log('Video autoplayed:', video.src || video.dataset.src);
        }).catch(function(error) {
          console.log('Autoplay failed for video:', error.message);

          // Add user interaction fallbacks
          video.addEventListener('click', handleUserInteraction);
          video.addEventListener('touchstart', handleUserInteraction);
        });
      }
    });

    // Retry logic for videos that may not be ready
    if (retryCount < videoConfig.maxRetries && autoplayed < videos.length) {
      setTimeout(function() {
        attemptAutoplay(retryCount + 1);
      }, 1000);
    }
  }

  function handleUserInteraction() {
    this.muted = true;
    this.play().catch(function(error) {
      console.log('Playback failed after user interaction:', error);
    });

    // Remove event listeners after first interaction
    this.removeEventListener('click', handleUserInteraction);
    this.removeEventListener('touchstart', handleUserInteraction);
  }

  /**
   * Shuffle Animation Cleanup
   * Cleans up any running shuffle intervals to prevent memory leaks
   */
  const shuffleIntervals = new Set();

  function cleanupAllShuffleIntervals() {
    shuffleIntervals.forEach(function(intervalId) {
      clearInterval(intervalId);
    });
    shuffleIntervals.clear();
  }

  function registerShuffleInterval(intervalId) {
    shuffleIntervals.add(intervalId);
    return intervalId;
  }

  /**
   * Initialization
   * Run all common functions when DOM is ready
   */
  function init() {
    // Ensure favicon is present
    ensureFavicon();

    // Initialize video autoplay
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        attemptAutoplay();
      });
    } else {
      attemptAutoplay();
    }

    // Clean up shuffle intervals on page unload
    window.addEventListener('beforeunload', cleanupAllShuffleIntervals);
  }

  // Start initialization
  init();

  // Export functions for external use if needed
  window.CommonUtils = {
    ensureFavicon: ensureFavicon,
    attemptAutoplay: attemptAutoplay,
    cleanupAllShuffleIntervals: cleanupAllShuffleIntervals,
    registerShuffleInterval: registerShuffleInterval
  };

})();
