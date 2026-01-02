
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, Sparkles, Loader2, Minus, Square } from 'lucide-react';
import { Track } from '../types';
import { DUMMY_TRACKS, AUDIO_POOL } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

const MusicPlayer: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>(DUMMY_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = tracks[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback error", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setProgress(0);
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const skipBackward = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    setProgress(0);
    if (isPlaying) {
      setTimeout(() => audioRef.current?.play(), 100);
    }
  };

  const generateNeuralBeat = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Suggest a name, artist, and a short 1-sentence sci-fi/vaporwave description for a new electronic music track. Be creative and cool.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              description: { type: Type.STRING },
              hexColor: { type: Type.STRING, description: "A hex color code" }
            },
            required: ["title", "artist", "description", "hexColor"]
          }
        }
      });

      const data = JSON.parse(response.text);
      
      const newTrack: Track = {
        id: Date.now().toString(),
        title: data.title,
        artist: data.artist,
        description: data.description,
        duration: 180 + Math.floor(Math.random() * 60),
        cover: `https://picsum.photos/seed/${data.title.replace(/\s/g, '')}/400/400`,
        color: data.hexColor || '#22d3ee',
        audioUrl: AUDIO_POOL[Math.floor(Math.random() * AUDIO_POOL.length)]
      };

      setTracks(prev => [newTrack, ...prev]);
      setCurrentTrackIndex(0);
      setIsPlaying(true);
      setTimeout(() => audioRef.current?.play(), 100);
    } catch (error) {
      console.error("Composition error", error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', skipForward);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', skipForward);
    };
  }, [currentTrackIndex, tracks]);

  return (
    <div className="retro-window w-full max-w-md shadow-lg overflow-hidden relative">
      <div className="title-bar">
        <div className="flex items-center gap-2">
           <Music size={12} />
           <span className="font-arcade text-[10px]">WinBeats Player v1.0</span>
        </div>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-gray-300 border border-white border-b-gray-600 border-r-gray-600 flex items-center justify-center text-black text-[10px] cursor-pointer hover:bg-gray-400">_</div>
          <div className="w-4 h-4 bg-gray-300 border border-white border-b-gray-600 border-r-gray-600 flex items-center justify-center text-black text-[10px] cursor-pointer hover:bg-gray-400">X</div>
        </div>
      </div>

      <div className="p-4 bg-gray-300 flex flex-col gap-4">
        {/* Main Display Area */}
        <div className="retro-inset p-3 flex gap-4 h-32 text-green-500 font-mono relative overflow-hidden">
           {/* LCD Background Pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#0f0_1px,transparent_0)] bg-[length:2px_2px]"></div>
          
          <img src={currentTrack.cover} alt="Cover" className="w-24 h-24 border border-green-900 grayscale opacity-80" />
          
          <div className="flex-1 flex flex-col justify-between z-10">
            <div>
              <div className="text-sm truncate uppercase tracking-widest">{currentTrack.title}</div>
              <div className="text-xs truncate opacity-70">{currentTrack.artist}</div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {Math.floor((audioRef.current?.currentTime || 0) / 60)}:{String(Math.floor((audioRef.current?.currentTime || 0) % 60)).padStart(2, '0')}
              </span>
              <div className="flex-1 h-4 border border-green-900 flex items-center px-0.5">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-2.5 w-1 mx-[1px] ${isPlaying && i < 10 ? 'bg-green-500 animate-pulse' : 'bg-green-900'}`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Slider */}
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-bold text-gray-700">POS:</span>
           <div className="flex-1 h-3 retro-inset bg-black relative">
              <div 
                className="absolute top-0 bottom-0 bg-blue-800 border-r-2 border-white"
                style={{ width: `${progress}%` }}
              />
           </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <button onClick={skipBackward} className="retro-button p-1"><SkipBack size={14} fill="black"/></button>
            <button onClick={togglePlay} className="retro-button p-1 min-w-[50px] flex justify-center">
              {isPlaying ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" />}
            </button>
            <button className="retro-button p-1"><Square size={14} fill="black"/></button>
            <button onClick={skipForward} className="retro-button p-1"><SkipForward size={14} fill="black"/></button>
          </div>

          <button 
            onClick={generateNeuralBeat} 
            disabled={isGenerating}
            className="retro-button text-[9px] font-arcade uppercase flex items-center gap-2 text-blue-800 disabled:opacity-50"
          >
            {isGenerating ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
            Compose
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack.audioUrl} />

      {/* AI Process Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 z-30 bg-black/50 flex items-center justify-center p-6">
          <div className="retro-window w-full max-w-[200px] p-4 text-center">
             <div className="mb-2 text-xs font-bold font-arcade animate-pulse">GENERATING...</div>
             <div className="h-4 retro-inset p-0.5">
                <div className="h-full bg-blue-800 animate-[loading_1.5s_infinite]" style={{ width: '30%' }}></div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
