import { memo } from 'react';
import { GameBoard } from './GameBoard';
import { Scoreboard } from './Scoreboard';
import { Board, WinResult, GameStats, GameMode } from '../types';
import { Loader2 } from 'lucide-react';

interface GameProps {
  board: Board;
  currentPlayer: 'X' | 'O';
  gameMode: GameMode;
  winner: WinResult | null;
  isDraw: boolean;
  isThinking: boolean;
  stats: GameStats;
  onCellClick: (index: number) => void;
  onResetGame: () => void;
  onStartGame: (mode: GameMode) => void;
  onResetStats: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Game = memo(function Game({
  board,
  currentPlayer,
  gameMode,
  winner,
  isDraw,
  isThinking,
  stats,
  onCellClick,
  onResetGame,
  onStartGame,
  onResetStats,
  darkMode,
  onToggleDarkMode
}: GameProps) {
  const winningLine = winner?.line || [];

  // Determine if game is over
  const isGameOver = winner !== null || isDraw;

  // Get status message
  const getStatusMessage = () => {
    if (winner) {
      if (gameMode === 'PvC') {
        return winner.winner === 'X' ? 'You Win!' : 'Computer Wins!';
      }
      return winner.winner === 'X' ? 'X Wins!' : 'O Wins!';
    }
    if (isDraw) return "It's a Draw!";
    if (isThinking) return 'Computer is thinking...';
    if (gameMode === 'PvC') {
      return currentPlayer === 'X' ? 'Your Turn' : '';
    }
    return `Player ${currentPlayer}'s Turn`;
  };

  // Render mode selection
  if (!gameMode) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 animate-fade-in">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-4xl sm:text-5xl">⌇</span>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Tic-Tac-Toe
            </h1>
            <span className="text-4xl sm:text-5xl">⌇</span>
          </div>
          <p className="text-white/60 text-lg">Choose your game mode</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full max-w-md px-4">
          <button
            onClick={() => onStartGame('PvP')}
            className="flex-1 p-6 sm:p-8
              bg-gradient-to-br from-emerald-500/20 to-cyan-500/30
              hover:from-emerald-500/30 hover:to-cyan-500/40
              backdrop-blur-xl rounded-3xl
              border-2 border-white/20 hover:border-emerald-400/50
              transition-all duration-500 ease-out
              group hover:scale-[1.02] active:scale-[0.98]
              shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/30"
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform">
                👥
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Player vs Player
              </h2>
              <p className="text-white/50 text-sm">
                Challenge a friend
              </p>
            </div>
          </button>

          <button
            onClick={() => onStartGame('PvC')}
            className="flex-1 p-6 sm:p-8
              bg-gradient-to-br from-blue-500/20 to-purple-500/30
              hover:from-blue-500/30 hover:to-purple-500/40
              backdrop-blur-xl rounded-3xl
              border-2 border-white/20 hover:border-blue-400/50
              transition-all duration-500 ease-out
              group hover:scale-[1.02] active:scale-[0.98]
              shadow-xl shadow-blue-500/10 hover:shadow-blue-500/30"
          >
            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform">
                🤖
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                Player vs Computer
              </h2>
              <p className="text-white/50 text-sm">
                Play against AI
              </p>
            </div>
          </button>
        </div>

        <button
          onClick={onToggleDarkMode}
          className="mt-4 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20
            text-white/70 hover:text-white transition-all duration-300
            border border-white/10"
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 px-4 animate-slide-up">
      {/* Header with mode indicator */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-sm text-white/50 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">
            {gameMode === 'PvP' ? '👥 PvP Mode' : '🤖 PvC Mode'}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-semibold text-white/80 tracking-wide">
          {getStatusMessage()}
        </h2>
      </div>

      {/* Current player indicator (non-game-over states) */}
      {!isGameOver && !isThinking && gameMode === 'PvP' && (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
            text-xl sm:text-2xl font-bold
            ${currentPlayer === 'X'
              ? 'bg-emerald-500/30 text-emerald-300 border-2 border-emerald-400/50'
              : 'bg-rose-500/30 text-rose-300 border-2 border-rose-400/50'
            }`}
          >
            {currentPlayer}
          </div>
        </div>
      )}

      {/* Game board */}
      <div className="relative">
        {isThinking && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl z-10">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 animate-spin" />
          </div>
        )}
        <GameBoard
          board={board}
          winningLine={winningLine}
          onCellClick={onCellClick}
          disabled={isGameOver}
          isThinking={isThinking}
        />
      </div>

      {/* Scoreboard */}
      <Scoreboard
        stats={stats}
        onResetGame={onResetGame}
        onResetStats={onResetStats}
        gameMode={gameMode}
        isGameOver={isGameOver}
      />

      {/* Back button */}
      <button
        onClick={() => { onResetGame(); onStartGame(null); }}
        className="mt-2 px-6 py-2.5 text-sm rounded-xl
          bg-white/10 hover:bg-white/20
          text-white/70 hover:text-white
          transition-all duration-300 border border-white/10"
      >
        Change Mode
      </button>
    </div>
  );
});
