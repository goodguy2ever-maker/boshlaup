'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Rocket,
  Search,
  ArrowLeft,
  Home,
  Sparkles,
  RefreshCw,
  Trophy,
  Gamepad2,
  Compass,
  Flame
} from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [milestone, setMilestone] = useState('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef({
    rocketY: 150,
    velocity: 0,
    obstacles: [] as { x: number; y: number; size: number; speed: number; type: 'bug' | 'rock' }[],
    stars: [] as { x: number; y: number; size: number; speed: number }[],
    score: 0,
    frame: 0,
  });

  // Load highscore from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('boshlaup_404_highscore');
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    } catch {}
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  // Mini-game engine: Flappy Rocket in deep space
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const state = gameStateRef.current;

    const spawnObstacle = () => {
      const isBug = Math.random() > 0.5;
      state.obstacles.push({
        x: canvas.width + 20,
        y: Math.random() * (canvas.height - 40) + 20,
        size: isBug ? 22 : 18,
        speed: 2.5 + Math.min(state.score / 200, 3.5),
        type: isBug ? 'bug' : 'rock',
      });
    };

    const spawnStar = () => {
      state.stars.push({
        x: canvas.width + 10,
        y: Math.random() * (canvas.height - 30) + 15,
        size: 14,
        speed: 2.2,
      });
    };

    const loop = () => {
      state.frame++;

      // Physics
      state.velocity += 0.28; // gravity
      state.rocketY += state.velocity;

      // Spawn obstacles and stars
      if (state.frame % 65 === 0) {
        spawnObstacle();
      }
      if (state.frame % 90 === 0) {
        spawnStar();
      }

      // Check canvas bounds
      if (state.rocketY > canvas.height - 20) {
        state.rocketY = canvas.height - 20;
        state.velocity = 0;
      }
      if (state.rocketY < 15) {
        state.rocketY = 15;
        state.velocity = 0;
      }

      // Clear background
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 20; i++) {
        const sx = ((state.frame * 0.5 + i * 35) % canvas.width);
        const sy = (i * 27) % canvas.height;
        ctx.fillRect(canvas.width - sx, sy, 1.5, 1.5);
      }

      // Draw collected score milestone
      state.score += 1;
      setScore(state.score);

      if (state.score === 100) setMilestone('🎉 Прототип запущен!');
      if (state.score === 300) setMilestone('🚀 Первые 100 тестеров!');
      if (state.score === 600) setMilestone('🦄 Product-Market Fit!');

      // Move & draw stars (collectibles)
      for (let i = state.stars.length - 1; i >= 0; i--) {
        const star = state.stars[i];
        star.x -= star.speed;

        // Draw star
        ctx.fillStyle = '#FBBF24';
        ctx.beginPath();
        ctx.arc(star.x, star.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Check collision with rocket
        const dist = Math.hypot(star.x - 70, star.y - state.rocketY);
        if (dist < 20) {
          state.score += 50;
          state.stars.splice(i, 1);
          continue;
        }

        if (star.x < -20) state.stars.splice(i, 1);
      }

      // Move & draw obstacles
      for (let i = state.obstacles.length - 1; i >= 0; i--) {
        const obs = state.obstacles[i];
        obs.x -= obs.speed;

        // Draw obstacle
        if (obs.type === 'bug') {
          ctx.fillStyle = '#EF4444';
          ctx.font = '16px sans-serif';
          ctx.fillText('🐛', obs.x - 10, obs.y + 6);
        } else {
          ctx.fillStyle = '#94A3B8';
          ctx.beginPath();
          ctx.arc(obs.x, obs.y, 9, 0, Math.PI * 2);
          ctx.fill();
        }

        // Collision check
        const dist = Math.hypot(obs.x - 70, obs.y - state.rocketY);
        if (dist < 22) {
          setGameOver(true);
          if (state.score > highScore) {
            setHighScore(state.score);
            try {
              localStorage.setItem('boshlaup_404_highscore', String(state.score));
            } catch {}
          }
          return;
        }

        if (obs.x < -30) state.obstacles.splice(i, 1);
      }

      // Draw Rocket
      ctx.save();
      ctx.translate(70, state.rocketY);
      ctx.rotate(Math.min(Math.max(state.velocity * 0.04, -0.4), 0.5));

      // Rocket fire
      if (state.frame % 4 < 2) {
        ctx.fillStyle = '#FF5A1F';
        ctx.beginPath();
        ctx.moveTo(-16, -3);
        ctx.lineTo(-28, 0);
        ctx.lineTo(-16, 3);
        ctx.fill();
      }

      // Rocket body
      ctx.font = '24px sans-serif';
      ctx.fillText('🚀', -12, 8);
      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameStarted, gameOver, highScore]);

  const boostRocket = () => {
    if (!gameStarted) {
      startGame();
      return;
    }
    if (gameOver) {
      restartGame();
      return;
    }
    gameStateRef.current.velocity = -5.8;
  };

  const startGame = () => {
    gameStateRef.current = {
      rocketY: 140,
      velocity: -4,
      obstacles: [],
      stars: [],
      score: 0,
      frame: 0,
    };
    setScore(0);
    setMilestone('');
    setGameOver(false);
    setGameStarted(true);
  };

  const restartGame = () => {
    startGame();
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="max-w-3xl w-full text-center">
        {/* Error Code & Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF5A1F] text-xs font-black uppercase tracking-wider mb-4 animate-in fade-in">
          <Compass className="w-4 h-4 animate-spin" />
          <span>Сектор 404 • Орбита потеряна</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-3">
          Стартап не найден в каталоге
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mb-8 font-normal leading-relaxed">
          Кажется, проект сменил адрес, перешел в стелс-режим или вы ошиблись в ссылке. 
          Пока мы настраиваем радар — попробуйте запустить ракету или найдите нужный проект через поиск!
        </p>

        {/* Interactive Search Bar on 404 */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto mb-8 relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск стартапа, проблемы, фаундера..."
              className="w-full pl-11 pr-24 py-3 bg-white rounded-2xl border-2 border-slate-200 text-xs sm:text-sm font-semibold focus:border-[#FF5A1F] focus:outline-none shadow-sm transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-2 bg-[#FF5A1F] hover:bg-[#E04810] text-white text-xs font-black rounded-xl transition-all shadow-xs active:scale-95"
            >
              Найти
            </button>
          </div>
        </form>

        {/* Interactive Mini-Game Card: "BoshlaUp: Орбита стартапа" */}
        <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-slate-800 shadow-2xl mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2 font-black text-orange-400">
              <Gamepad2 className="w-4 h-4" />
              <span>Мини-игра: Запусти ракету через баги</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-bold">
              <span>Счет: <strong className="text-white">{score}</strong></span>
              <span className="flex items-center gap-1 text-amber-400">
                <Trophy className="w-3.5 h-3.5" />
                <span>{highScore}</span>
              </span>
            </div>
          </div>

          {/* Canvas Screen */}
          <div
            onClick={boostRocket}
            className="relative w-full h-64 sm:h-72 bg-[#0F172A] rounded-2xl overflow-hidden cursor-pointer select-none border border-slate-800"
          >
            <canvas
              ref={canvasRef}
              width={640}
              height={280}
              className="w-full h-full block"
            />

            {/* Start Screen Overlay */}
            {!gameStarted && (
              <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF5A1F] flex items-center justify-center mb-3 shadow-lg shadow-orange-500/30">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-white mb-1">
                  Нажмите, чтобы запустить ракету
                </h3>
                <p className="text-xs text-slate-400 max-w-xs text-center mb-4 leading-relaxed">
                  Кликайте или жмите <strong>Пробел</strong>, чтобы подниматься выше, собирать пользователей и уворачиваться от багов 🐛
                </p>
                <button
                  type="button"
                  onClick={startGame}
                  className="px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95"
                >
                  Старт миссии 🚀
                </button>
              </div>
            )}

            {/* Game Over Screen Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center p-4 animate-in fade-in">
                <p className="text-2xl mb-1">💥</p>
                <h3 className="text-lg font-black text-white mb-1">
                  Стартап столкнулся с багом!
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Вы набрали: <strong className="text-[#FF5A1F]">{score} очков</strong> {score === highScore && score > 0 ? '(Новый рекорд! 🏆)' : ''}
                </p>
                <button
                  type="button"
                  onClick={restartGame}
                  className="px-5 py-2.5 bg-[#FF5A1F] hover:bg-[#E04810] text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Попробовать снова</span>
                </button>
              </div>
            )}

            {/* In-game milestone toast */}
            {milestone && !gameOver && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#FF5A1F] text-white text-xs font-black rounded-full shadow-lg animate-bounce">
                {milestone}
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-500 mt-2 text-center">
            Управление: клик мыши / тап по экрану или клавиша «Пробел»
          </p>
        </div>

        {/* Quick Recovery Navigation Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-3 rounded-2xl bg-[#FF5A1F] hover:bg-[#E04810] text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span>Каталог стартапов</span>
          </Link>

          <Link
            href="/submit"
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm border-2 border-slate-200 flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#FF5A1F]" />
            <span>Опубликовать проект</span>
          </Link>

          <Link
            href="/community"
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs sm:text-sm border-2 border-slate-200 flex items-center gap-2 shadow-xs transition-all active:scale-95"
          >
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Сообщество</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
