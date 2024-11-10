import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../../models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { MaterialModule } from '../materials/material.module';
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MaterialModule,
    GameInfoComponent,
    PlayerMobileComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  firestore: Firestore = inject(Firestore);
  games$;

  game: Game = new Game();
  gameId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) {
    const newGame = collection(this.firestore, 'games');
    this.games$ = collectionData(newGame);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      if (this.gameId) {
        this.loadGame(this.gameId);
      } else {
        this.newGame();
      }
      console.log('Game updated', this.game);
    });
  }

  newGame() {
    this.game = new Game();
    const gamesCollection = collection(this.firestore, 'games');

    addDoc(gamesCollection, this.game.toJson())
      .then((gameInfo) => {
        const gameId = gameInfo.id;
        this.router.navigate(['/game', gameId]);
      })
      .catch((error) => {
        console.error('Fehler beim Erstellen des Spiels:', error);
      });
  }

  async loadGame(gameId: string) {
    const gameDocRef = doc(this.firestore, 'games', gameId);

    // Setze einen Echtzeit-Listener für das Spiel-Dokument
    onSnapshot(gameDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const gameData = docSnapshot.data() as Game;

        if (gameData) {
          // Update Spiel-Daten nur, wenn sie sich geändert haben
          this.game.currentPlayer = gameData.currentPlayer;
          this.game.playedCards = gameData.playedCards;
          this.game.players = gameData.players;
          this.game.stack = gameData.stack;
          this.game.pickCardAnimation = gameData.pickCardAnimation;
          this.game.currentCard = gameData.currentCard;
        }
      } else {
        console.error('Spiel nicht gefunden!');
      }
    });
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() || '';
    }
    this.game.pickCardAnimation = true;
    this.game.currentPlayer++;
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
    this.saveGame();

    setTimeout(() => {
      this.game.playedCards.push(this.game.currentCard);
      this.game.pickCardAnimation = false;
      this.saveGame(); // Sofort speichern nach der Aktion
    }, 1000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame(); // Sofort speichern nach dem Hinzufügen eines Spielers
      }
    });
  }

  saveGame() {
    if (this.gameId) {
      const gameDocRef = doc(this.firestore, 'games', this.gameId);
      updateDoc(gameDocRef, this.game.toJson())
        .then(() => {
          console.log('Spiel erfolgreich gespeichert!');
        })
        .catch((error) => {
          console.error('Fehler beim Speichern des Spiels:', error);
        });
    }
  }
}
