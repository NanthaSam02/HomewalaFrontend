import React, { useEffect } from "react";

const DiwaliOverlay = () => {
  useEffect(() => {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.id = "diwali-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "9999";
    overlay.style.background = "transparent";
    document.body.appendChild(overlay);

    // ===== Fireworks Canvas =====
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    overlay.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let w = canvas.width;
    let h = canvas.height;
    let particles = [];
    const colors = ["#FFD700", "#FFA500", "#ff4400ff", "#ff0026ff", "#fff200ff"];

    function resizeCanvas() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);

    function createParticle(x, y) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const velocity = Math.random() * 4 + 1;
      const angle = Math.random() * 2 * Math.PI;
      return {
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 60,
        color,
      };
    }

    function drawParticle(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fill();
    }

    function update() {
      ctx.clearRect(0, 0, w, h);

      // random fireworks burst
      if (Math.random() < 0.05) {
        const x = Math.random() * w;
        const y = Math.random() * h * 0.4;
        for (let i = 0; i < 80; i++) particles.push(createParticle(x, y));
      }

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.01;
        p.life--;
        if (p.life <= 0) particles.splice(i, 1);
        drawParticle(p);
      });

      requestAnimationFrame(update);
    }
    update();

    // ===== Sparkle Trail Only =====
    const sparkContainer = document.createElement("div");
    sparkContainer.className = "spark-container";
    document.body.appendChild(sparkContainer);

    function createSparkle() {
      const spark = document.createElement("div");
      spark.className = "spark";
      spark.style.left = Math.random() * 100 + "%";
      spark.style.animationDuration = Math.random() * 3 + 2 + "s";
      sparkContainer.appendChild(spark);
      setTimeout(() => spark.remove(), 5000);
    }
    const sparkleInterval = setInterval(createSparkle, 150);

    // ===== Add Style =====
    const style = document.createElement("style");
    style.innerHTML = `
      .spark-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: 9998;
      }
      .spark {
        position: absolute;
        top: -10px;
        width: 4px;
        height: 4px;
        background: gold;
        border-radius: 50%;
        box-shadow: 0 0 10px gold;
        animation: fall linear forwards;
      }
      @keyframes fall {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(100vh) scale(0.5); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // ===== Cleanup =====
    const timer = setTimeout(() => {
      overlay.remove();
      sparkContainer.remove();
      style.remove();
    }, 10000);

    return () => {
      clearTimeout(timer);
      overlay.remove();
      sparkContainer.remove();
      style.remove();
      clearInterval(sparkleInterval);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return null;
};

export default DiwaliOverlay;
