"use client";
import { cn } from "@/lib/utils";
import React from "react";

interface MusicPlayerBarProps {
  currentTime: number;
  duration: number;
  disabled: boolean;
  className?: string;
  onSeek?: (position: number) => void;
}

export function MusicPlayerBar({
  currentTime,
  duration,
  disabled,
  className,
  onSeek,
}: MusicPlayerBarProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [tempValue, setTempValue] = React.useState<number | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const position = parseFloat(e.target.value);
    setTempValue(position);
  };

  const handleMouseDown = () => {
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = () => {
    if (!onSeek || disabled || !isDragging) return;

    const finalValue = tempValue !== null ? tempValue : currentTime;
    const positionMs = Math.ceil(finalValue * 1000);
    onSeek(positionMs);

    setTempValue(null);
    setIsDragging(false);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  const displayValue =
    isDragging && tempValue !== null ? tempValue : currentTime;
  const sliderValue = duration > 0 ? displayValue : 0;
  const progressPercentage = duration > 0 ? (displayValue / duration) * 100 : 0;

  return (
    <div className={cn("space-y-1 w-full", className)}>
      <div className="relative">
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={sliderValue}
          disabled={disabled}
          onChange={handleSliderChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "w-full h-1.5 appearance-none bg-gray-200 rounded-full outline-none",
            "focus:ring-2 focus:ring-green-300 focus:ring-opacity-50",

            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3",
            "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500",
            "[&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:shadow-sm",
            "[&::-webkit-slider-thumb]:cursor-pointer",
            "[&::-webkit-slider-thumb:hover]:bg-green-600 [&::-webkit-slider-thumb:hover]:shadow-md",

            // Fixes for firefox
            "[&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3",
            "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-green-500",
            "[&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-sm",
            "[&::-moz-range-thumb]:cursor-pointer",
            "[&::-moz-range-thumb:hover]:bg-green-600 [&::-moz-range-thumb:hover]:shadow-md",

            "[&::-moz-focus-outer]:border-0",

            !disabled && "cursor-pointer",
            disabled &&
              "opacity-50 cursor-not-allowed [&::-webkit-slider-thumb]:bg-gray-400 [&::-webkit-slider-thumb]:cursor-not-allowed [&::-moz-range-thumb]:bg-gray-400 [&::-moz-range-thumb]:cursor-not-allowed"
          )}
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${progressPercentage}%, #e5e7eb ${progressPercentage}%, #e5e7eb 100%)`,
          }}
          aria-label="Music progress"
          aria-valuetext={`${formatTime(displayValue)} of ${formatTime(
            duration
          )}`}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatTime(displayValue)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
