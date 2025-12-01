export type Difficulty = "easy" | "medium" | "hard" | "random";
export type Board = Array<Array<number>>;

export interface BoardResponse {
  board: Board;
}

export interface SudokuRequest {
  board: Board;
}

export interface SolveResponse {
  difficulty: Difficulty;
  solution: Board;
  status: "solved" | "wrong" | "unsolvable";
}

export interface ValidateResponse {
  status: "solved" | "wrong";
}

export interface Cell {
  value: number;
  isPrefilled: boolean;
  row: number;
  col: number;
}

export interface GameState {
  board: Board;
  originalBoard: Board;
  difficulty: Difficulty;
  isSolved: boolean;
  isValidated: boolean;
  validationStatus?: "solved" | "wrong";
  isLoading: boolean;
}

