import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

/**
 * DiwaliLamp component
 * - Hidden automatically on small screens (width < 640px OR height < 800px)
 * - Uses inline <style> media query so Tailwind not required
 * - IMPORTANT: parent must be position: relative for absolute positioning to work
 */

const DiwaliLamp = () => {
  return (
    <>
     

      <div
        className="diwali-lamp show"
        style={{
          position: "absolute",
          // tweak these values to place the lamp relative to the parent container
          right: "60px",
          top: "20px",
          width: "120px",
          height: "120px",
          zIndex: 40,
          pointerEvents: "none",
          mixBlendMode: "screen",
          
        }}
        aria-hidden="true"
      >
        {/* Lottie animation */}
        <DotLottieReact
          src="https://lottie.host/e31a43fc-c9fa-4de8-9f84-f5bef6537f73/YT1z1xt9vp.lottie"
          loop
          autoplay
          speed={0.3}
          style={{ width: "100%", height: "100%" }}
        />

        {/* fallback (uncomment to test quickly) */}
        {/* <div style={{width:'100%', height:'100%', background: 'radial-gradient(circle at 30% 30%, #ffd966, #ff8a00)', borderRadius: '50%'}} /> */}
      </div>
    </>
  );
};

export default DiwaliLamp;
