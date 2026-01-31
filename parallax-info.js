// Parallax effect for desktop info image
// This file is loaded on all pages but only initializes on info page

function initInfoParallax() {
    console.log('initInfoParallax called');
    const imgWrap = document.querySelector('.info_img_wrap.is-desktop');
    const img = document.querySelector('.info_img_wrap.is-desktop .info_img');

    console.log('imgWrap:', imgWrap, 'img:', img);

    if (!imgWrap || !img) {
        console.log('Missing elements, skipping parallax init');
        return false;
    }

    // Remove existing event listeners to prevent duplicates
    if (imgWrap._parallaxInitialized) {
        console.log('Already initialized, skipping');
        return true;
    }

    let isActive = false;

    imgWrap.addEventListener('mouseenter', function() {
        console.log('mouseenter');
        isActive = true;
    });

    imgWrap.addEventListener('mouseleave', function() {
        console.log('mouseleave');
        isActive = false;
        img.style.transform = 'translate(0, 0) scale(1)';
    });

    imgWrap.addEventListener('mousemove', function(e) {
        if (!isActive) return;

        const rect = imgWrap.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const moveX = (x - centerX) / centerX;
        const moveY = (y - centerY) / centerY;

        const maxMove = 15;
        const translateX = moveX * maxMove;
        const translateY = moveY * maxMove;

        img.style.transform = `translate(${-translateX}px, ${-translateY}px) scale(1.05)`;
    });

    imgWrap._parallaxInitialized = true;
    console.log('Parallax initialized successfully');
    return true;
}

// Only initialize on page load if we're on the info page
function checkAndInitOnLoad() {
    const container = document.querySelector('[data-barba-namespace="info"]');
    if (container) {
        console.log('Info page detected on load, initializing parallax');
        initInfoParallax();
    } else {
        console.log('Not on info page, skipping initial parallax init');
    }
}

// Monkey-patch the sb() function to include parallax initialization
function patchBarbaHooks() {
    // Wait for Barba to be ready
    if (!window.barba) {
        console.log('Barba not ready, waiting...');
        setTimeout(patchBarbaHooks, 100);
        return;
    }

    console.log('Barba ready, setting up parallax hook');

    // Hook into Barba's beforeEnter for info namespace
    const originalHooks = window.barba.hooks;

    // Add our parallax initialization to the info page transition
    window.barba.hooks.beforeEnter((data) => {
        console.log('Barba beforeEnter triggered, namespace:', data.next.namespace);
        if (data.next.namespace === 'info') {
            console.log('Entering info page via Barba, initializing parallax');
            setTimeout(() => {
                console.log('Delayed parallax init for info page');
                initInfoParallax();
            }, 100);
        }
    });
}

// Initialize on page load only if on info page
console.log('Page load - checking if on info page');
checkAndInitOnLoad();

// Set up Barba hook patching
patchBarbaHooks();

// Make this function available globally so Barba hooks can call it
window.initInfoParallax = initInfoParallax;