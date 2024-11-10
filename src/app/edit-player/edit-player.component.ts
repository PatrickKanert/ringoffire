import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../materials/material.module';

@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss',
})
export class EditPlayerComponent {
  constructor(private dialogRef: MatDialogRef<EditPlayerComponent>) {}

  allProfilePictures = [
    '1.webp',
    '2.png',
    'monkey.png',
    'pinguin.svg',
    'winkboy.svg',
  ];

  onNoClick(): void {
    this.dialogRef.close();
  }
}
