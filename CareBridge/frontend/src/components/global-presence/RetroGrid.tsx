import React from 'react';

interface RetroGridProps {
  className?: string;
  angle?: number;
}

export default function RetroGrid({ className = '', angle = 65 }: RetroGridProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden opacity-50 [perspective:200px] ${className}`}
      style={{ zIndex: 0 }}
    >
      {/* Grid Grid Lines */}
      <div className="absolute inset-0 [transform-style:preserve-3d]">
        <div
          className="animate-grid absolute -inset-[100%] [transform-origin:100%_0_0]"
          style={{
            transform: `rotateX(${angle}deg)`,
            backgroundImage: `linear-gradient(to right, rgba(14, 165, 233, 0.15) 1px, transparent 0), linear-gradient(to bottom, rgba(14, 165, 233, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            animation: 'retroGridMove 25s linear infinite',
          }}
        />
      </div>

      {/* Top Background Gradient Fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
      
      <style>{`
        @keyframes retroGridMove {
          0% { transform: rotateX(${angle}deg) translateY(0); }
          100% { transform: rotateX(${angle}deg) translateY(40px); }
        }
      `}</style>
    </div>
  );
}
