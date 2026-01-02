
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction, GameState } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate }) => {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: Direction.UP,
    isGameOver: false,
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
  });

  const gameLoopRef = useRef<number | null>(null);
  const directionRef = useRef<Direction>(Direction.UP);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = snake.some(p => p.x === newFood.x && p.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: Direction.UP,
      isGameOver: false,
      score: 0,
    }));
    directionRef.current = Direction.UP;
    onScoreUpdate(0);
  };

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver) return prev;

      const head = { ...prev.snake[0] };
      const currentDir = directionRef.current;

      switch (currentDir) {
        case Direction.UP: head.y -= 1; break;
        case Direction.DOWN: head.y += 1; break;
        case Direction.LEFT: head.x -= 1; break;
        case Direction.RIGHT: head.x += 1; break;
      }

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prev, isGameOver: true };
      }

      if (prev.snake.some(p => p.x === head.x && p.y === head.y)) {
        return { ...prev, isGameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      if (head.x === prev.food.x && head.y === prev.food.y) {
        newFood = generateFood(newSnake);
        newScore += 10;
        onScoreUpdate(newScore);
      } else {
        newSnake.pop();
      }

      const newHighScore = Math.max(prev.highScore, newScore);
      if (newHighScore > prev.highScore) {
        localStorage.setItem('snakeHighScore', newHighScore.toString());
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        highScore: newHighScore,
        direction: currentDir
      };
    });
  }, [generateFood, onScoreUpdate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== Direction.DOWN) directionRef.current = Direction.UP;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== Direction.UP) directionRef.current = Direction.DOWN;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== Direction.RIGHT) directionRef.current = Direction.LEFT;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== Direction.LEFT) directionRef.current = Direction.RIGHT;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!gameState.isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, GAME_SPEED);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState.isGameOver, moveSnake]);

  return (
    <div className="retro-window p-1 shadow-md">
      <div className="title-bar mb-1">
        <span className="font-arcade text-[10px]">Snake.exe</span>
        <div className="flex gap-1">
          <div className="w-4 h-4 bg-gray-300 border border-white border-b-gray-600 border-r-gray-600 flex items-center justify-center text-black text-[10px] cursor-pointer">?</div>
          <div className="w-4 h-4 bg-gray-300 border border-white border-b-gray-600 border-r-gray-600 flex items-center justify-center text-black text-[10px] cursor-pointer">X</div>
        </div>
      </div>
      
      <div className="relative p-2">
        <div 
          className="grid bg-[#889d19] border-2 border-black overflow-hidden relative"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)',
          }}
        >
          {/* LCD Background Texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1px,transparent_0)] bg-[length:4px_4px]"></div>
          
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = gameState.snake.some(p => p.x === x && p.y === y);
            const isHead = gameState.snake[0].x === x && gameState.snake[0].y === y;
            const isFood = gameState.food.x === x && gameState.food.y === y;

            return (
              <div
                key={i}
                className={`w-full h-full border-[0.5px] border-[#7d8f16]/30 ${
                  isHead ? 'bg-black border-2 border-[#889d19]' : 
                  isSnake ? 'bg-black/80' : 
                  isFood ? 'bg-black animate-pulse flex items-center justify-center after:content-[""] after:w-2 after:h-2 after:bg-[#889d19]' : 
                  ''
                }`}
              />
            );
          })}
        </div>

        {gameState.isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4 z-10">
            <div className="retro-window w-full max-w-[280px]">
              <div className="title-bar">
                <span>Error 404</span>
                <div className="w-4 h-4 bg-gray-300 border border-white border-b-gray-600 border-r-gray-600 flex items-center justify-center text-black text-[10px] cursor-pointer" onClick={resetGame}>X</div>
              </div>
              <div className="p-4 text-center">
                <div className="mb-4 flex items-center justify-center gap-3">
                   <div className="w-10 h-10 bg-red-600 border-2 border-white rounded-full flex items-center justify-center text-white font-bold text-xl">X</div>
                   <h2 className="text-xl font-arcade leading-tight text-red-700">GAME OVER</h2>
                </div>
                <p className="mb-4 text-sm font-bold">Total Pts: {gameState.score}</p>
                <div className="flex justify-center gap-2">
                  <button onClick={resetGame} className="retro-button font-bold text-sm">Retry</button>
                  <button className="retro-button text-sm">Quit</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-2 flex justify-between bg-gray-300 border-t border-gray-600">
        <div className="retro-inset px-2 py-1 min-w-[80px] text-green-500 font-mono text-lg">
          SCORE: {gameState.score}
        </div>
        <div className="retro-inset px-2 py-1 min-w-[80px] text-red-500 font-mono text-lg">
          HI: {gameState.highScore}
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
