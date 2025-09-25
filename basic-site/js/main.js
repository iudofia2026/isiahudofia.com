(() => {
  const ready = (fn) => {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    }
  };

  ready(() => {
    const navPage = document.body.dataset.page;
    if (navPage) {
      document.querySelectorAll("[data-nav]").forEach((link) => {
        if (link.dataset.nav === navPage) {
          link.classList.add("active");
        }
      });
    }

    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let prefersReduced = motionMq.matches;
    motionMq.addEventListener("change", (evt) => {
      prefersReduced = evt.matches;
      if (prefersReduced) stopCanvas(); else startCanvas();
    });

    const revealTargets = document.querySelectorAll("[data-animate='fade']");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade", "is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.22 }
    );
    revealTargets.forEach((el) => {
      el.classList.add("reveal-on-scroll");
      revealObserver.observe(el);
    });

    /* Hero parallax */
    const parallaxEl = document.querySelector("[data-parallax]");
    if (parallaxEl && !prefersReduced) {
      let ticking = false;
      const handleScroll = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          const offset = window.scrollY * 0.06;
          parallaxEl.style.transform = `translateY(${Math.min(offset, 14)}px)`;
          ticking = false;
        });
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    /* Neural canvas */
    const canvas = document.getElementById("bg-neural");
    let ctx, nodes = [], animationId, pulseTimer;
    let width = 0;
    let height = 0;

    const initCanvas = () => {
      if (!canvas) return;
      ctx = canvas.getContext("2d");
      const setSize = () => {
        const rect = canvas.parentElement.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        width = canvas.width = rect.width * ratio;
        height = canvas.height = rect.height * ratio;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);
      };
      setSize();
      window.addEventListener("resize", setSize);

      const nodeCount = 52;
      nodes = new Array(nodeCount).fill(0).map(() => {
        const baseX = Math.random();
        const baseY = Math.random();
        return {
          baseX,
          baseY,
          x: baseX,
          y: baseY,
          radius: 1.2 + Math.random() * 1.5,
          offset: Math.random() * Math.PI * 2,
          speed: 0.15 + Math.random() * 0.25,
          pulse: 0,
        };
      });
    };

    const draw = () => {
      if (!canvas || prefersReduced) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gradColors = [
        "rgba(99,102,241,0.55)",
        "rgba(147,51,234,0.45)",
      ];
      const nodePositions = nodes.map((node) => {
        node.offset += 0.0008 * node.speed * (performance.now() / 16.6);
        const driftX = Math.sin(node.offset) * 0.015;
        const driftY = Math.cos(node.offset) * 0.015;
        const x = (node.baseX + driftX) * canvas.width;
        const y = (node.baseY + driftY) * canvas.height;
        return { node, x, y };
      });

      nodePositions.forEach(({ node, x, y }, idx) => {
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = gradColors[idx % gradColors.length];
        ctx.fillStyle = gradColors[idx % gradColors.length];
        ctx.globalAlpha = 0.18 + node.pulse;
        ctx.beginPath();
        ctx.arc(x, y, node.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const a = nodePositions[i];
          const b = nodePositions[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = canvas.width * 0.16;
          if (dist < maxDist) {
            ctx.save();
            ctx.strokeStyle = "rgba(112, 110, 255, 0.12)";
            ctx.lineWidth = 1;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "rgba(112, 110, 255, 0.25)";
            ctx.globalAlpha = Math.max(0.05, 1 - dist / maxDist) * (0.7 + a.node.pulse);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      nodePositions.forEach(({ node }) => {
        node.pulse *= 0.94;
      });

      animationId = requestAnimationFrame(draw);
    };

    const pulseNodes = () => {
      nodes.forEach((node) => {
        node.pulse = Math.random() < 0.08 ? 0.25 : node.pulse * 0.92;
      });
    };

    const startCanvas = () => {
      if (!canvas || prefersReduced) return;
      if (!ctx) initCanvas();
      cancelAnimationFrame(animationId);
      draw();
      clearInterval(pulseTimer);
      pulseTimer = setInterval(pulseNodes, 2400);
    };

    const stopCanvas = () => {
      cancelAnimationFrame(animationId);
      clearInterval(pulseTimer);
    };

    if (document.visibilityState === "visible") startCanvas();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        stopCanvas();
      } else if (!prefersReduced) {
        startCanvas();
      }
    });

    /* Zen timeline reveal */
    document.querySelectorAll("[data-zen-rail]").forEach((timeline) => {
      const items = Array.from(timeline.querySelectorAll("li"));
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              timeline.classList.add("active");
              items.forEach((item, index) => {
                setTimeout(() => item.classList.add("is-visible"), index * 140);
              });
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(timeline);
    });

    /* Discord accordion */
    const accordion = document.querySelector("[data-discord-accordion]");
    if (accordion) {
      const items = Array.from(accordion.querySelectorAll(".timeline-item"));
      const closeAll = () => items.forEach((item) => item.classList.remove("is-open"));
      items.forEach((item) => {
        const trigger = item.querySelector(".timeline-trigger");
        trigger.addEventListener("click", () => {
          const isOpen = item.classList.contains("is-open");
          closeAll();
          if (!isOpen) item.classList.add("is-open");
        });
      });

      const accordionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
            }
          });
        },
        { threshold: 0.25 }
      );
      items.forEach((item) => accordionObserver.observe(item));
    }

    /* Typing indicator */
    const typingEl = document.querySelector("[data-typing]");
    if (typingEl) {
      const snippets = [
        "Discord voice → STT (Deepgram) → translation → inline bot",
        "Discord voice → captions overlay → real-time chat",
        "Discord voice → Deepgram → translation → publish"
      ];
      let idx = 0;
      const render = () => {
        typingEl.textContent = snippets[idx];
        idx = (idx + 1) % snippets.length;
      };
      render();
      setInterval(render, 2600);
    }

    /* Reveal class for other cards */
    document.querySelectorAll(".detail-card, .zen-card, .thesis-card, .milestone-chip, .discord-stack").forEach((el) => {
      el.classList.add("reveal-on-scroll");
      revealObserver.observe(el);
    });

    /* Timeline li in zen already handled; ensure Discord nodes animate when open */

    /* Resume print button */
    const printBtn = document.querySelector("[data-print]");
    if (printBtn) {
      printBtn.addEventListener("click", (event) => {
        event.preventDefault();
        window.print();
      });
    }
  });
})();

// ZEN rail progress: fill as items reveal
(() => {
  const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = motionMq.matches;
  const bodyIsZen = document.querySelector('.zen-loop');
  if (!bodyIsZen || reduced) return;

  const rail = document.querySelector('[data-rail-progress]');
  const items = Array.from(document.querySelectorAll('.timeline-item'));
  if (!rail || !items.length) return;

  const update = () => {
    const first = items[0].getBoundingClientRect();
    const last  = items[items.length - 1].getBoundingClientRect();
    const viewH = window.innerHeight;
    // compute percent of list that has entered the viewport
    let visibleCount = 0;
    items.forEach(it => {
      const r = it.getBoundingClientRect();
      if (r.top < viewH * 0.8) visibleCount++;
    });
    const pct = Math.max(0, Math.min(1, visibleCount / items.length));
    rail.style.background = `linear-gradient(var(--accent-1), var(--accent-2))`;
    rail.style.mask = `linear-gradient(#000 ${pct*100}%, transparent ${pct*100}%)`;
    rail.style.webkitMask = rail.style.mask;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();
