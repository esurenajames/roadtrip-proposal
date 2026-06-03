import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Compass, Sparkles, MapPin, Search, ChevronLeft, ChevronRight, Library, HelpCircle } from 'lucide-react';
import { StarryBackground } from './components/StarryBackground';
import { TapePlayer } from './components/TapePlayer';
import { UsSidebar } from './components/UsSidebar';
export interface Stop {
  id: string;
  name: string;
  activities: string[];
  description: string;
  emoji: string;
  gradient: string;
  image?: string;
}

import './index.css';

const INITIAL_STOPS: Stop[] = [
  {
    id: '2',
    name: 'Riverbanks Center',
    emoji: '🛍️',
    description: 'Marikina\'s vibrant riverfront hub. Catch a scenic breeze by the riverbanks, stroll through the outlet shops, and check out the historic giant shoe display.',
    activities: ['Marikina Riverfront walk', 'Outlet mall shopping', 'Giant shoe viewing'],
    gradient: 'linear-gradient(135deg, #f39c12 0%, #d35400 100%)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Marikina_River_from_Riverbanks_Center%2C_Dec_2023.jpg',
  },
  {
    id: '3',
    name: 'Cloud 9 360',
    emoji: '🌉',
    description: 'Perched high in the hills of Antipolo, this spot offers a thrilling walk across the hanging bridge and a breathtaking 360-degree view of the metropolitan skyline.',
    activities: ['Hanging bridge crossing', '360° deck sunset viewing', 'Skyline photography'],
    gradient: 'linear-gradient(135deg, #e91e63 0%, #ff9800 100%)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/67/Cloud9Antipolojf0969_14.JPG',
  },
  {
    id: '4',
    name: 'Pinto Art Museum',
    emoji: '🎨',
    description: 'A stunning door to modern Philippine art. Stroll through sun-drenched Mediterranean galleries, explore green courtyards, and enjoy a coffee surrounded by beautiful masterpieces.',
    activities: ['Contemporary art tour', 'Mediterranean garden stroll', 'Café Rizal dining'],
    gradient: 'linear-gradient(135deg, #9b59b6 0%, #3498db 100%)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Pinto_Art_Museum_Entrance%2C_Antipolo%2C_Rizal.jpg',
  },
];

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

const NO_PROMPTS = [
  'No',
  'Are you sure? 🥺',
  'But there will be unlimited snacks! 🍿',
  'I made a special road trip playlist! 🎵',
  'We will take lots of Polaroid pics! 📸',
  'What if I drive the whole way? 🚗',
  'Please say yes? ❤️',
  'You are breaking my heart... 💔',
  'Okay, I am removing this button now! 😉',
];

