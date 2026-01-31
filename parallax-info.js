// Parallax effect for desktop info image
// This file is loaded on all pages but only initializes on info page

function initInfoParallax() {
    const imgWrap = document.querySelector('.info_img_wrap.is-desktop');
    const img = document.querySelector('.info_img_wrap.is-desktop .info_img');

    if (!imgWrap || !img) {
        return;
    }

    // Remove existing event listeners to prevent duplicates
    if (imgWrap._parallaxInitialized) {
        return;
    }

    let isActive = false;

    imgWrap.addEventListener('mouseenter', function() {
        isActive = true;
    });

    imgWrap.addEventListener('mouseleave', function() {
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
}

// Only initialize on page load if we're on the info page
const container = document.querySelector('[data-barba-namespace="info"]');
if (container) {
    initInfoParallax();
}