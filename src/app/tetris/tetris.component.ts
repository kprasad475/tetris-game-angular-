import { Component, OnInit, HostListener } from '@angular/core';
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

  board:number[][]=[];
  currentPiece:any;
  currentX: number = 0;
currentY: number = 0;

  initBoard() {
    for (let i = 0; i < 20; i++) {
      this.board[i] = [];
      for (let j = 0; j < 10; j++) {
        this.board[i][j] = 0;
      }
    }
  }

  spawnPiece() {
    const pieceIndex = Math.floor(Math.random() * TETROMINOES.length);
    this.currentPiece = TETROMINOES[pieceIndex];
    this.currentX = Math.floor((10 - this.currentPiece.shape[0].length) / 2);
    this.currentY = 0;
  
    if (!this.isValidPosition(this.currentX, this.currentY)) {
      // Game over logic
      this.initBoard();
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

  draw(){

  }



  rotate() {
    // Logic to rotate the piece
  }

  moveDown() {
    // Logic to move the piece down
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowUp':
        this.rotate();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
    }
  }


  ngOnInit(): void {
    this.initBoard();
    this.spawnPiece();
  }
}
