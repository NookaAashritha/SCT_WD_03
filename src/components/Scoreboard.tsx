import { memo } from 'react';
import { GameStats } from '../types';
import { RotateCcw, Trash2 } from 'lucide-react';

interface ScoreboardProps {
  stats: GameStats;
  onResetGame: () => void;
  onResetStats: () => void;
  gameMode: 'PvP' | 'PvC' | null;
  isGameOver: boolean;
}

export const Scoreboard = memo(function Scoreboard({
  stats,
  onResetGame,
  onResetStats,
  gameMode,
  isGameOver
}: ScoreboardProps) {
  const winRate = stats.totalGames > 0
    ? Math.round(((stats.playerXWins + stats.playerOWins) / stats.totalGames) * 100)
    : 0;

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white/90">
            {gameMode === 'PvP' ? 'Player Stats' : 'Your Record'}
          </h3>
          <span className="text-sm text-white/60">
            {stats.totalGames} games
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
          {gameMode === 'PvP' ? (
            <>
              <StatBox
                label="X Wins"
                value={stats.playerXWins}
                color="emerald"
              />
              <StatBox
                label="O Wins"
                value={stats.playerOWins}
                color="rose"
              />
            </>
          ) : (
            <>
              <StatBox
                label="Wins"
                value={stats.playerXWins}
                color="emerald"
              />
              <StatBox
                label="Losses"
                value={stats.computerWins}
                color="rose"
              />
            </>
          )}
          <StatBox
            label="Draws"
            value={stats.draws}
            color="amber"
          />
          <StatBox
            label="Win %"
            value={`${winRate}%`}
            color="cyan"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onResetGame}
            disabled={!isGameOver}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5
              bg-gradient-to-r from-cyan-500 to-blue-500
              hover:from-cyan-400 hover:to-blue-400
              disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed
              rounded-xl font-semibold text-white transition-all duration-300
              shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50
              hover:scale-[1.02] active:scale-[0.98]"
          >
            <RotateCcw className="w-4 h-4" />
            {isGameOver ? 'New Game' : 'Game in Progress'}
          </button>
          <button
            onClick={onResetStats}
            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl
              text-white/70 hover:text-white transition-all duration-300
              border border-white/10"
            title="Reset all statistics"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

interface StatBoxProps {
  label: string;
  value: number | string;
  color: 'emerald' | 'rose' | 'amber' | 'cyan';
}

const StatBox = memo(function StatBox({ label, value, color }: StatBoxProps) {
  const colorClasses = {
    emerald: 'from-emerald-500/20 to-emerald-600/30 text-emerald-300 border-emerald-400/30',
    rose: 'from-rose-500/20 to-rose-600/30 text-rose-300 border-rose-400/30',
    amber: 'from-amber-500/20 to-amber-600/30 text-amber-300 border-amber-400/30',
    cyan: 'from-cyan-500/20 to-cyan-600/30 text-cyan-300 border-cyan-400/30'
  };

  return (
    <div className={`px-3 py-2.5 rounded-xl bg-gradient-to-br ${colorClasses[color]} border text-center`}>
      <div className="text-xl sm:text-2xl font-bold">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide opacity-80">{label}</div>
    </div>
  );
});
