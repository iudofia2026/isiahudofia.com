// Shuffle Animation Cleanup - Fixes issue where interrupted shuffle animations
// leave text in a half-shuffled state when navigating between pages
(function() {
  'use strict';

  // Clean up ALL shuffle intervals when leaving a page
  function cleanupAllShuffleIntervals() {
    // Find all elements with shuffle intervals
    const allElements = document.querySelectorAll('*');
    let cleanedCount = 0;

    allElements.forEach(element => {
      if (element.shuffleInterval) {
        clearInterval(element.shuffleInterval);
        delete element.shuffleInterval;
        cleanedCount++;
      }
    });

    // Also restore original text if it was saved
    allElements.forEach(element => {
      const originalText = element.getAttribute('data-original-text');
      if (originalText && element.textContent !== originalText) {
        element.textContent = originalText;
      }
    });

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} shuffle intervals`);
    }
  }

  // Clean up on page unload
  window.addEventListener('beforeunload', cleanupAllShuffleIntervals);

  // Clean up on Barba page transitions (if Barba is available)
  if (window.Barba) {
    window.Barba.hooks.before(cleanupAllShuffleIntervals);

    // Also clean up on page enter to reset any stale state
    window.Barba.hooks.enter(() => {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        // Reset any incomplete shuffle animations
        document.querySelectorAll('[data-shuffle-load]').forEach(element => {
          const originalText = element.getAttribute('data-original-text');
          if (originalText && element.textContent !== originalText) {
            element.textContent = originalText;
          }
        });
      }, 100);
    });
  }

  // Clean up immediately in case any intervals are already stale
  // This runs on page load to clean up any leftover state
  setTimeout(() => {
    document.querySelectorAll('[data-shuffle-load]').forEach(element => {
      // If the text looks corrupted (contains random chars), reset it
      const text = element.textContent.trim();
      const originalText = element.getAttribute('data-original-text');

      // Check if text contains obvious shuffle artifacts
      const hasShuffleArtifacts = /[^a-zA-Z0-9\s\&\@\.\,\-\(\)]/.test(text);

      if (hasShuffleArtifacts && originalText) {
        console.log('Resetting corrupted text:', element.textContent, '->', originalText);
        element.textContent = originalText;
      }
    });
  }, 50);

  console.log('Shuffle cleanup initialized');
})();
