"use client";
import React, { useState, useEffect } from 'react';
import { Heart, Compass, Sparkles, Search, ChevronLeft, ChevronRight, Library, HelpCircle } from 'lucide-react';
import { StarryBackground } from './StarryBackground';
import { TapePlayer } from './TapePlayer';
import { UsSidebar } from './UsSidebar';

export interface Stop {
  id: string;
  name: string;
  activities: string[];
  description: string;
  emoji: string;
  gradient: string;
  images: string[];
}

const INITIAL_STOPS: Stop[] = [
  {
    id: '2',
    name: 'Riverbanks Center',
    emoji: '🛍️',
    description: 'Marikina\'s vibrant riverfront hub. Catch a scenic breeze by the riverbanks, stroll through the outlet shops, and check out the historic giant shoe display.',
    activities: ['lunch kain 🍴'],
    gradient: 'linear-gradient(135deg, #f39c12 0%, #d35400 100%)',
    images: [
      'https://media.interaksyon.com/wp-content/uploads/2022/10/ChristmasSaya-Carnival.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/2/2e/00571jfMarikina_River_Park_Banks_Barangka_Landmarks_Calumpangfvf_08.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Riverbanks_Center_Marikina_%28Metro_Manila%3B_2023-08-11%29_E911a_10.jpg/1280px-Riverbanks_Center_Marikina_%28Metro_Manila%3B_2023-08-11%29_E911a_10.jpg',
      'https://i0.wp.com/travelmarikina.wordpress.com/wp-content/uploads/2015/08/14115585.jpg?fit=1200%2C900&ssl=1'
    ],
  },
  {
    id: '3',
    name: 'Cloud 9 360',
    emoji: '🌉',
    description: 'Perched high in the hills of Antipolo, this spot offers a thrilling walk across the hanging bridge and a breathtaking 360-degree view of the metropolitan skyline.',
    activities: ['Segway (before mag pinto museum) 🛴', 'Skyline photography'],
    gradient: 'linear-gradient(135deg, #e91e63 0%, #ff9800 100%)',
    images: [
      'https://www.thepoortraveler.net/wp-content/uploads/2021/02/Cloud-9-Antipolo-1.jpg',
      'https://www.thepoortraveler.net/wp-content/uploads/2021/02/Cloud-9-Hanging-Bridge.jpg',
      'https://static.wixstatic.com/media/dc41dd_0b1c88a82ab6479faeb45f5760fc0dd0~mv2_d_2236_2232_s_2.jpg/v1/fill/w_1000,h_998,al_c,q_85,usm_0.66_1.00_0.01/dc41dd_0b1c88a82ab6479faeb45f5760fc0dd0~mv2_d_2236_2232_s_2.jpg',
      'https://i0.wp.com/www.traveling-up.com/wp-content/uploads/2020/09/cloud-9-antipolo-360-view-deck-mountains-sky.jpg?fit=600%2C400&ssl=1'
    ],
  },
  {
    id: '4',
    name: 'Pinto Art Museum',
    emoji: '🎨',
    description: 'A stunning door to modern Philippine art. Stroll through sun-drenched Mediterranean galleries, explore green courtyards, and enjoy a coffee surrounded by beautiful masterpieces.',
    activities: ['Main point of the roadtrip 🎨❤️', 'Art tour'],
    gradient: 'linear-gradient(135deg, #9b59b6 0%, #3498db 100%)',
    images: [
      'https://www.filipinoart.ph/newsroom/wp-content/uploads/2020/04/Pinto-Art-2.jpg',
      'https://thebohotravels.com/wp-content/uploads/2014/04/Pinto-Art-Museum-The-Boho-Travels.jpeg',
      'https://i0.wp.com/filipeanut.art/wp-content/uploads/2021/06/IMG_4541-Gallery-1-Pinto-Art-Museum-1.jpg?resize=1024%2C660&ssl=1',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/f6/9b/15/modern-art-sanctuary.jpg?w=1200&h=-1&s=1'
    ],
  }
];

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
}

