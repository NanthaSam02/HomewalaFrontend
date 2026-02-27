import React, { useEffect } from "react";

const ChristmasOverlay = () => {
  useEffect(() => {
    const snowCharacters = ["❅", "❆", "❄", "•", "✶", "★", "●"];
    const colors = ["#FFFFFF", "#FFFFFF", "#1408fbff", "#00A86B"];

    const overlay = document.createElement("div");
    overlay.id = "christmas-overlay";
    Object.assign(overlay.style, {
      position: "fixed",
      top: "80px", // below navbar
      left: 0,
      width: "100%",
      height: "calc(100% - 80px)",
      overflow: "hidden",
      zIndex: "0",
      pointerEvents: "none",
      background: "transparent",
    });
    document.body.appendChild(overlay);

    const style = document.createElement("style");
    style.textContent = `
      .snowflake {
        position: absolute;
        top: -20px;
        user-select: none;
        opacity: 0.95;
        animation: fall linear forwards;
      }

      @keyframes fall {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(110vh) scale(0.8); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // 🌨️ Continuous snow generator
    const makeSnowflake = () => {
      const snow = document.createElement("div");
      snow.className = "snowflake";
      const character =
        snowCharacters[Math.floor(Math.random() * snowCharacters.length)];
      snow.innerText = character;

      let color = "#81d0f0ff";
      if (character === "★" || character === "●") {
        color = colors[Math.floor(Math.random() * colors.length)];
      }

      const size = 10 + Math.random() * 18;
      const left = Math.random() * window.innerWidth;
      const fallTime = 4 + Math.random() * 6;

      Object.assign(snow.style, {
        left: `${left}px`,
        fontSize: `${size}px`,
        color,
        animationDuration: `${fallTime}s`,
      });

      overlay.appendChild(snow);
      setTimeout(() => snow.remove(), fallTime * 1000);
    };

    // ❄️ Non-stop interval
    const interval = setInterval(makeSnowflake, 25);

    // cleanup only when component unmounts
    return () => {
      clearInterval(interval);
      overlay.remove();
      style.remove();
    };
  }, []);

  return null;
};

export default ChristmasOverlay;
