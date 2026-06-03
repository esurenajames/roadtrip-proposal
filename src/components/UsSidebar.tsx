"use client";

import React, { useState } from 'react';
import { Heart, Users } from 'lucide-react';

export const UsSidebar: React.FC = () => {
  const [isFollowed, setIsFollowed] = useState(true);

  return (
    <div className="w-full flex flex-col gap-4 text-white h-full overflow-y-auto pr-1">
      {/* Main Cover Card */}
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square w-full bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-white/5">
          <img src="/images/crisha.jpg" alt="Crisha Reyes" className="w-full h-full object-cover" />
        </div>

        <div className="flex justify-between items-start mt-1">
          <div className="min-w-0">
            <h4 className="text-base font-bold truncate hover:underline cursor-pointer">Crisha Reyes</h4>
            <p className="text-xs text-zinc-400 truncate hover:underline cursor-pointer">my favorite kaaway</p>
          </div>
          <button
            onClick={() => setIsFollowed(!isFollowed)}
            className={`transition cursor-pointer flex-shrink-0 p-1 hover:scale-110 active:scale-95 ${isFollowed ? 'text-[#1db954]' : 'text-zinc-400'
              }`}
          >
            <Heart size={20} fill={isFollowed ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Next Adventure Card (Hanoi & Beach) */}
      <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shadow-md flex flex-col cursor-pointer hover:border-white/10 transition group">
        {/* Background Image */}
        <div className="h-32 relative flex items-end p-4 overflow-hidden">
          <img
            src="/images/lets_go_there.png"
            alt="Hanoi & Beach"
            className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <h4 className="text-xs font-bold text-white z-10 uppercase tracking-widest drop-shadow-md">Next Adventure</h4>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Users size={14} className="text-[#1db954]" />
            <span className="font-semibold text-zinc-200">Next Tour!</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            Exploring the charm of Hanoi, Vietnam and beautiful beaches around Philippines. Let's make this adventure happen!
          </p>

          <button className="w-full mt-2 bg-[#1db954] hover:bg-[#1ed760] text-black text-xs font-bold py-2.5 rounded-full transition active:scale-95 cursor-pointer shadow-md">
            Let's Go There! 🌊
          </button>
        </div>
      </div>
    </div>
  );
};
