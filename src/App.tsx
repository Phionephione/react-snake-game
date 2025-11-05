import React, { useState, useEffect, useCallback } from 'react';
import { useInterval } from './hooks/useInterval';
import { Coords, Direction } from './types';

// Game constants
const BOARD_SIZE = 20;
const INITIAL_SNAKE_POSITION: Coords[] = [{ x: 10, y: 10 }];
const INITIAL_FOOD_POSITION: Coords = { x: 5, y: 5 };
const INITIAL_DIRECTION: Direction = 'RIGHT';
const INITIAL_SPEED = 200;
const SPEED_INCREMENT = 5;

const App: React.FC = () => {
  const [snake, setSnake] = useState<Coords[]>(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState<Coords>(INITIAL_FOOD_POSITION);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [speed, setSpeed] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const generateFood = useCallback(() => {
    let newFoodPosition: Coords;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    setFood(newFoodPosition);
  }, [snake]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE_POSITION);
    generateFood();
    setDirection(INITIAL_DIRECTION);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setScore(0);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]);

  const gameLoop = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      setIsGameOver(true);
      setSpeed(null);
      return;
    }

    // Self collision
    for (let i = 1; i < newSnake.length; i++) {
      if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
        setIsGameOver(true);
        setSpeed(null);
        return;
      }
    }

    newSnake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      setScore(prev => prev + 1);
      setSpeed(prev => (prev ? Math.max(50, prev - SPEED_INCREMENT) : null));
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  useInterval(gameLoop, speed);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-mono">
      <h1 className="text-4xl font-bold mb-4">Retro Snake</h1>
      <div className="mb-4 text-2xl">Score: {score}</div>
      <div
        className="bg-nokia-fg grid border-4 border-nokia-fg shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
          width: 'min(80vw, 80vh)',
          height: 'min(80vw, 80vh)',
        }}
      >
        {isGameOver && (
          <div 
            className="col-span-full row-span-full flex flex-col items-center justify-center bg-nokia-bg bg-opacity-80 z-10"
            style={{ gridColumn: `1 / ${BOARD_SIZE + 1}`, gridRow: `1 / ${BOARD_SIZE + 1}` }}
          >
            <div className="text-4xl font-bold text-red-700">Game Over</div>
            <button 
              onClick={startGame}
              className="mt-4 px-4 py-2 bg-nokia-fg text-nokia-bg rounded-md border-2 border-nokia-bg hover:bg-nokia-bg hover:text-nokia-fg transition-colors"
            >
              Restart
            </button>
          </div>
        )}
        {!speed && !isGameOver && (
           <div 
            className="col-span-full row-span-full flex flex-col items-center justify-center bg-nokia-bg bg-opacity-80 z-10"
            style={{ gridColumn: `1 / ${BOARD_SIZE + 1}`, gridRow: `1 / ${BOARD_SIZE + 1}` }}
          >
            <button 
              onClick={startGame}
              className="mt-4 px-6 py-3 bg-nokia-fg text-nokia-bg rounded-md border-2 border-nokia-bg text-2xl hover:bg-nokia-bg hover:text-nokia-fg transition-colors"
            >
              Start Game
            </button>
          </div>
        )}
        {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, i) => {
          const x = i % BOARD_SIZE;
          const y = Math.floor(i / BOARD_SIZE);
          const isSnake = snake.some(seg => seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              className={`w-full h-full ${isSnake ? 'bg-nokia-fg' : isFood ? 'bg-nokia-fg' : 'bg-nokia-bg'}`}
              style={{ borderRadius: isFood ? '50%' : '0' }}
            ></div>
          );
        })}
      </div>
      <div className="mt-4 text-center text-sm">
        <p>Use Arrow Keys to move.</p>
      </div>
    </div>
  );
};

export default App;
