import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SudokuBoardComponent } from './components/sudoku-board/sudoku-board.component';
import { GameControlsComponent } from './components/game-controls/game-controls.component';
import { SudokuApiService } from './services/sudoku-api.service';
import { GameStateService } from './services/game-state.service';
import { Difficulty, GameState } from './models/sudoku.types';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SudokuBoardComponent, GameControlsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  gameState: GameState = {
    board: [],
    originalBoard: [],
    difficulty: 'random',
    isSolved: false,
    isValidated: false,
    validationStatus: undefined,
    isLoading: false
  };

  private destroy$ = new Subject<void>();

  constructor(
    private sudokuApi: SudokuApiService,
    private gameStateService: GameStateService
  ) {}

  ngOnInit(): void {
    this.gameStateService.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.gameState = state;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onStartGame(difficulty: Difficulty): void {
    if (this.gameState.isLoading) return;

    this.gameStateService.setLoading(true);
    this.sudokuApi.getBoard(difficulty).subscribe({
      next: (response) => {
        const originalBoard = response.board.map(row => [...row]);
        this.gameStateService.initializeGame(response.board, originalBoard, difficulty);
        this.gameStateService.setLoading(false);
      },
      error: (error) => {
        console.error('Error loading board:', error);
        alert('Failed to load Sudoku board. Please try again.');
        this.gameStateService.setLoading(false);
      }
    });
  }

  onCellChange(event: { row: number; col: number; value: number }): void {
    this.gameStateService.updateCell(event.row, event.col, event.value);
  }

  onValidateBoard(): void {
    if (this.gameState.isLoading || this.gameState.board.length === 0) return;

    this.gameStateService.setLoading(true);
    this.sudokuApi.validateBoard(this.gameState.board).subscribe({
      next: (response) => {
        this.gameStateService.setValidationStatus(response.status);
        this.gameStateService.setLoading(false);
        
        if (response.status === 'solved') {
          alert('Congratulations! You solved the puzzle! 🎉');
        } else {
          alert('The board has some errors. Please check your solution.');
        }
      },
      error: (error) => {
        console.error('Error validating board:', error);
        alert('Failed to validate board. Please try again.');
        this.gameStateService.setLoading(false);
      }
    });
  }

  onSolveBoard(): void {
    if (this.gameState.isLoading || this.gameState.board.length === 0) return;

    if (!confirm('This will automatically solve the puzzle. Are you sure?')) {
      return;
    }

    this.gameStateService.setLoading(true);
    this.sudokuApi.solveBoard(this.gameState.originalBoard).subscribe({
      next: (response) => {
        if (response.status === 'solved') {
          this.gameStateService.setSolved(response.solution);
          this.gameStateService.setLoading(false);
        } else {
          alert('Unable to solve this puzzle.');
          this.gameStateService.setLoading(false);
        }
      },
      error: (error) => {
        console.error('Error solving board:', error);
        alert('Failed to solve board. Please try again.');
        this.gameStateService.setLoading(false);
      }
    });
  }

  onResetGame(): void {
    if (this.gameState.board.length === 0) return;
    
    if (confirm('Are you sure you want to reset the game?')) {
      const originalBoard = this.gameState.originalBoard.map(row => [...row]);
      this.gameStateService.initializeGame(originalBoard, originalBoard, this.gameState.difficulty);
    }
  }
}

