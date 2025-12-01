import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameState, Difficulty, Board } from '../models/sudoku.types';

const initialState: GameState = {
  board: [],
  originalBoard: [],
  difficulty: 'random',
  isSolved: false,
  isValidated: false,
  validationStatus: undefined,
  isLoading: false
};

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private stateSubject = new BehaviorSubject<GameState>(initialState);
  public state$: Observable<GameState> = this.stateSubject.asObservable();

  get currentState(): GameState {
    return this.stateSubject.value;
  }

  initializeGame(board: Board, originalBoard: Board, difficulty: Difficulty): void {
    this.updateState({
      board: this.deepCopy(board),
      originalBoard: this.deepCopy(originalBoard),
      difficulty,
      isSolved: false,
      isValidated: false,
      validationStatus: undefined,
      isLoading: false
    });
  }

  updateCell(row: number, col: number, value: number): void {
    const state = this.currentState;
    if (state.board[row] && state.board[row][col] !== undefined) {
      const newBoard = this.deepCopy(state.board);
      newBoard[row][col] = value;
      this.updateState({
        ...state,
        board: newBoard,
        isValidated: false,
        validationStatus: undefined
      });
    }
  }

  setSolved(solution: Board): void {
    const state = this.currentState;
    this.updateState({
      ...state,
      board: solution,
      isSolved: true,
      isValidated: true,
      validationStatus: 'solved'
    });
  }

  setValidationStatus(status: 'solved' | 'wrong'): void {
    const state = this.currentState;
    this.updateState({
      ...state,
      isValidated: true,
      validationStatus: status,
      isSolved: status === 'solved'
    });
  }

  setLoading(loading: boolean): void {
    this.updateState({
      ...this.currentState,
      isLoading: loading
    });
  }

  resetGame(): void {
    this.updateState(initialState);
  }

  private updateState(newState: GameState): void {
    this.stateSubject.next(newState);
  }

  private deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}

