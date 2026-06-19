import { useState, useCallback, useEffect } from 'react';
import { Board, Player, WinResult, GameMode, GameStats } from '../types';

// All possible winning combinations
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

// Check if there's a winner
const checkWinner = (board: Board): WinResult | null => {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: combo };
    }
  }
  return null;
};

// Check if the board is full (draw)
const checkDraw = (board: Board): boolean => {
  return board.every(cell => cell !== null);
};

// Get available moves
const getAvailableMoves = (board: Board): number[] => {
  return board.map((cell, index) => cell === null ? index : -1).filter(i => i !== -1);
};

// AI Move Logic
const getAIMove = (board: Board, aiPlayer: Player = 'O'): number => {
  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const availableMoves = getAvailableMoves(board);

  // 1. Try to win
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = aiPlayer;
    if (checkWinner(testBoard)) return move;
  }

  // 2. Try to block
  for (const move of availableMoves) {
    const testBoard = [...board];
    testBoard[move] = humanPlayer;
    if (checkWinner(testBoard)) return move;
  }

  // 3. Take center if available
  if (board[4] === null) return 4;

  // 4. Take a corner if available
  const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length > 0) {
    return corners[Math.floor(Math.random() * corners.length)];
  }

  // 5. Take a random available cell
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

export function useGameLogic() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [winner, setWinner] = useState<WinResult | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [stats, setStats] = useState<GameStats>(() => {
    const saved = localStorage.getItem('tictactoe-stats');
    return saved ? JSON.parse(saved) : {
      playerXWins: 0,
      playerOWins: 0,
      computerWins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0
    };
  });

  // Persist stats to localStorage
  useEffect(() => {
    localStorage.setItem('tictactoe-stats', JSON.stringify(stats));
  }, [stats]);

  // Handle a player move
  const makeMove = useCallback((index: number) => {
    // Prevent moves if game is over or cell is occupied
    if (board[index] || winner || isDraw || isThinking) return;
    // In PvC mode, prevent player O moves (computer plays O)
    if (gameMode === 'PvC' && currentPlayer === 'O') return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // Check for winner after this move
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      updateStats(result.winner);
      return;
    }

    // Check for draw
    if (checkDraw(newBoard)) {
      setIsDraw(true);
      setStats(prev => ({ ...prev, draws: prev.draws + 1, totalGames: prev.totalGames + 1 }));
      return;
    }

    // Switch player
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    // If AI's turn, make AI move
    if (gameMode === 'PvC' && nextPlayer === 'O') {
      setIsThinking(true);
    }
  }, [board, currentPlayer, winner, isDraw, gameMode, isThinking]);

  // AI move effect
  useEffect(() => {
    if (gameMode === 'PvC' && currentPlayer === 'O' && isThinking && !winner && !isDraw) {
      const timer = setTimeout(() => {
        const aiMove = getAIMove(board);
        const newBoard = [...board];
        newBoard[aiMove] = 'O';
        setBoard(newBoard);

        const result = checkWinner(newBoard);
        if (result) {
          setWinner(result);
          updateStats(result.winner);
          setIsThinking(false);
          return;
        }

        if (checkDraw(newBoard)) {
          setIsDraw(true);
          setStats(prev => ({ ...prev, draws: prev.draws + 1, totalGames: prev.totalGames + 1 }));
          setIsThinking(false);
          return;
        }

        setCurrentPlayer('X');
        setIsThinking(false);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, gameMode, winner, isDraw, isThinking]);

  // Update statistics based on winner
  const updateStats = (winningPlayer: Player) => {
    setStats(prev => {
      const newStats = { ...prev, totalGames: prev.totalGames + 1 };
      if (gameMode === 'PvP') {
        if (winningPlayer === 'X') {
          newStats.playerXWins = prev.playerXWins + 1;
        } else {
          newStats.playerOWins = prev.playerOWins + 1;
        }
      } else {
        if (winningPlayer === 'O') {
          newStats.computerWins = prev.computerWins + 1;
          newStats.losses = prev.losses + 1;
        } else {
          newStats.playerXWins = prev.playerXWins + 1;
        }
      }
      return newStats;
    });
  };

  // Reset game but keep mode
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
    setIsThinking(false);
  }, []);

  // Start a new game with selected mode
  const startGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
    resetGame();
  }, [resetGame]);

  // Reset all stats
  const resetStats = useCallback(() => {
    setStats({
      playerXWins: 0,
      playerOWins: 0,
      computerWins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0
    });
    localStorage.removeItem('tictactoe-stats');
  }, []);

  return {
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
  };
}
