"use client";

import React, { useMemo, useEffect, useState } from 'react';

interface Star {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

interface ShootingStar {
  id: number;
  top: string;
  left: string;
  delay: string;
}

export const StarryBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate random stars once on client mount
  const stars = useMemo(() => {
    if (!mounted) return [];
    const starList: Star[] = [];
    for (let i = 0; i < 100; i++) {
      const top = `${Math.random() * 100}%`;
      const left = `${Math.random() * 100}%`;
      const size = `${Math.random() * 2 + 1}px`;
      const delay = `${Math.random() * 5}s`;
      const duration = `${Math.random() * 4 + 2}s`;
      starList.push({ id: i, top, left, size, delay, duration });
    }
    return starList;
  }, [mounted]);

  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      const id = Date.now();
      const top = `${Math.random() * 50}%`;
      const left = `${Math.random() * 80}%`;
      const delay = '0s';
      
      setShootingStars((prev) => [...prev, { id, top, left, delay }]);

      // Remove after animation finishes (1s)
      setTimeout(() => {
        setShootingStars((prev) => prev.filter((star) => star.id !== id));
      }, 1000);
    }, 6000); // Shoot every 6 seconds

    return () => clearInterval(interval);
  }, [mounted]);

  if (!mounted) {
    return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            // @ts-ignore
            animation: `twinkle ${star.duration} infinite ease-in-out ${star.delay}`,
          }}
        />
      ))}

      {shootingStars.map((sStar) => (
        <div
          key={sStar.id}
          className="absolute w-0.5 h-0.5 bg-gradient-to-r from-white to-transparent shadow-[0_0_10px_white,0_0_20px_white] -rotate-[35deg] pointer-events-none"
          style={{
            top: sStar.top,
            left: sStar.left,
            animation: 'shoot 1s linear forwards',
          }}
        />
      ))}

      {/* Styled animation for shooting stars in CSS in-line for convenience */}
      <style>{`
        @keyframes shoot {
          0% {
            width: 0px;
            transform: translate(0, 0) rotate(-35deg);
            opacity: 1;
          }
          10% {
            width: 80px;
          }
          100% {
            width: 0px;
            transform: translate(300px, 210px) rotate(-35deg);
            opacity: 0;
          }
        }

        .road-camper-van {
          position: fixed;
          bottom: 2px;
          left: -100px;
          width: 60px;
          height: 35px;
          z-index: 1;
          pointer-events: none;
          animation: driveAcross 25s linear infinite;
          opacity: 0.15;
        }

        @keyframes driveAcross {
          0% {
            left: -100px;
            transform: scaleX(1);
          }
          48% {
            left: 105%;
            transform: scaleX(1);
          }
          50% {
            left: 105%;
            transform: scaleX(-1);
          }
          98% {
            left: -100px;
            transform: scaleX(-1);
          }
          100% {
            left: -100px;
            transform: scaleX(1);
          }
        }
      `}</style>

      {/* Little SVG camper van driving along the bottom */}
      <svg className="road-camper-van" viewBox="0 0 64 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 22H60V26C60 27.1 59.1 28 58 28H6C4.9 28 4 27.1 4 26V22Z" fill="#ff6b8b" />
        <path d="M6 10H50V22H6V10Z" fill="#f5f6fa" />
        <path d="M50 12H58C59.1 12 60 12.9 60 14V22H50V12Z" fill="#a5b1c2" />
        <rect x="10" y="13" width="10" height="6" rx="1" fill="#2d263b" />
        <rect x="25" y="13" width="10" height="6" rx="1" fill="#2d263b" />
        <rect x="40" y="13" width="6" height="6" rx="1" fill="#2d263b" />
        {/* Wheels */}
        <circle cx="16" cy="27" r="4.5" fill="#2d263b" stroke="#f5f6fa" strokeWidth="2" />
        <circle cx="48" cy="27" r="4.5" fill="#2d263b" stroke="#f5f6fa" strokeWidth="2" />
      </svg>
    </div>
  );
};
