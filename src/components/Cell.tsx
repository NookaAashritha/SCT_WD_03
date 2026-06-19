import { memo } from 'react';
import { CellValue } from '../types';

interface CellProps {
  value: CellValue;
  onClick: () => void;
  isWinningCell: boolean;
  disabled: boolean;
  isThinking: boolean;
}

export const Cell = memo(function Cell({ value, onClick, isWinningCell, disabled, isThinking }: CellProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || value !== null || isThinking}
      className={`
        w-full aspect-square
        flex items-center justify-center
        text-5xl sm:text-6xl lg:text-7xl
        font-bold
        rounded-xl
        transition-all duration-300 ease-out
        ${!value && !disabled && !isThinking
          ? 'hover:bg-white/20 hover:scale-105 cursor-pointer'
          : value === null ? 'cursor-not-allowed' : ''
        }
        ${isWinningCell
          ? 'animate-pulse bg-gradient-to-br from-yellow-400/40 to-orange-400/40 shadow-lg shadow-yellow-400/50 scale-105'
          : 'bg-white/10 backdrop-blur-sm'
        }
        disabled:opacity-80
      `}
      style={{ minHeight: '60px', maxHeight: '120px' }}
    >
      {value && (
        <span
          className={`
            ${value === 'X'
              ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]'
              : 'text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]'
            }
          `}
        >
          {value}
        </span>
      )}
    </button>
  );
});
