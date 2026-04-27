"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

interface BackgroundVideoProps {
  src: string;
  overlayOpacity?: string; // e.g. "bg-black/40"
  videoOpacity?: string; // e.g. "opacity-40"
  className?: string;
}

export function BackgroundVideo({
  src,
  overlayOpacity = "bg-black/60",
  videoOpacity = "opacity-30",
  className
}: BackgroundVideoProps) {
  return (
    <div className={cn("fixed inset-0 z-0 pointer-events-none h-full w-full overflow-hidden bg-background-primary", className)}>
      {/* Dark Overlay to ensure text readability */}
      <div className={cn("absolute inset-0 z-10 transition-opacity duration-1000", overlayOpacity)} />

      <video
        autoPlay
        muted
        loop
        playsInline
        className={cn("absolute inset-0 z-0 h-full w-full object-cover scale-110", videoOpacity)} // Slight scale to avoid edge artifacts
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
