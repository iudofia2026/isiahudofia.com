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

    // ----- Resume PDF link normalizer -----
    (function normalizeResumeLinks() {
      const url = new URL(window.location.href);
      const parts = url.pathname.split("/").filter(Boolean);
      const rootIdx = parts.indexOf("basic-site");
      let basePath;
      if (rootIdx !== -1) {
        basePath = "/" + parts.slice(0, rootIdx + 1).join("/");
      } else {
        const match = url.pathname.match(/\/basic-site(\/|$)/);
        basePath = match ? url.pathname.slice(0, match.index + "/basic-site".length) : ".";
      }

      const pdfPath = `${basePath}/assets/Udofia_Isiah_Resume.pdf`;

      document.querySelectorAll("[data-resume]").forEach((a) => {
        a.setAttribute("href", pdfPath);
        a.setAttribute("download", "Udofia_Isiah_Resume.pdf");
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      });

      try {
        fetch(pdfPath, { method: "HEAD" })
          .then((response) => {
            if (!response.ok) throw new Error("Resume PDF missing");
          })
          .catch(() => {
            document.querySelectorAll("[data-resume]").forEach((a) => {
              a.removeAttribute("href");
              a.removeAttribute("download");
              a.classList.add("is-disabled");
              a.textContent = "Resume PDF unavailable";
            });
          });
      } catch (error) {
        document.querySelectorAll("[data-resume]").forEach((a) => {
          a.removeAttribute("href");
          a.removeAttribute("download");
          a.classList.add("is-disabled");
          a.textContent = "Resume PDF unavailable";
        });
      }
    })();
    // --------------------------------------

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
        ctx.shadowBlur = 10;
        ctx.shadowColor = gradColors[idx % gradColors.length];
        ctx.fillStyle = gradColors[idx % gradColors.length];
        ctx.globalAlpha = 0.22 + node.pulse;
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
            ctx.strokeStyle = "rgba(112,110,255,0.16)";
            ctx.lineWidth = 1;
            ctx.shadowBlur = 10;
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

    /* ===== Projects Page Enhancements ===== */
    const projectsHero = document.querySelector(".projects-hero");
    if (projectsHero) {
      const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
      let prefersReduced = motionMq.matches;

      const canvas = document.getElementById("projects-bg");
      const ctx = canvas ? canvas.getContext("2d") : null;
      const nodes = [];
      const NODE_COUNT = 56;
      let width = 0;
      let height = 0;
      let dpr = window.devicePixelRatio || 1;
      let rafId;

      const rootStyles = getComputedStyle(document.documentElement);
      const parseHue = (value, fallback) => {
        const parsed = parseFloat(value.trim());
        return Number.isFinite(parsed) ? parsed : fallback;
      };
      const hueA = parseHue(rootStyles.getPropertyValue("--projHueA") || "", 205);
      const hueB = parseHue(rootStyles.getPropertyValue("--projHueB") || "", 330);

      const clampNodes = () => {
        nodes.forEach((node) => {
          if (node.x < 0) node.x = 0;
          if (node.x > width) node.x = width;
          if (node.y < 0) node.y = 0;
          if (node.y > height) node.y = height;
        });
      };

      const resize = () => {
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;
        width = rect.width;
        height = rect.height;
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        clampNodes();
      };

      const seed = () => {
        nodes.length = 0;
        for (let i = 0; i < NODE_COUNT; i += 1) {
          nodes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            r: 1 + Math.random() * 1.6,
          });
        }
      };

      const tick = () => {
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, width, height);

        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, `hsla(${hueA} 80% 60% / 0.06)`);
        gradient.addColorStop(1, `hsla(${hueB} 80% 60% / 0.06)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        for (const node of nodes) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          ctx.beginPath();
          ctx.fillStyle = "rgba(255,255,255,0.18)";
          ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
          ctx.fill();
        }

        for (let i = 0; i < nodes.length; i += 1) {
          for (let j = i + 1; j < nodes.length; j += 1) {
            const a = nodes[i];
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 120) {
              ctx.strokeStyle = `rgba(200,200,255,${((1 - dist / 120) * 0.18).toFixed(3)})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }

        rafId = requestAnimationFrame(tick);
      };

      const stop = () => cancelAnimationFrame(rafId);

      const start = () => {
        if (!canvas || !ctx || prefersReduced) return;
        resize();
        if (!nodes.length) seed();
        stop();
        tick();
      };

      if (canvas && ctx && !prefersReduced) {
        start();
      }

      window.addEventListener(
        "resize",
        () => {
          if (!canvas || !ctx || prefersReduced) return;
          resize();
        },
        { passive: true }
      );

      document.addEventListener("visibilitychange", () => {
        if (prefersReduced || !canvas || !ctx) return;
        if (document.hidden) stop();
        else start();
      });

      motionMq.addEventListener("change", (event) => {
        prefersReduced = event.matches;
        if (prefersReduced) {
          stop();
        } else {
          start();
        }
      });

      const grid = document.querySelector("[data-grid]");
      if (grid) {
        const cards = Array.from(grid.querySelectorAll('[data-animate="fade"]'));
        if (prefersReduced) {
          cards.forEach((card) => card.classList.add("reveal-on-scroll", "is-visible"));
        } else {
          const cardObserver = new IntersectionObserver(
            (entries, observer) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  const idx = cards.indexOf(entry.target);
                  setTimeout(() => entry.target.classList.add("is-visible"), idx * 120);
                  observer.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.25 }
          );
          cards.forEach((card) => {
            card.classList.add("reveal-on-scroll");
            cardObserver.observe(card);
          });
        }
      }

      const tilts = document.querySelectorAll('[data-tilt]');
      tilts.forEach((card) => {
        const href = card.dataset.href;
        const link = card.querySelector(".project-link");

        if (!prefersReduced) {
          let bounds;
          const update = (mx, my) => {
            if (!bounds) return;
            card.style.setProperty("--mx", `${mx}px`);
            card.style.setProperty("--my", `${my}px`);
            const rx = ((my / bounds.height) - 0.5) * -6;
            const ry = ((mx / bounds.width) - 0.5) * 6;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
          };
          const reset = () => {
            card.style.transform = "none";
            card.style.removeProperty("--mx");
            card.style.removeProperty("--my");
            bounds = undefined;
          };

          card.addEventListener("mousemove", (event) => {
            bounds = bounds || card.getBoundingClientRect();
            update(event.clientX - bounds.left, event.clientY - bounds.top);
          });
          card.addEventListener("mouseleave", () => {
            bounds = undefined;
            reset();
          });
          card.addEventListener("focus", () => {
            bounds = card.getBoundingClientRect();
            update(bounds.width / 2, bounds.height / 2);
          });
          card.addEventListener("blur", reset);
        }

        card.addEventListener("click", (event) => {
          if (event.defaultPrevented) return;
          if (link && event.target instanceof HTMLElement && !event.target.closest("a")) {
            link.click();
          }
        });

        card.addEventListener("keydown", (event) => {
          if (!link) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            link.click();
          }
        });
      });
    }

    document
      .querySelectorAll('.chip-row.deliverables .chip')
      .forEach((chip) => {
        chip.addEventListener('pointerenter', () => {
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
          chip.animate(
            [
              { boxShadow: '0 0 0px rgba(138,161,255,0)' },
              { boxShadow: '0 0 16px rgba(138,161,255,0.25)' },
              { boxShadow: '0 0 0px rgba(138,161,255,0)' }
            ],
            { duration: 600, easing: 'ease-out' }
          );
        });
      });

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


