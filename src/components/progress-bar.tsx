/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  disabled: boolean;
  className?: string;
  onSeek?: (position: number) => void;
}

export function ProgressBar({
  currentTime,
  duration,
  disabled,
  className,
  onSeek,
}: ProgressBarProps) {
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const progressRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tempPosition, setTempPosition] = useState<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const calculatePosition = (clientX: number) => {
    if (!progressRef.current || disabled) return null;

    const rect = progressRef.current.getBoundingClientRect();
    const position = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );
    return position;
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !progressRef.current || disabled) return;

    const position = calculatePosition(e.clientX);
    if (position !== null) {
      const positionMs = Math.ceil(position * duration * 1000);
      onSeek(positionMs);
    }
  };

  const updatePositionFromMouse = (clientX: number) => {
    const position = calculatePosition(clientX);
    if (position !== null) {
      setTempPosition(position);
    }
  };

  const updatePositionFromTouch = (touch: React.Touch) => {
    const position = calculatePosition(touch.clientX);
    if (position !== null) {
      setTempPosition(position);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      updatePositionFromMouse(e.clientX);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      setIsDragging(true);
      updatePositionFromMouse(e.clientX);
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || disabled) return;

    if (isDragging && tempPosition !== null) {
      const positionMs = Math.ceil(tempPosition * duration * 1000);
      onSeek(positionMs);
      setTempPosition(null);
      setIsDragging(false);
    }
  };

  const handleMouseLeave = () => {
    if (isDragging && onSeek && tempPosition !== null) {
      const positionMs = Math.ceil(tempPosition * duration * 1000);
      onSeek(positionMs);
    }
    setTempPosition(null);
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!disabled) {
      setIsDragging(true);
      if (e.touches.length > 0) {
        updatePositionFromTouch(e.touches[0]);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent scrolling while dragging
    if (isDragging && e.touches.length > 0) {
      updatePositionFromTouch(e.touches[0]);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!onSeek || disabled) return;

    if (isDragging && tempPosition !== null) {
      const positionMs = Math.ceil(tempPosition * duration * 1000);
      onSeek(positionMs);
      setTempPosition(null);
      setIsDragging(false);
    }
  };

  const displayPercentage =
    isDragging && tempPosition !== null
      ? tempPosition * 100
      : progressPercentage;

  const displayTime =
    isDragging && tempPosition !== null ? tempPosition * duration : currentTime;

  return (
    <div className={cn("space-y-1 w-full", className)}>
      <div
        ref={progressRef}
        className={cn(
          "h-1.5 w-full bg-gray-200 rounded-full overflow-hidden",
          !disabled && "cursor-pointer"
        )}
        onClick={!isDragging ? handleClick : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={cn(
            "h-full bg-green-500 rounded-full",
            !isDragging && "transition-all duration-100"
          )}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(displayTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
