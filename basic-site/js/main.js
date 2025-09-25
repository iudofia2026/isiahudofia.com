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
