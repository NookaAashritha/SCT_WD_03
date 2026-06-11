import { useState, useCallback, useEffect, useRef } from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { useSound } from './hooks/useSound';
import { Game } from './components/Game';
import { Confetti } from './components/Confetti';
import { GameMode } from './types';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('tictactoe-darkmode');
    return saved !== 'false';
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSound } = useSound();
  const prevWinnerRef = useRef<boolean>(false);
  const prevDrawRef = useRef<boolean>(false);

  const {
    board,
    currentPlayer,
    gameMode,
    winner,
    isDraw,
    isThinking,
    stats,
    makeMove,
    resetGame,
    startGame,
    resetStats
  } = useGameLogic();

  // Play sounds on game events
  useEffect(() => {
    if (!soundEnabled) return;

    // Play move sound (only for player moves in PvC or any in PvP)
    if (!winner && !isDraw && board.some(cell => cell !== null)) {
      const justMoved = !prevWinnerRef.current && !prevDrawRef.current;
      if (justMoved && !winner) {
        // We can't actually detect individual moves this way, so we'll skip this
      }
    }

    // Play win/draw sounds
    if (winner && !prevWinnerRef.current) {
      playSound('win');
      prevWinnerRef.current = true;
    }
    if (isDraw && !prevDrawRef.current) {
      playSound('draw');
      prevDrawRef.current = true;
    }
  }, [winner, isDraw, soundEnabled, playSound, board, stats]);

  // Reset refs when game resets
  useEffect(() => {
    if (!winner && !isDraw) {
      prevWinnerRef.current = false;
      prevDrawRef.current = false;
    }
  }, [winner, isDraw]);

  // Play sound on move
  const handleCellClick = useCallback((index: number) => {
    if (!winner && !isDraw && !board[index] && !isThinking) {
      if (soundEnabled) {
        playSound('move');
      }
    }
    makeMove(index);
  }, [makeMove, winner, isDraw, board, isThinking, soundEnabled, playSound]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('tictactoe-darkmode', String(darkMode));
  }, [darkMode]);

  // Handle start game (reset to mode selection if null)
  const handleStartGame = useCallback((mode: GameMode) => {
    if (mode === null) {
      resetGame();
      // Force re-render to show mode selection
      window.location.reload();
    } else {
      startGame(mode);
    }
  }, [startGame, resetGame]);

  return (
    <div className={`min-h-screen w-full transition-colors duration-500
      ${darkMode
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-sky-200 via-blue-100 to-indigo-200'
      } flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8`}
    >
      {/* Background patterns */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl animate-pulse
          ${darkMode ? 'bg-cyan-500/20' : 'bg-blue-400/30'}`}
        />
        <div className={`absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl animate-pulse
          ${darkMode ? 'bg-purple-500/20' : 'bg-purple-400/30'}`}
          style={{ animationDelay: '1s' }}
        />
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-3/4 h-3/4 rounded-full blur-3xl animate-pulse
          ${darkMode ? 'bg-emerald-500/10' : 'bg-emerald-400/20'}`}
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* Sound toggle button */}
      <button
        onClick={() => setSoundEnabled(s => !s)}
        className={`fixed top-4 right-4 z-50 p-3 rounded-full backdrop-blur-xl
          transition-all duration-300 border
          ${darkMode
            ? 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
            : 'bg-black/10 border-black/20 hover:bg-black/20 text-slate-800'
          }`}
        title={soundEnabled ? 'Disable sound' : 'Enable sound'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </button>

      {/* Main game component */}
      <div className="relative z-10">
        <Game
          board={board}
          currentPlayer={currentPlayer}
          gameMode={gameMode}
          winner={winner}
          isDraw={isDraw}
          isThinking={isThinking}
          stats={stats}
          onCellClick={handleCellClick}
          onResetGame={resetGame}
          onStartGame={handleStartGame}
          onResetStats={resetStats}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(d => !d)}
        />
      </div>

      {/* Confetti on win! */}
      <Confetti isActive={winner !== null} />

      {/* Footer */}
      <div className={`fixed bottom-4 text-center text-xs sm:text-sm
        ${darkMode ? 'text-white/40' : 'text-slate-600'}`}
      >
        <span className="opacity-60">Tic-Tac-Toe</span>
        <span className="mx-2 opacity-30">•</span>
        <span className="opacity-60">Built with React</span>
      </div>
    </div>
  );
}

export default App;
