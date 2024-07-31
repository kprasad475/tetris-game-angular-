import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const TETROMINOES = [
  { shape: [[1, 1, 1, 1]], color: 'cyan' }, // I
  { shape: [[1, 1], [1, 1]], color: 'yellow' }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: 'purple' }, // T
  { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' }, // Z
  { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' }, // S
  { shape: [[1, 1, 1], [1, 0, 0]], color: 'blue' }, // J
  { shape: [[1, 1, 1], [0, 0, 1]], color: 'orange' } // L
];

@Component({
  selector: 'app-tetris',
  templateUrl: './tetris.component.html',
  styleUrl: './tetris.component.css'
})
export class TetrisComponent implements OnInit {

  board: number[][] = [];
  currentPiece: any = null;
  currentX: number = 0;
  currentY: number = 0;
  isBrowser: boolean;
  score: number = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.initBoard();
    this.spawnPiece();
    this.draw();
  }

  initBoard() {
    this.board = Array.from({ length: 20 }, () => Array(10).fill(0));
  }

  checkForCompleteLines() {
    let linesCleared = 0;
    for (let y = this.board.length - 1; y >= 0; y--) {
      if (this.board[y].every(cell => cell !== 0)) {
        this.board.splice(y, 1);
        this.board.unshift(Array(10).fill(0));
        linesCleared++;
        y++;
      }
    }
    this.updateScore(linesCleared);
  }

  updateScore(linesCleared: number) {
    const points = [0, 100, 300, 500, 800];
    this.score += points[linesCleared];
  }

  spawnPiece() {
    const pieceIndex = Math.floor(Math.random() * TETROMINOES.length);
    this.currentPiece = TETROMINOES[pieceIndex];
    this.currentX = Math.floor((10 - this.currentPiece.shape[0].length) / 2);
    this.currentY = 0;

    if (!this.isValidPosition(this.currentX, this.currentY)) {
      // Game over logic
      this.initBoard();
      alert('Game Over');
    }
  }

  isValidPosition(x: number, y: number): boolean {
    for (let row = 0; row < this.currentPiece.shape.length; row++) {
      for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
        if (this.currentPiece.shape[row][col] &&
            (this.board[y + row] && this.board[y + row][x + col]) !== 0) {
          return false;
        }
      }
    }
    return true;
  }

  moveLeft() {
    if (this.isValidPosition(this.currentX - 1, this.currentY)) {
      this.currentX--;
      this.draw();
    }
  }

  moveRight() {
    if (this.isValidPosition(this.currentX + 1, this.currentY)) {
      this.currentX++;
      this.draw();
    }
  }

  rotate() {
    const newShape = this.currentPiece.shape[0].map((_: number, colIndex: number) => 
      this.currentPiece.shape.map((row: number[]) => row[colIndex]).reverse()
    );
    
    const originalShape = this.currentPiece.shape;
    this.currentPiece.shape = newShape;

    if (!this.isValidPosition(this.currentX, this.currentY)) {
      this.currentPiece.shape = originalShape; // Revert rotation if invalid
    } else {
      this.draw();
    }
  }

  moveDown() {
    if (this.isValidPosition(this.currentX, this.currentY + 1)) {
      this.currentY++;
    } else {
      this.placePiece();
      this.checkForCompleteLines();
      this.spawnPiece();
    }
    this.draw();
  }

  placePiece() {
    for (let row = 0; row < this.currentPiece.shape.length; row++) {
      for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
        if (this.currentPiece.shape[row][col]) {
          this.board[this.currentY + row][this.currentX + col] = 1;
        }
      }
    }
  }

  draw() {
    if (!this.isBrowser) return;

    const canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tileSize = 20; // Size of each tile

    // Draw the board
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col]) {
          ctx.fillStyle = 'grey';
          ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
        }
      }
    }

    // Draw the current piece
    if (this.currentPiece) {
      ctx.fillStyle = this.currentPiece.color;
      for (let row = 0; row < this.currentPiece.shape.length; row++) {
        for (let col = 0; col < this.currentPiece.shape[row].length; col++) {
          if (this.currentPiece.shape[row][col]) {
            ctx.fillRect((this.currentX + col) * tileSize, (this.currentY + row) * tileSize, tileSize, tileSize);
          }
        }
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isBrowser) return;

    switch (event.key) {
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      case 'ArrowUp':
        this.rotate();
        break;
    }
  }
}
