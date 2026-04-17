"use client";

import React from "react";

interface BackgroundVideoProps {
  className?: string;
}

export function BackgroundVideo({ className }: BackgroundVideoProps) {
  return (
    <div className={`fixed inset-0 -z-10 h-full w-full overflow-hidden ${className || ""}`}>
      {/* Dark Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      <video
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      >
        <source src="/bg-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
