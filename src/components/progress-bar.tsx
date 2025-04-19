"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  className?: string;
  onSeek?: (position: number) => void;
}

export function ProgressBar({
  currentTime,
  duration,
  className,
  onSeek,
}: ProgressBarProps) {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressRef = React.useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const position = (e.clientX - rect.left) / rect.width;
    onSeek(position * duration);
  };

  return (
    <div className={cn("space-y-1 w-full", className)}>
      <div
        ref={progressRef}
        className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <div
          className="h-full bg-green-500 rounded-full transition-all duration-100"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
