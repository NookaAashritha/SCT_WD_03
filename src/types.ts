export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type Board = CellValue[];

export interface WinResult {
  winner: Player;
  line: number[];
}

export interface GameStats {
  playerXWins: number;
  playerOWins: number;
  computerWins: number;
  losses: number;
  draws: number;
  totalGames: number;
}

export type GameMode = 'PvP' | 'PvC' | null;
