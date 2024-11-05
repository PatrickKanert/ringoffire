import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../materials/material.module';
@Component({
  selector: 'app-dialog-add-player',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './dialog-add-player.component.html',
  styleUrl: './dialog-add-player.component.scss',
})
export class DialogAddPlayerComponent {
  name: string = '';

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>) {}

  closeDialog() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
