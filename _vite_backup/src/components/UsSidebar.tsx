import React from 'react';
import { Heart, Users } from 'lucide-react';

export const UsSidebar: React.FC = () => {
  return (
    <div className="w-full flex flex-col gap-6 text-white h-full overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-900">
        <span className="font-bold text-sm tracking-wide text-zinc-200">Us View</span>
      </div>

      {/* Main Cover Card */}
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square w-full bg-gradient-to-tr from-rose-500 to-amber-500 rounded-xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/25">
            <span className="text-6xl filter drop-shadow-[0_8px_16px_rgba(244,63,94,0.4)]">💑</span>
            <span className="font-['Caveat'] text-4xl text-white font-bold mt-4 tracking-wide drop-shadow">Crisha & Me</span>
            <span className="text-xs text-rose-200 mt-1 uppercase tracking-widest font-semibold">established 2026</span>
          </div>
        </div>

        <div className="flex justify-between items-start mt-1">
          <div className="min-w-0">
            <h3 className="text-base font-bold truncate hover:underline cursor-pointer">Crisha & Me</h3>
            <p className="text-xs text-zinc-400 truncate hover:underline cursor-pointer">Her Favorite Person</p>
          </div>
          <button className="text-[#1db954] hover:scale-105 active:scale-95 transition cursor-pointer">
            <Heart size={20} fill="currentColor" />
          </button>
        </div>
      </div>

      {/* About Us Card (Spotify "About the Artist" replica) */}
      <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shadow-md flex flex-col cursor-pointer hover:border-white/10 transition">
        {/* Background Image/Gradient */}
        <div className="h-36 bg-gradient-to-br from-rose-600 to-indigo-900 relative flex items-end p-4">
          <div className="absolute inset-0 bg-black/40" />
          <h4 className="text-xs font-bold text-white z-10 uppercase tracking-widest">About Us</h4>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Users size={14} className="text-[#1db954]" />
            <span className="font-semibold text-zinc-200">1,955,202 monthly smiles</span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            A match made in heaven, perfectly tuned for long highway drives, out-of-tune car karaoke, unlimited snacks, and finding the best scenic overlooks. Always adventure bound!
          </p>

          <button className="w-full mt-2 bg-transparent hover:bg-white/5 border border-zinc-600 hover:border-white text-white text-xs font-bold py-2 rounded-full transition active:scale-95 cursor-pointer">
            Active Status: In Love ❤️
          </button>
        </div>
      </div>
    </div>
  );
};