function App() {
  const [isAccepted, setIsAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [stops] = useState<Stop[]>(INITIAL_STOPS);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);

  const handleYes = () => {
    setIsAccepted(true);
    // Play confetti explosion!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleNo = () => {
    if (noCount >= NO_PROMPTS.length - 1) {
      // Force Accept if she clicks too many times!
      handleYes();
      return;
    }

    setNoCount((prev) => prev + 1);

    // Randomize position within container boundaries
    const randomX = (Math.random() - 0.5) * 200; // -100px to 100px
    const randomY = (Math.random() - 0.5) * 80;  // -40px to 40px
    setNoPosition({ x: randomX, y: randomY });
  };

  const handleNoHover = () => {
    // Only teleport on hover after the first click attempt
    if (noCount > 0) {
      handleNo();
    }
  };

  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Spawn floating heart on user click (only trigger heart on background click, not on buttons)
    if ((e.target as HTMLElement).tagName === 'BUTTON' || (e.target as HTMLElement).closest('button')) {
      return;
    }

    const id = Date.now();
    const x = e.clientX;
    const y = e.clientY;
    
    setFloatingHearts((prev) => [...prev, { id, x, y }]);
    
    // Remove heart after animation (2s)
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((heart) => heart.id !== id));
    }, 2000);
  };

  // Selected stop helper
  const currentStop = stops[activeStopIndex] || stops[0];

  return (
    <div className="relative w-screen h-screen bg-black text-zinc-200 font-sans flex flex-col select-none overflow-hidden" onClick={handleScreenClick}>
      {/* Dynamic Starry Sky and Camper van */}
      <StarryBackground />

      {/* Floating Hearts Overlay */}
      {floatingHearts.map((heart) => (
        <span
          key={heart.id}
          className="absolute pointer-events-none text-rose-500 animate-[floatUp_2s_linear_forwards] z-40"
          style={{
            left: heart.x - 10,
            top: heart.y - 10,
          }}
        >
          <Heart size={20} fill="currentColor" />
        </span>
      ))}

      {/* TOP HEADER BAR */}
      <header className="flex items-center justify-between h-14 bg-black px-6 flex-shrink-0 z-20">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 cursor-not-allowed">
            <ChevronLeft size={20} />
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 cursor-not-allowed">
            <ChevronRight size={20} />
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="w-full bg-zinc-900 border border-white/5 rounded-full px-4 py-2 flex items-center gap-2 hover:bg-zinc-800 transition cursor-pointer">
            <Search size={16} className="text-zinc-400" />
            <span className="text-xs text-zinc-400 font-medium">What do you want to play?</span>
          </div>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-zinc-900 border border-white/5 pl-2 pr-3 py-1.5 rounded-full text-xs font-semibold hover:bg-zinc-800 transition cursor-pointer">
            <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-[10px]">
              CR
            </div>
            <span className="text-white">Crisha Reyes</span>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT SPLIT */}
      <main className="flex flex-row flex-1 overflow-hidden h-[calc(100vh-128px)] p-2 gap-2 z-10 relative">
        {/* LEFT COLUMN: Stops library */}
        <section className="w-72 bg-zinc-950 p-4 rounded-xl flex flex-col gap-4 flex-shrink-0 h-full border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2.5 pb-2 border-b border-zinc-900">
            <Library size={18} className="text-zinc-400" />
            <span className="font-bold text-sm tracking-wide text-zinc-400">Your Library</span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-1 pr-1">
            {stops.map((stop, idx) => {
              const isActive = idx === activeStopIndex;
              return (
                <div
                  key={stop.id}
                  onClick={() => setActiveStopIndex(idx)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition select-none ${
                    isActive 
                      ? 'bg-zinc-900 text-white' 
                      : 'hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg ${stop.image ? '' : 'bg-gradient-to-tr ' + stop.gradient} overflow-hidden flex items-center justify-center flex-shrink-0 border border-white/5`}>
                    {stop.image ? (
                      <img src={stop.image} alt={stop.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{stop.emoji}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-[#1db954]' : ''}`}>
                      {stop.name}
                    </h4>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-0.5">
                      Stopover • {idx + 1}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MIDDLE COLUMN: Proposal & Active Stopover details */}
        <section className="flex-1 bg-zinc-900/40 border border-white/5 rounded-xl overflow-y-auto h-full flex flex-col gap-6 relative shadow-inner">
          {/* Main Cover Proposal Banner */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-rose-950/80 to-zinc-900/10 flex flex-col md:flex-row gap-6 items-end relative overflow-hidden flex-shrink-0 border-b border-white/5">
            <div className="w-36 h-36 sm:w-40 sm:h-40 bg-gradient-to-tr from-rose-500 to-amber-500 rounded-2xl shadow-2xl flex flex-col items-center justify-center flex-shrink-0 relative overflow-hidden border border-white/10">
              <span className="text-5xl filter drop-shadow">🚗</span>
              <span className="text-[10px] tracking-widest font-black uppercase text-rose-200 mt-2 bg-black/30 px-2 py-0.5 rounded">ROAD TRIP</span>
            </div>

            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-300">ROAD TRIP PROPOSAL</span>
              <h1 className="font-['Caveat'] text-4xl sm:text-5xl md:text-6xl text-white font-extrabold tracking-wide leading-none drop-shadow">
                Road Trip with Me, Crisha?
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 leading-relaxed max-w-xl">
                I've mapped out a gorgeous journey just for us, filled with cool mountain breezes, retro cassette tunes, and cozy campfire nights. What do you say?
              </p>

              {/* Proposal Buttons Row */}
              <div className="flex items-center gap-4 mt-4 relative min-h-[50px]">
                {isAccepted ? (
                  <span className="px-4 py-2 bg-[#1db954] text-black font-bold rounded-full text-xs flex items-center gap-1.5 animate-[fadeInUp_0.3s_ease] shadow-lg">
                    <Sparkles size={14} /> Proposal Accepted! Let's pack! 🚗💨
                  </span>
                ) : (
                  <>
                    {/* YES button */}
                    <button
                      onClick={handleYes}
                      className="bg-[#1db954] hover:bg-[#1ed760] text-black font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition cursor-pointer flex items-center gap-1.5 shadow-lg select-none"
                      style={{
                        transform: `scale(${yesScale})`,
                        zIndex: 10,
                      }}
                    >
                      <Heart size={14} fill="currentColor" /> Yes, Let's Go!
                    </button>

                    {/* NO button */}
                    {noCount < NO_PROMPTS.length - 1 && (
                      <button
                        onClick={handleNo}
                        onMouseEnter={handleNoHover}
                        className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold px-5 py-2.5 rounded-full text-xs uppercase tracking-wider transition hover:scale-105 active:scale-95 cursor-pointer select-none"
                        style={{
                          position: noCount > 0 ? 'absolute' : 'relative',
                          left: noCount > 0 ? `${noPosition.x}px` : 'auto',
                          top: noCount > 0 ? `${noPosition.y}px` : 'auto',
                          transition: noCount > 0 ? 'all 0.15s ease-out' : 'none',
                          opacity: Math.max(0.3, 1 - noCount * 0.1),
                          transform: `scale(${Math.max(0.6, 1 - noCount * 0.08)})`,
                        }}
                      >
                        {NO_PROMPTS[noCount] || 'No'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Active Stopover Content */}
          <div className="px-6 pb-28 flex flex-col gap-8">
            {/* Destination Info */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase">
                <Compass size={14} /> stopover details
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{currentStop.name}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">{currentStop.description}</p>
              
              {/* Destination Hero Image */}
              <div className="w-full max-w-2xl h-72 sm:h-80 rounded-2xl overflow-hidden border border-white/5 shadow-lg relative mt-2">
                {currentStop.image ? (
                  <img src={currentStop.image} alt={currentStop.name} className="w-full h-full object-cover filter brightness-[0.85] saturate-[1.05]" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-zinc-900 to-zinc-800 flex items-center justify-center">
                    <span className="text-6xl">{currentStop.emoji}</span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 text-[10px] text-white/95 uppercase tracking-widest bg-black/60 px-3 py-1 rounded backdrop-blur-sm z-10 font-bold border border-white/5">
                  destination stop {stops.indexOf(currentStop) + 1}
                </div>
              </div>
            </div>

            {/* Activities Table (Spotify Tracklist Replica) */}
            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">Itinerary Tracks</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Planned activities for this destination</p>
              </div>

              <div className="flex flex-col mt-2">
                {/* Tracklist Header */}
                <div className="border-b border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-500 pb-2 mb-2 grid grid-cols-12 px-4">
                  <div className="col-span-1">#</div>
                  <div className="col-span-10">Activity Title</div>
                  <div className="col-span-1 text-right">Status</div>
                </div>

                {/* Track rows */}
                {currentStop.activities.map((activity, index) => (
                  <div 
                    key={index}
                    className="grid grid-cols-12 items-center px-4 py-3 rounded-lg hover:bg-white/5 transition group cursor-pointer text-sm text-zinc-300 hover:text-white"
                  >
                    <div className="col-span-1 text-zinc-500 text-xs font-semibold group-hover:text-white">
                      {index + 1}
                    </div>
                    <div className="col-span-10 font-medium truncate">
                      {activity}
                    </div>
                    <div className="col-span-1 text-right text-zinc-500 text-xs group-hover:text-white">
                      ✨
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prep & Essentials (Spotify "Album Credits" style) */}
            <div className="border-t border-white/5 pt-8 flex flex-col gap-6">
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">Roadtrip Prep & Essentials</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Static context lists of what you should bring</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gear Card */}
                <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400">Essential Gear 🎒</h4>
                  <ul className="text-xs text-zinc-400 list-none p-0 flex flex-col gap-2 mt-1">
                    <li>📸 Polaroid / Instant Camera</li>
                    <li>🔋 High-capacity Powerbank</li>
                    <li>🗺️ Offline Maps pre-loaded</li>
                    <li>🍫 Road snacks & iced drinks</li>
                  </ul>
                </div>

                {/* Clothes Card */}
                <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400">Cozy Wear 🧥</h4>
                  <ul className="text-xs text-zinc-400 list-none p-0 flex flex-col gap-2 mt-1">
                    <li>🧥 Warm sweaters & jackets</li>
                    <li>👟 Comfortable sneakers</li>
                    <li>🕶️ Sunglasses for the drive</li>
                    <li>🧣 Light scarf for late night</li>
                  </ul>
                </div>

                {/* Vibes Card */}
                <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-purple-400">Vibes & Comfort 🕶️</h4>
                  <ul className="text-xs text-zinc-400 list-none p-0 flex flex-col gap-2 mt-1">
                    <li>🎶 Cassette mixtape ready</li>
                    <li>😊 Cozy travel pillows</li>
                    <li>✨ Golden hour photo spots</li>
                    <li>❤️ An open heart & huge smiles</li>
                  </ul>
                </div>
              </div>

              {/* Context alert */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3 text-xs text-zinc-400">
                <HelpCircle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-200">Travel Context Warning:</span> Sunny afternoon drives transitioning to cool mountain breezes in the evening. Keep your sunglasses and a jacket handy!
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Us detail sidebar */}
        <section className="w-72 bg-zinc-950 p-4 rounded-xl flex flex-col flex-shrink-0 h-full border border-white/5 shadow-2xl">
          <UsSidebar />
        </section>
      </main>

      {/* FOOTER: Music Player (Sticky Spotify bottom bar) */}
      <TapePlayer />
    </div>
  );
}

export default App;
