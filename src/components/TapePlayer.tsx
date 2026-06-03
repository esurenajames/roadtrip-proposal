"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Heart, Volume2, Volume1, Volume, VolumeX, Mic2, ListMusic } from 'lucide-react';

interface Song {
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
}

const DEFAULT_PLAYLIST: Song[] = [
  {
    title: 'Para Sa Akin',
    artist: 'Sitti',
    url: '/songs/Para Sa Akin.mp3',
    coverUrl: 'https://img.youtube.com/vi/lkmcx3HFHjk/maxresdefault.jpg'
  },
  {
    title: 'Ligaya',
    artist: 'mrld',
    url: '/songs/mrld - Ligaya (Official Audio).mp3',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27353e0e906ceb4fcefc5a9bab4'
  },
  {
    title: 'Build Me Up Buttercup',
    artist: 'The Foundations',
    url: '/songs/Build Me Up Buttercup (Lyrics)  The Foundations.mp3',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27392a543e8946bddcc869dabff'
  }
];

export const TapePlayer: React.FC = () => {
  const [playlist] = useState<Song[]>(DEFAULT_PLAYLIST);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(0.7); // default volume 70%
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeBarRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const prevVolumeRef = useRef(0.7);

  const currentSong = playlist[currentIndex] || { title: 'No Song', artist: 'Unknown', url: '', coverUrl: '' };

  // Sync isPlaying with audio element play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.log("Audio play failed, waiting for user interaction:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  // Sync volume state and mute state with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Sliding support for volume
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingVolume && volumeBarRef.current) {
        const rect = volumeBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        setVolume(pct);
        if (pct > 0 && isMuted) {
          setIsMuted(false);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingVolume(false);
    };

    if (isDraggingVolume) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingVolume, isMuted]);

  // Sliding support for progress
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingProgress && progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        const seekTime = pct * duration;
        setProgress(seekTime);
        if (audioRef.current) {
          audioRef.current.currentTime = seekTime;
        }
      }
    };

    const handleMouseUp = () => {
      setIsDraggingProgress(false);
    };

    if (isDraggingProgress) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingProgress, duration]);

  // When changing song, reset progress and duration
  const changeSong = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
    setDuration(180);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (isShuffle) {
      const rand = Math.floor(Math.random() * playlist.length);
      changeSong(rand);
    } else {
      changeSong((currentIndex + 1) % playlist.length);
    }
  };

  const handlePrev = () => {
    changeSong((currentIndex - 1 + playlist.length) % playlist.length);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !isDraggingProgress) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 180);
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      }
    } else {
      handleNext();
    }
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingProgress(true);
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const seekTime = pct * duration;
    audioRef.current.currentTime = seekTime;
    setProgress(seekTime);
  };

  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingVolume(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    setVolume(pct);
    if (pct > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolumeRef.current || 0.7);
    } else {
      prevVolumeRef.current = volume;
      setIsMuted(true);
      setVolume(0);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX size={16} />;
    }
    if (volume < 0.3) {
      return <Volume size={16} />;
    }
    if (volume < 0.7) {
      return <Volume1 size={16} />;
    }
    return <Volume2 size={16} />;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full z-50 bg-[#121212] border-t border-zinc-800/40 py-3.5 px-6 shadow-2xl flex items-center justify-between select-none">
      {/* HTML5 Native Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-6">
        
        {/* Left section: Cover art, song text, and Like button */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Cover Art */}
          <div className="w-14 h-14 bg-zinc-800 rounded-md flex-shrink-0 flex items-center justify-center relative overflow-hidden shadow-md border border-white/5">
            {currentSong.coverUrl ? (
              <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl filter drop-shadow">🎵</span>
            )}
            
            {/* Spinning cassette wheels overlay inside cover art */}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-1.5 backdrop-blur-[1px]">
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

            {/* Play Button */}
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
              ref={progressBarRef}
              className={`flex-1 rounded-full relative group cursor-pointer transition-all ${isDraggingProgress ? 'h-1.5 bg-zinc-800' : 'h-1 bg-zinc-800 hover:h-1.5'}`}
              onMouseDown={handleProgressMouseDown}
            >
              <div 
                className="absolute left-0 top-0 h-full bg-white group-hover:bg-[#1db954] rounded-full" 
                style={{ width: `${(progress / duration) * 100}%` }}
              />
              {/* Slider thumb dot on hover */}
              <div 
                className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow-md border border-zinc-200 ${isDraggingProgress ? 'block -top-1' : 'hidden group-hover:block -top-1'} -translate-x-1/2 transition-all`}
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
            <button 
              onClick={handleMuteToggle}
              className="text-zinc-400 hover:text-white transition cursor-pointer flex items-center justify-center p-1"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {getVolumeIcon()}
            </button>
            <div 
              ref={volumeBarRef}
              className={`w-20 rounded-full cursor-pointer relative group/bar transition-all ${isDraggingVolume ? 'h-1.5 bg-zinc-800' : 'h-1 bg-zinc-800 hover:h-1.5'}`}
              onMouseDown={handleVolumeMouseDown}
            >
              <div className="absolute left-0 top-0 h-full bg-white group-hover/bar:bg-[#1db954] rounded-full" style={{ width: `${volume * 100}%` }} />
              <div 
                className={`absolute w-3 h-3 rounded-full bg-white shadow-md border border-zinc-200 ${isDraggingVolume ? 'block -top-1' : 'hidden group-hover/bar:block -top-1'} -translate-x-1/2 transition-all`}
                style={{ left: `${volume * 100}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
