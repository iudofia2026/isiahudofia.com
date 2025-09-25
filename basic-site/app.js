(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    const page = document.body.dataset.page;
    if (page) {
      document.querySelectorAll("[data-nav]").forEach((link) => {
        if (link.dataset.nav === page) {
          link.classList.add("active");
        }
      });
    }

    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.22 }
    );

    document.querySelectorAll("[data-animate='fade']").forEach((el) => fadeObserver.observe(el));

    const timelineObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timeline = entry.target;
            timeline.classList.add("active");
            const items = timeline.querySelectorAll("li");
            items.forEach((li, index) => {
              setTimeout(() => {
                li.classList.add("active");
              }, index * 120);
            });
            observer.unobserve(timeline);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("[data-timeline]").forEach((timeline) => timelineObserver.observe(timeline));

    const printBtn = document.querySelector("[data-print]");
    if (printBtn) {
      printBtn.addEventListener("click", (event) => {
        event.preventDefault();
        window.print();
      });
    }
  });
})();
