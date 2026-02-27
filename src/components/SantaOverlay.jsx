import React, { useEffect } from "react";
import santaVideoSrc from "../assets/Santa Claus is coming to town!.webm";

const SantaOverlay = () => {
  useEffect(() => {
    let santa = null;
    let styleTag = null;

    const enableSanta = () => {
      if (santa) return; // Already created

      santa = document.createElement("video");
      santa.src = santaVideoSrc;
      santa.autoplay = true;
      santa.loop = true;
      santa.muted = true;

      santa.style.position = "fixed";
      santa.style.left = "-200px";
      santa.style.bottom = "0px";
      santa.style.width = "260px";
      santa.style.pointerEvents = "none";
      santa.style.zIndex = "999999";

      document.body.appendChild(santa);

      styleTag = document.createElement("style");
      styleTag.innerHTML = `
        @keyframes santaCurveForward {
          0%   { transform: translateX(-200px) translateY(0); }
          25%  { transform: translateX(25vw) translateY(-40px); }
          50%  { transform: translateX(50vw) translateY(40px); }
          75%  { transform: translateX(75vw) translateY(-40px); }
          100% { transform: translateX(110vw) translateY(0); }
        }
        @keyframes santaCurveBackward {
          0%   { transform: translateX(110vw) translateY(0) scaleX(-1); }
          25%  { transform: translateX(75vw) translateY(-40px) scaleX(-1); }
          50%  { transform: translateX(50vw) translateY(40px) scaleX(-1); }
          75%  { transform: translateX(25vw) translateY(-40px) scaleX(-1); }
          100% { transform: translateX(-200px) translateY(0) scaleX(-1); }
        }
      `;
      document.head.appendChild(styleTag);

      const run = () => {
        if (!santa) return;
        santa.style.animation = "santaCurveForward 15s linear";
        setTimeout(() => {
          if (!santa) return;
          santa.style.animation = "santaCurveBackward 15s linear";
        }, 15000);
        setTimeout(run, 30000);
      };

      setTimeout(run, 300);
    };

    const disableSanta = () => {
      if (santa) {
        santa.remove();
        santa = null;
      }
      if (styleTag) {
        styleTag.remove();
        styleTag = null;
      }
    };

    const checkScreen = () => {
      if (window.innerWidth <= 1024) {
        disableSanta();  // Mobile/Tablet → Hide
      } else {
        enableSanta();  // PC → Show
      }
    };

    checkScreen(); // Run at first load

    window.addEventListener("resize", checkScreen);

    return () => {
      disableSanta();
      window.removeEventListener("resize", checkScreen);
    };
  }, []);

  return null;
};

export default SantaOverlay;
