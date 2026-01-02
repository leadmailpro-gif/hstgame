
import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Trophy, Gamepad2, Headphones, Monitor, FileText, Folder } from 'lucide-react';

const App: React.FC = () => {
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#008080] relative flex flex-col p-4 overflow-hidden">
      {/* Desktop Icons */}
      <div className="absolute top-6 left-6 flex flex-col gap-8 z-0">
        <div className="flex flex-col items-center gap-1 group cursor-pointer w-16">
          <div className="p-1 hover:bg-blue-600/30 rounded border border-transparent group-active:bg-blue-800 group-active:border-white">
            <Monitor className="text-white" size={32} />
          </div>
          <span className="text-white text-[12px] font-bold text-center leading-none">My Computer</span>
        </div>
        <div className="flex flex-col items-center gap-1 group cursor-pointer w-16">
          <div className="p-1 hover:bg-blue-600/30 rounded border border-transparent group-active:bg-blue-800 group-active:border-white">
            <Folder className="text-yellow-400" size={32} fill="currentColor" />
          </div>
          <span className="text-white text-[12px] font-bold text-center leading-none">Games</span>
        </div>
        <div className="flex flex-col items-center gap-1 group cursor-pointer w-16">
          <div className="p-1 hover:bg-blue-600/30 rounded border border-transparent group-active:bg-blue-800 group-active:border-white">
            <FileText className="text-white" size={32} />
          </div>
          <span className="text-white text-[12px] font-bold text-center leading-none">ReadMe.txt</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 relative z-10">
        {/* Snake Window */}
        <div className="drop-shadow-[10px_10px_0px_rgba(0,0,0,0.2)]">
          <SnakeGame onScoreUpdate={setCurrentScore} />
        </div>

        {/* Player Window */}
        <div className="drop-shadow-[10px_10px_0px_rgba(0,0,0,0.2)]">
          <MusicPlayer />
        </div>
      </div>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-10 bg-gray-300 border-t-2 border-white shadow-[inset_0_1px_0_var(--win-dark-grey)] flex items-center px-1 gap-1 z-50">
        <button className="retro-button h-8 flex items-center gap-2 font-bold text-sm hover:bg-gray-400">
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Windows_95_logo.png" alt="start" className="h-5" />
          Start
        </button>
        <div className="w-px h-6 bg-gray-400 mx-1" />
        
        <div className="retro-inset px-3 py-1 bg-gray-300 h-8 flex items-center gap-2">
           <Gamepad2 size={16} />
           <span className="font-bold text-xs uppercase hidden sm:block">Snake.exe</span>
        </div>

        <div className="flex-1" />

        <div className="retro-inset px-2 py-1 bg-gray-300 h-8 flex items-center gap-3">
           <div className="flex gap-1 items-center border-r border-gray-400 pr-3 mr-1">
             <Trophy size={14} className="text-yellow-600" />
             <span className="font-bold text-xs">{currentScore} PTS</span>
           </div>
           <span className="font-mono text-sm font-bold">
             {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </span>
        </div>
      </div>

      {/* Scanline CRT Overlay */}
      <div className="crt-overlay" />
    </div>
  );
};

export default App;