export const RoadtripApp: React.FC = () => {
  const [stops] = useState<Stop[]>(INITIAL_STOPS);
  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [activeStopIndex]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsHeaderScrolled(scrollTop > 240);
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

  const handlePrevStop = () => {
    setActiveStopIndex((prev) => (prev - 1 + stops.length) % stops.length);
  };

  const handleNextStop = () => {
    setActiveStopIndex((prev) => (prev + 1) % stops.length);
  };

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
        <div className="flex items-center gap-6">
          {/* Datetify App Icon and Name */}
          <div className="flex items-center gap-2.5 select-none">
            <img src="/road-trip.svg" alt="Datetify Icon" className="w-7 h-7 filter invert" style={{ filter: 'brightness(0) saturate(100%) invert(53%) sepia(84%) saturate(417%) hue-rotate(93deg) brightness(97%) contrast(90%)' }} />
            <span className="text-[#1db954] font-black text-xl tracking-tight">Datetify</span>
          </div>

          {/* Navigation buttons - Clicking left/right moves the stopover selection up and down the list */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStop}
              className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
              title="Previous Stopover"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextStop}
              className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
              title="Next Stopover"
            >
              <ChevronRight size={20} />
            </button>
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
            <img src="/images/crisha.jpg" alt="Crisha Reyes" className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
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
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition select-none ${isActive
                    ? 'bg-zinc-900 text-white'
                    : 'hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-lg ${(stop.images && stop.images[0]) ? '' : 'bg-gradient-to-tr ' + stop.gradient} overflow-hidden flex items-center justify-center flex-shrink-0 border border-white/5`}>
                    {(stop.images && stop.images[0]) ? (
                      <img src={stop.images[0]} alt={stop.name} className="w-full h-full object-cover" />
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
        <section
          onScroll={handleScroll}
          className="flex-1 bg-zinc-900/40 border border-white/5 rounded-xl overflow-y-auto h-full flex flex-col relative shadow-inner"
        >
          {/* Sticky Playlist Header (Spotify-style) */}
          <div className={`sticky top-0 left-0 right-0 h-30 py-2 flex flex-col justify-center px-6 z-30 transition-all duration-300 ${isHeaderScrolled
            ? 'bg-[#1c0208]/95 backdrop-blur-md border-b border-white/5 opacity-100 pointer-events-auto'
            : 'bg-transparent border-b border-transparent opacity-0 pointer-events-none'
            }`}>
            <span className="font-extrabold text-white text-base tracking-tight leading-tight">Us</span>
            <span className="text-[11px] text-zinc-400 font-medium leading-normal mt-0.5 truncate max-w-xl">
              First roadtrip ulit after many years.
            </span>
          </div>

          {/* Main Cover Proposal Banner - Replicating Spotify's Playlist Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-rose-950/80 to-zinc-900/10 flex flex-col md:flex-row gap-6 items-end relative overflow-hidden flex-shrink-0 -mt-20 pt-24">
            {/* Larger Cover Image */}
            <div className="w-48 h-48 mt-8 sm:w-56 sm:h-56 bg-zinc-900 rounded-md shadow-2xl flex-shrink-0 relative overflow-hidden border border-white/10">
              <img src="/images/us.jpg" alt="Us" className="w-full h-full object-cover" />
            </div>

            {/* Align text elements with bottom of the image */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Public Playlist</span>

              <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-none tracking-tighter mt-1 mb-2">
                Us
              </h1>

              <p className="text-sm text-zinc-300 font-medium">
                First roadtrip ulit after many years.
              </p>

              <div className="flex items-center gap-2 mt-3 flex-wrap text-xs text-zinc-300">
                <div className="font-semibold flex items-center gap-1.5 flex-wrap">
                  <span className="text-white hover:underline cursor-pointer">James Esureña</span>
                  <span>and</span>
                  <span className="text-white hover:underline cursor-pointer">queencrish</span>
                  <span className="text-zinc-400 font-normal">•</span>
                  <span>1 save</span>
                  <span className="text-zinc-400 font-normal">•</span>
                  <span>3 stops, 8 hours and 58 mins of travel time</span>
                  <span className="text-zinc-400 font-normal">•</span>
                  <span className="text-[#1db954] flex items-center gap-1">
                    <Sparkles size={12} /> Accepted 🚗💨
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-28 flex flex-col gap-8 mt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase">
                <Compass size={14} /> stopover details
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{currentStop.name}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">{currentStop.description}</p>

              {/* Destination Gallery */}
              <div className="flex flex-col gap-3 max-w-2xl w-full mt-2">
                {/* Main Big Image */}
                <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-white/5 shadow-lg relative">
                  {currentStop.images && currentStop.images[selectedImageIndex] ? (
                    <img
                      src={currentStop.images[selectedImageIndex]}
                      alt={`${currentStop.name} ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover filter brightness-[0.85] saturate-[1.05] transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-zinc-900 to-zinc-800 flex items-center justify-center">
                      <span className="text-6xl">{currentStop.emoji}</span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 text-[10px] text-white/95 uppercase tracking-widest bg-black/60 px-3 py-1 rounded backdrop-blur-sm z-10 font-bold border border-white/5 select-none">
                    destination stop {stops.indexOf(currentStop) + 1} • image {selectedImageIndex + 1} of {currentStop.images?.length || 1}
                  </div>
                </div>

                {/* Thumbnails below */}
                <div className="grid grid-cols-4 gap-3 w-full">
                  {currentStop.images && currentStop.images.map((imgUrl, imgIdx) => {
                    const isSelected = imgIdx === selectedImageIndex;
                    return (
                      <div
                        key={imgIdx}
                        onClick={() => setSelectedImageIndex(imgIdx)}
                        className={`h-16 rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 hover:scale-[1.03] active:scale-95 ${isSelected
                          ? 'border-[#1db954] ring-2 ring-[#1db954]/20 shadow-md'
                          : 'border-white/5 hover:border-white/20'
                          }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${currentStop.name} thumb ${imgIdx + 1}`}
                          className={`w-full h-full object-cover transition duration-300 ${isSelected ? 'brightness-[0.95] saturate-[1.05]' : 'brightness-[0.6] hover:brightness-[0.85]'
                            }`}
                        />
                      </div>
                    );
                  })}
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

              <div className="max-w-2xl">
                {/* Packing Checklist Card */}
                <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-rose-400">What to Bring 🎒</h4>
                  <ul className="text-xs text-zinc-400 list-none p-0 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 mt-1">
                    <li className="flex items-center gap-2">📱 Phone</li>
                    <li className="flex items-center gap-2">🔋 Powerbank</li>
                    <li className="flex items-center gap-2">💧 Water</li>
                    <li className="flex items-center gap-2">👗 Your OOTD dress</li>
                    <li className="flex items-center gap-2">❤️ Yourself</li>
                    <li className="flex items-center gap-2">💄 Makeups para 'di haggard</li>
                    <li className="flex items-center gap-2">🍿 Snacks (baka mapagod driver)</li>
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
        <section className="w-72 bg-zinc-950 p-4 rounded-xl flex flex-col flex-shrink-0 h-full border border-white/5 shadow-2xl overflow-hidden">
          <UsSidebar />
        </section>
      </main>

      {/* FOOTER: Music Player (Sticky Spotify bottom bar) */}
      <TapePlayer />
    </div>
  );
};
