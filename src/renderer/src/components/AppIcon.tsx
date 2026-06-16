import React from "react"

interface AppIconProps {
  size?: number
  className?: string
}

const AppIcon: React.FC<AppIconProps> = ({ size = 28, className }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background rounded rect */}
      <defs>
        <linearGradient id="icon-bg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="icon-line" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
        </linearGradient>
      </defs>

      {/* Center diamond (skill) */}
      <path
        d="M14 4 L22 14 L14 24 L6 14 Z"
        fill="white"
        opacity="0.95"
      />

      {/* Inner diamond accent */}
      <path
        d="M14 7.5 L19.5 14 L14 20.5 L8.5 14 Z"
        fill="url(#icon-bg)"
        opacity="0.85"
      />

      {/* Connecting lines from center to tool dots */}
      <line x1="14" y1="14" x2="23" y2="8" stroke="url(#icon-line)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="14" x2="23" y2="21" stroke="url(#icon-line)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="14" x2="7" y2="23" stroke="url(#icon-line)" strokeWidth="1.2" strokeLinecap="round" />

      {/* Tool dots */}
      <circle cx="23.5" cy="7.5" r="2" fill="white" opacity="0.9" />
      <circle cx="23.5" cy="21.5" r="2" fill="white" opacity="0.9" />
      <circle cx="6.5" cy="23.5" r="2" fill="white" opacity="0.9" />
    </svg>
  )
}

export default AppIcon
