// AuroraBackground.js
import React from "react";

const AuroraBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#1B1B1B]">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#1B1B1B] via-[#310491]/20 to-[#1B1B1B]"></div>

    {/* Aurora effects */}
    <div className="relative w-full h-full">
      {[
        {
          className: "top-1/2 left-1/2",
          size: 800,
          colors: ["#FFC28F", "#310491"],
          opacity: 0.15,
          blur: 80,
        },
        {
          className: "top-1/4 left-1/3",
          size: 400,
          colors: ["#FFC28F"],
          opacity: 0.1,
          blur: 60,
        },
        {
          className: "bottom-1/3 right-1/4",
          size: 300,
          colors: ["#310491"],
          opacity: 0.12,
          blur: 50,
        },
      ].map((effect, index) => (
        <div
          key={index}
          className={`absolute ${effect.className} w-[${effect.size}px] h-[${effect.size}px]`}
          style={{
            background: `radial-gradient(circle at center, ${effect.colors.join(
              ","
            )} 0%, transparent 70%)`,
            filter: `blur(${effect.blur}px)`,
            opacity: effect.opacity,
            animation: "float 15s ease-in-out infinite",
          }}
        ></div>
      ))}

      {/* Moving gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(45deg, transparent 0%, #FFC28F 45%, #310491 55%, transparent 100%)`,
          filter: "blur(100px)",
          opacity: "0.08",
          animation: "moveGradient 15s linear infinite",
          backgroundSize: "200% 200%",
        }}
      ></div>
    </div>

    {/* Noise overlay */}
    <div
      className="absolute inset-0 mix-blend-overlay opacity-20"
      style={{
        backgroundImage:
          'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
      }}
    ></div>
  </div>
);

export default AuroraBackground;
