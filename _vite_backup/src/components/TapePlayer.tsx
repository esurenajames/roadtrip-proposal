import React, { useState, useMemo, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart, Volume2, Mic2, ListMusic } from 'lucide-react';

interface Song {
  title: string;
  artist: string;
}

const DEFAULT_PLAYLIST: Song[] = [
  { title: 'Life is a Highway', artist: 'Rascal Flatts' },
  { title: 'Fast Car', artist: 'Tracy Chapman' },
  { title: 'Put Your Records On', artist: 'Corinne Bailey Rae' },
  { title: 'Here Comes The Sun', artist: 'The Beatles' },
  { title: 'Everywhere', artist: 'Fleetwood Mac' },
  { title: 'Cruisin\'', artist: 'Huey Lewis & Gwyneth Paltrow' },
];

export const TapePlayer: React.FC = () => {
  const [playlist] = useState<Song[]>(DEFAULT_PLAYLIST);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(56); // Start at 56s like the Spotify screenshot!
  const [isLiked, setIsLiked] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const duration = 180; // 3 minutes mock duration for all songs

  const currentSong = playlist[currentIndex] || { title: 'No Song', artist: 'Unknown' };

  // Timer logic for progress bar
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setProgress(0);
    if (isShuffle) {
      const rand = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(rand);
    } else {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    }
  };

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full z-50 bg-[#121212] border-t border-zinc-800/40 py-3.5 px-6 shadow-2xl flex items-center justify-between select-none">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        {/* Left section: Cover art, song text, and Like button */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Cover Art */}
          <div className="w-14 h-14 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-md flex-shrink-0 flex items-center justify-center relative overflow-hidden shadow-md">
            <span className="text-2xl filter drop-shadow">🎵</span>
            {/* Spinning cassette wheels inside cover art as an easter egg */}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1.5">
                <div className="w-2.5 h-2.5 border border-dashed border-rose-400 rounded-full animate-spin" />
                <div className="w-2.5 h-2.5 border border-dashed border-rose-400 rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Song Info */}
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
              {currentSong.title}
            </div>
            <div className="text-xs text-zinc-400 truncate mt-0.5 hover:underline cursor-pointer">
              {currentSong.artist}
            </div>
          </div>

          {/* Like Button */}
          <button 
            onClick={() => setIsLiked(!isLiked)} 
            className={`transition cursor-pointer flex-shrink-0 p-1 hover:text-white ${
              isLiked ? 'text-[#1db954]' : 'text-zinc-400'
            }`}
            title={isLiked ? 'Remove from Library' : 'Save to Library'}
          >
            <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Middle section: Playback controls and progress bar */}
        <div className="flex flex-col items-center flex-1 max-w-xl">
          {/* Control Row */}
          <div className="flex items-center gap-5">
            <button 
              onClick={() => setIsShuffle(!isShuffle)} 
              className={`text-sm transition cursor-pointer relative ${
                isShuffle ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle size={16} />
              {isShuffle && <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1db954]" />}
            </button>

            <button 
              onClick={handlePrev} 
              className="text-zinc-400 hover:text-white transition cursor-pointer"
              title="Previous"
            >
              <SkipBack size={18} />
            </button>

            {/* Play Button (White circle, black icon) */}
            <button 
              onClick={handlePlayPause}
              className="w-8 h-8 rounded-full bg-white hover:scale-105 active:scale-95 text-black flex items-center justify-center transition shadow cursor-pointer flex-shrink-0"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
            </button>

            <button 
              onClick={handleNext} 
              className="text-zinc-400 hover:text-white transition cursor-pointer"
              title="Next"
            >
              <SkipForward size={18} />
            </button>

            <button 
              onClick={() => setIsRepeat(!isRepeat)} 
              className={`text-sm transition cursor-pointer relative ${
                isRepeat ? 'text-[#1db954]' : 'text-zinc-400 hover:text-white'
              }`}
              title="Repeat"
            >
              <Repeat size={16} />
              {isRepeat && <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1db954]" />}
            </button>
          </div>

          {/* Progress Bar Row */}
          <div className="w-full flex items-center gap-2 mt-2">
            <span className="text-[10px] text-zinc-500 font-semibold w-8 text-right select-none">{formatTime(progress)}</span>
            <div 
              className="flex-1 h-1 bg-zinc-800 hover:h-1.5 rounded-full relative group cursor-pointer transition-all"
              onClick={(e) => {
                // Interactive seeking mock
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const pct = clickX / rect.width;
                setProgress(Math.floor(pct * duration));
              }}
            >
              <div 
                className="absolute left-0 top-0 h-full bg-white group-hover:bg-[#1db954] rounded-full" 
                style={{ width: `${(progress / duration) * 100}%` }}
              />
              {/* Slider thumb dot on hover */}
              <div 
                className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-md border border-zinc-200 hidden group-hover:block -top-1 -translate-x-1/2 transition-all"
                style={{ left: `${(progress / duration) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-500 font-semibold w-8 select-none">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right section: utility controls (lyrics, queue, volume) */}
        <div className="hidden sm:flex items-center gap-3.5 justify-end flex-1 text-zinc-400">
          <button className="hover:text-white transition cursor-pointer" title="Lyrics"><Mic2 size={16} /></button>
          <button className="hover:text-white transition cursor-pointer" title="Queue"><ListMusic size={16} /></button>
          
          <div className="flex items-center gap-2 group/volume">
            <Volume2 size={16} className="text-zinc-400 group-hover/volume:text-white transition" />
            <div className="w-20 h-1 bg-zinc-800 rounded-full cursor-pointer relative group transition-all hover:h-1.5">
              <div className="absolute left-0 top-0 h-full bg-white group-hover:bg-[#1db954] rounded-full" style={{ width: '70%' }} />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
