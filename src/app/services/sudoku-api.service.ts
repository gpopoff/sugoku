import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoardResponse, ValidateResponse, SolveResponse, SudokuRequest, Difficulty } from '../models/sudoku.types';

@Injectable({
  providedIn: 'root'
})
export class SudokuApiService {
  private readonly baseUrl = 'https://sugoku.onrender.com';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })
  };

  constructor(private http: HttpClient) {}

  getBoard(difficulty: Difficulty = 'random'): Observable<BoardResponse> {
    return this.http.get<BoardResponse>(`${this.baseUrl}/board?difficulty=${difficulty}`);
  }

  validateBoard(board: number[][]): Observable<ValidateResponse> {
    const body = this.encodeBoard(board);
    return this.http.post<ValidateResponse>(`${this.baseUrl}/validate`, body, this.httpOptions);
  }

  solveBoard(board: number[][]): Observable<SolveResponse> {
    const body = this.encodeBoard(board);
    return this.http.post<SolveResponse>(`${this.baseUrl}/solve`, body, this.httpOptions);
  }

  private encodeBoard(board: number[][]): string {
    const encodeBoardArray = (board: number[][]): string => {
      return board.reduce((result, row, i) => {
        return result + `%5B${encodeURIComponent(row.toString())}%5D${i === board.length - 1 ? '' : '%2C'}`;
      }, '');
    };

    const encoded = encodeBoardArray(board);
    return `board=%5B${encoded}%5D`;
  }
}

