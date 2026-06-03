"use client";

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles } from 'lucide-react';
import { StarryBackground } from './StarryBackground';

interface ProposalLandingProps {
  onAccept: () => void;
}

const NO_PROMPTS = [
  'no, ayoko 💔',
  'ok edi dont joke lang 😜',
  'may foods dun sagot ko 🍔',
  'hindi ka mapapagod 🚗',
  'are you sure 😢',
  'talaga ba mag tatampo ako 🥺',
  'dali na tara na 🙏',
  'last chance na to ha! 😤',
];

export const ProposalLanding: React.FC<ProposalLandingProps> = ({ onAccept }) => {
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 50, y: 70 }); // initial screen position placeholder
  const [acceptedState, setAcceptedState] = useState(false);

  const HIDE_THRESHOLD = 8; // Hide the No button after 8 attempts

  const handleNoAction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (noCount >= HIDE_THRESHOLD) {
      handleYes();
      return;
    }

    const nextCount = noCount + 1;
    setNoCount(nextCount);

    if (nextCount < HIDE_THRESHOLD) {
      // Teleport to a random position on the screen, split into 4 safe outer zones
      // to completely avoid overlapping with the centered "Yes" button (even when scaled up).
      const zone = Math.floor(Math.random() * 4);
      let randomX = 50;
      let randomY = 70;

      if (zone === 0) {
        // Top zone: full horizontal, top 10%-25% vertical
        randomX = Math.floor(Math.random() * 80) + 10;
        randomY = Math.floor(Math.random() * 15) + 10;
      } else if (zone === 1) {
        // Bottom zone: full horizontal, bottom 75%-90% vertical
        randomX = Math.floor(Math.random() * 80) + 10;
        randomY = Math.floor(Math.random() * 15) + 75;
      } else if (zone === 2) {
        // Left zone: left 10%-30% horizontal, middle 25%-75% vertical
        randomX = Math.floor(Math.random() * 20) + 10;
        randomY = Math.floor(Math.random() * 50) + 25;
      } else {
        // Right zone: right 70%-90% horizontal, middle 25%-75% vertical
        randomX = Math.floor(Math.random() * 20) + 70;
        randomY = Math.floor(Math.random() * 50) + 25;
      }

      setNoPosition({ x: randomX, y: randomY });
    }
  };

  const handleYes = () => {
    setAcceptedState(true);
    
    // Play an epic confetti shower!
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, animate a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Call parent onAccept after 2.5s confetti celebration
    setTimeout(() => {
      onAccept();
    }, 2500);
  };

  // Yes button scale factor
  const yesScale = 1 + noCount * 0.25;

  return (
    <div className="relative w-screen h-screen bg-black text-zinc-100 flex flex-col items-center justify-center overflow-hidden font-sans select-none">
      {/* Starry night sky in the background */}
      <StarryBackground />

      {/* Landing page Content */}
      <div className={`z-10 flex flex-col items-center justify-center text-center max-w-xl px-6 transition-all duration-700 ${acceptedState ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
        
        {/* Pulsing Rose/Heart Icon */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] border border-white/10 animate-[bounce_3s_infinite_alternate]">
            <Heart size={44} fill="white" className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]" />
          </div>
        </div>

        <span className="text-[11px] tracking-[0.25em] font-extrabold uppercase text-rose-400 mb-2">special invitation</span>
        
        <h1 className="font-hand text-5xl sm:text-6xl md:text-7xl text-white font-bold leading-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)] mb-4">
          Would you go on a date with me? 🌹
        </h1>
        
        <p className="text-sm sm:text-base text-zinc-400 max-w-md leading-relaxed mb-12 drop-shadow-md">
          I've put together a special road trip itinerary with our favorite songs, custom snacks, and gorgeous sightseeing spots. I hope you'll say yes! ✨
        </p>

        {/* Buttons Section - Aligned vertically with flex-col, gap-6, and min-h-220 */}
        <div className="flex flex-col items-center justify-center gap-6 min-h-[220px] relative w-full">
          {/* YES Button */}
          <button
            onClick={handleYes}
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-extrabold px-8 py-3.5 rounded-full text-sm uppercase tracking-wider shadow-2xl hover:shadow-rose-500/20 active:scale-95 transition-all duration-300 flex items-center gap-2 cursor-pointer z-20"
            style={{
              transform: `scale(${yesScale})`,
            }}
          >
            <Sparkles size={16} fill="currentColor" /> Yes, absolutely! 💖
          </button>

          {/* NO Button - Hides when reaching HIDE_THRESHOLD (8) */}
          {noCount < HIDE_THRESHOLD && (
            <button
              onClick={handleNoAction}
              onMouseEnter={handleNoAction}
              onTouchStart={handleNoAction}
              className="bg-zinc-800/80 hover:bg-zinc-700/90 text-zinc-300 font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider shadow-lg transition-all duration-150 select-none cursor-pointer"
              style={{
                position: noCount > 0 ? 'fixed' : 'relative',
                left: noCount > 0 ? `${noPosition.x}%` : 'auto',
                top: noCount > 0 ? `${noPosition.y}%` : 'auto',
                transform: noCount > 0 ? `translate(-50%, -50%) scale(${Math.max(0.5, 1 - noCount * 0.08)})` : `scale(${Math.max(0.5, 1 - noCount * 0.08)})`,
                opacity: Math.max(0.2, 1 - noCount * 0.1),
                zIndex: 10,
              }}
            >
              {NO_PROMPTS[noCount]}
            </button>
          )}
        </div>
      </div>

      {/* Success Acceptance Overlay */}
      {acceptedState && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/60 backdrop-blur-md animate-[fadeIn_0.5s_ease-out_forwards]">
          <div className="text-center p-8 max-w-sm rounded-3xl bg-zinc-950/80 border border-white/5 shadow-2xl flex flex-col items-center gap-4">
            <span className="text-6xl animate-bounce">🚗🎉</span>
            <h2 className="font-hand text-4xl text-white font-bold">Yay! Let's go!</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Preparing our custom road trip playlist and matching travel mugs... loading your itinerary!
            </p>
            <div className="w-12 h-1 border-t-2 border-rose-500 rounded animate-spin mt-2" />
          </div>
        </div>
      )}
    </div>
  );
};
