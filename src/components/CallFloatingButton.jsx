import React from "react";

export default function CallFloatingButton({
  phone = "918925997080",
  position = "bottom-right",
  size = 64,
}) {
  const href = `tel:+${phone}`;

  const posClass = {
    "bottom-right": "bottom-36 right-6", // 👈 placed above WhatsApp
    "bottom-left": "bottom-36 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  }[position];

  return (
    <div
      className={`fixed ${posClass} z-50 flex items-center gap-3`}
      style={{
        pointerEvents: "auto",
        right: "30px", // adjust left/right
        bottom: "160px", // adjust vertical position
      }}
    >
      {/* 🔶 Call Button */}
      <a
        href="tel:+918925997080"
        aria-label="Call Now"
        className="flex items-center justify-center hover:scale-105 transition-transform duration-300"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: "#c00000ff", // coral orange for phone
          borderRadius: "20%",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
          border: "none",
          outline: "none",
        }}
      >
        {/* ☎️ White Phone Icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" width={size * 0.55} height={size * 0.55}>
  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.72 11.72 0 003.68.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17.91 17.91 0 012 6a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.01l-2.23 2.1z" />
</svg>
      </a>
    </div>
  );
}