// Home neural network (higher contrast, distinct palette)
(() => {
  const canvas = document.getElementById('home-neural');
  if (!canvas) return;

  const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reduced = motionMq.matches;
  let ctx, nodes = [], raf, pulseTimer;
  let w=0, h=0, dpr=1;

  const COLORS = {
    nodeA: 'rgba(25,180,168,0.9)',   // teal
    nodeB: 'rgba(255,120,90,0.85)',  // coral
    link:  'rgba(180,200,255,0.22)'
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    w = Math.floor(rect.width * dpr);
    h = Math.floor(rect.height * dpr);
    canvas.width = w; canvas.height = h;
    if (ctx) ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function init() {
    ctx = canvas.getContext('2d');
    resize(); window.addEventListener('resize', resize);
    const count = Math.max(60, Math.floor((canvas.clientWidth*canvas.clientHeight)/18000));
    nodes = Array.from({length:count}, () => {
      const bx = Math.random(), by = Math.random();
      return {
        bx, by,
        r: 1.3 + Math.random()*2.0,
        t: Math.random()*Math.PI*2,
        s: 0.4 + Math.random()*0.9,
        pulse: 0
      };
    });
    start();
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0,0,w,h);

    // positions with subtle drift
    const pos = nodes.map((n,i) => {
      n.t += 0.003*n.s;
      const dx = Math.sin(n.t)*0.02;
      const dy = Math.cos(n.t)*0.018;
      const x = (n.bx + dx) * (w/dpr);
      const y = (n.by + dy) * (h/dpr);
      return {n,x,y,i};
    });

    // nodes glow
    for (const p of pos){
      const fill = (p.i%2===0) ? COLORS.nodeA : COLORS.nodeB;
      ctx.save();
      ctx.globalAlpha = 0.18 + p.n.pulse;
      ctx.shadowBlur = 16;
      ctx.shadowColor = fill;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.n.r*3, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }

    // links (denser than before)
    const maxDist = Math.min(w,h)/5.2;
    ctx.lineWidth = 1;
    for (let i=0;i<pos.length;i++){
      for (let j=i+1;j<pos.length;j++){
        const a = pos[i], b = pos[j];
        const dx=a.x-b.x, dy=a.y-b.y, dist=Math.hypot(dx,dy);
        if (dist < maxDist){
          const aPulse = a.n.pulse, bPulse = b.n.pulse;
          const alpha = Math.max(0.06, 1 - dist/maxDist) * (0.7 + (aPulse+bPulse)*0.5);
          ctx.strokeStyle = COLORS.link.replace('0.22', String(alpha.toFixed(3)));
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    raf = requestAnimationFrame(draw);
  }

  function pulse(){
    nodes.forEach(n => n.pulse = Math.random()<0.10 ? 0.35 : n.pulse*0.9);
  }

  function start(){
    if (reduced) return;
    cancelAnimationFrame(raf); clearInterval(pulseTimer);
    draw(); pulseTimer = setInterval(pulse, 2000);
  }
  function stop(){ cancelAnimationFrame(raf); clearInterval(pulseTimer); }

  if (!reduced){
    init();
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState==='hidden') stop(); else start();
    });
  }
})();
