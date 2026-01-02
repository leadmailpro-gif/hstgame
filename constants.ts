
import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const GAME_SPEED = 120;

export const AUDIO_POOL = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
];

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cybernetic Pulse',
    artist: 'AI Synth-Core',
    description: 'A driving rhythmic pulse captured from the core of a Tokyo server farm.',
    duration: 184,
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=400&h=400&auto=format&fit=crop',
    color: '#22d3ee', // Cyan
    audioUrl: AUDIO_POOL[0]
  },
  {
    id: '2',
    title: 'Neon Rainfall',
    artist: 'Lofi Generator',
    description: 'Subtle raindrops hitting a metal roof in a 2099 simulation.',
    duration: 215,
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&h=400&auto=format&fit=crop',
    color: '#ec4899', // Pink
    audioUrl: AUDIO_POOL[1]
  },
  {
    id: '3',
    title: 'Binary Sunset',
    artist: 'Neural Orchestra',
    description: 'The feeling of watching the sun dip below the horizon of a digital ocean.',
    duration: 198,
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&h=400&auto=format&fit=crop',
    color: '#a855f7', // Purple
    audioUrl: AUDIO_POOL[2]
  }
];
