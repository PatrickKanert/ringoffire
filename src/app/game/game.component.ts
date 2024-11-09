import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Game } from '../../models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { MaterialModule } from '../materials/material.module';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MaterialModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  games$;

  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;

  constructor(private dialog: MatDialog) {
    const aCollection = collection(this.firestore, 'games');
    this.games$ = collectionData(aCollection);
  }

  ngOnInit(): void {
    this.newGame();
    this.games$.subscribe((games) => {
      console.log('Game updated:', games); // Hier kannst du die Daten ausgeben
    });
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.pickCardAnimation) this.currentCard = this.game.stack.pop() || '';
    this.pickCardAnimation = true;
    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;

    setTimeout(() => {
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) this.game.players.push(name);
    });
  }
}
