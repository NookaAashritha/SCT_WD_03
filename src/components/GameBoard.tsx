import { memo } from 'react';
import { Cell } from './Cell';
import { Board, WinResult } from '../types';

interface GameBoardProps {
  board: Board;
  winningLine: number[];
  onCellClick: (index: number) => void;
  disabled: boolean;
  isThinking: boolean;
}

export const GameBoard = memo(function GameBoard({ board, winningLine, onCellClick, disabled, isThinking }: GameBoardProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] p-4 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl bg-white/5 backdrop-blur-xl shadow-2xl">
      {board.map((cell, index) => (
        <Cell
          key={index}
          value={cell}
          onClick={() => onCellClick(index)}
          isWinningCell={winningLine.includes(index)}
          disabled={disabled}
          isThinking={isThinking}
        />
      ))}
    </div>
  );
});
