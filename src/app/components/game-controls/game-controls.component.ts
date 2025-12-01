import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '../../pipes/titlecase.pipe';
import { Difficulty, GameState } from '../../models/sudoku.types';

@Component({
  selector: 'app-game-controls',
  standalone: true,
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './game-controls.component.html',
  styleUrls: ['./game-controls.component.css']
})
export class GameControlsComponent {
  @Input() gameState!: GameState;
  @Output() startGame = new EventEmitter<Difficulty>();
  @Output() validateBoard = new EventEmitter<void>();
  @Output() solveBoard = new EventEmitter<void>();
  @Output() resetGame = new EventEmitter<void>();

  selectedDifficulty: Difficulty = 'random';
  difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'random'];

  onStartGame(): void {
    if (this.gameState.isLoading) return;
    this.startGame.emit(this.selectedDifficulty);
  }

  onValidateBoard(): void {
    if (this.gameState.isLoading || this.gameState.board.length === 0 || this.gameState.isSolved) return;
    this.validateBoard.emit();
  }

  onSolveBoard(): void {
    if (this.gameState.isLoading || this.gameState.board.length === 0 || this.gameState.isSolved) return;
    this.solveBoard.emit();
  }

  onResetGame(): void {
    if (this.gameState.isLoading || this.gameState.board.length === 0) return;
    this.resetGame.emit();
  }
}

