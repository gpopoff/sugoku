import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Board, Cell } from '../../models/sudoku.types';

@Component({
  selector: 'app-sudoku-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sudoku-board.component.html',
  styleUrls: ['./sudoku-board.component.css']
})
export class SudokuBoardComponent implements OnInit, OnChanges {
  @Input() board: Board = [];
  @Input() originalBoard: Board = [];
  @Input() validationStatus?: 'solved' | 'wrong';
  @Output() cellChange = new EventEmitter<{ row: number; col: number; value: number }>();
  @ViewChild('numberSelector', { static: false }) numberSelectorRef?: ElementRef;

  cells: Cell[][] = [];
  isMobile = false;
  showNumberSelector = false;
  activeCell: { row: number; col: number } | null = null;
  selectorPosition: { top: number; left: number } = { top: 0, left: 0 };
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  ngOnInit(): void {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
    this.initializeCells();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['board'] || changes['originalBoard']) {
      this.initializeCells();
    }
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  private initializeCells(): void {
    this.cells = this.board.map((row, rowIndex) =>
      row.map((value, colIndex) => ({
        value,
        isPrefilled: this.originalBoard[rowIndex]?.[colIndex] !== 0,
        row: rowIndex,
        col: colIndex
      }))
    );
  }

  onCellInput(event: Event, row: number, col: number): void {
    const input = event.target as HTMLInputElement;
    const cell = this.cells[row][col];

    if (cell.isPrefilled) {
      input.value = cell.value.toString();
      return;
    }

    let value = parseInt(input.value, 10);
    
    if (isNaN(value) || value < 0) {
      value = 0;
    } else if (value > 9) {
      value = 9;
    }

    input.value = value === 0 ? '' : value.toString();
    this.cells[row][col].value = value;
    this.cellChange.emit({ row, col, value });
  }

  onCellClick(event: MouseEvent | TouchEvent, row: number, col: number): void {
    const cell = this.cells[row][col];
    if (cell.isPrefilled) {
      return;
    }

    event.stopPropagation();
    const target = event.target as HTMLElement;
    const input = target.closest('.cell')?.querySelector('.cell-input') as HTMLInputElement;
    
    if (input) {
      input.focus();
      this.showNumberSelectorPopup(input, row, col);
    }
  }

  onCellFocus(event: FocusEvent, row: number, col: number): void {
    const cell = this.cells[row][col];
    if (cell.isPrefilled) {
      return;
    }

    const input = event.target as HTMLInputElement;
    this.showNumberSelectorPopup(input, row, col);
  }

  private showNumberSelectorPopup(input: HTMLInputElement, row: number, col: number): void {
    const cell = input.closest('.cell') as HTMLElement;
    if (!cell) return;

    setTimeout(() => {
      const cellRect = cell.getBoundingClientRect();
      let container = cell.parentElement;
      while (container && !container.classList.contains('relative')) {
        container = container.parentElement;
      }
      
      if (!container) {
        container = input.closest('div') as HTMLElement;
      }
      
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const popupWidth = 200;
      const popupHeight = 220;
      const spacing = 8;
      const viewportPadding = 16;

      const cellCenterX = cellRect.left + (cellRect.width / 2);
      const cellBottomY = cellRect.bottom;
      const cellTopY = cellRect.top;

      let top = cellBottomY - containerRect.top + spacing;
      let left = cellCenterX - containerRect.left - (popupWidth / 2);

      const viewportRight = window.innerWidth - viewportPadding;
      const viewportLeft = viewportPadding;
      const viewportBottom = window.innerHeight - viewportPadding;
      const viewportTop = viewportPadding;

      const popupRight = cellCenterX + (popupWidth / 2);
      const popupLeft = cellCenterX - (popupWidth / 2);

      if (popupRight > viewportRight) {
        left = viewportRight - containerRect.left - popupWidth;
      } else if (popupLeft < viewportLeft) {
        left = viewportLeft - containerRect.left;
      }

      if (left < spacing) {
        left = spacing;
      }

      if (left + popupWidth > containerRect.width - spacing) {
        left = containerRect.width - popupWidth - spacing;
      }

      const popupBottom = cellBottomY + spacing + popupHeight;
      if (popupBottom > viewportBottom) {
        top = cellTopY - containerRect.top - popupHeight - spacing;
        if (top < spacing) {
          top = spacing;
        }
      }

      if (top + popupHeight > containerRect.height - spacing) {
        top = containerRect.height - popupHeight - spacing;
        if (top < spacing) {
          top = spacing;
        }
      }

      this.selectorPosition = {
        top: Math.max(spacing, top),
        left: Math.max(spacing, left - 20)
      };

      this.activeCell = { row, col };
      this.showNumberSelector = true;
    }, 10);
  }

  onNumberSelect(event: Event, value: number): void {
    event.stopPropagation();
    if (this.activeCell) {
      const { row, col } = this.activeCell;
      this.cells[row][col].value = value;
      this.cellChange.emit({ row, col, value });
      this.closeNumberSelector();
    }
  }

  onClearCell(event: Event): void {
    event.stopPropagation();
    if (this.activeCell) {
      const { row, col } = this.activeCell;
      this.cells[row][col].value = 0;
      this.cellChange.emit({ row, col, value: 0 });
      this.closeNumberSelector();
    }
  }

  closeNumberSelector(): void {
    this.showNumberSelector = false;
    this.activeCell = null;
  }

  onCellKeyDown(event: KeyboardEvent, row: number, col: number): void {
    const cell = this.cells[row][col];
    if (cell.isPrefilled) {
      event.preventDefault();
      return;
    }

    const key = event.key;
    if (key === 'Backspace' || key === 'Delete') {
      this.cells[row][col].value = 0;
      this.cellChange.emit({ row, col, value: 0 });
      this.closeNumberSelector();
    } else if (key >= '1' && key <= '9') {
      const value = parseInt(key, 10);
      this.cells[row][col].value = value;
      this.cellChange.emit({ row, col, value });
      this.closeNumberSelector();
    } else if (key === 'Escape') {
      this.closeNumberSelector();
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.showNumberSelector && this.numberSelectorRef) {
      const target = event.target as HTMLElement;
      const clickedInsidePopup = this.numberSelectorRef.nativeElement.contains(target);
      const clickedOnCellInput = target.closest('.cell-input');
      const clickedOnCell = target.closest('.cell');
      
      if (!clickedInsidePopup && !clickedOnCellInput && !clickedOnCell) {
        this.closeNumberSelector();
      }
    }
  }

  getCellClass(cell: Cell, row: number, col: number): string {
    let classes = 'cell';
    
    if (this.validationStatus === 'solved') {
      classes += ' solved';
    } else if (this.validationStatus === 'wrong') {
      classes += ' wrong';
    }

    if (row % 3 === 2 && row < 8) {
      classes += ' border-bottom-thick';
    }
    if (col % 3 === 2 && col < 8) {
      classes += ' border-right-thick';
    }

    return classes;
  }
}

