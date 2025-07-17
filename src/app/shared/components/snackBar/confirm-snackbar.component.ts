// src/app/shared/components/confirm-snackbar/confirm-snackbar.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-snackbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ],
  template: `
    <span class="confirm-snackbar-message">
      {{ data.message }}
    </span>
    <button mat-button class="confirm-button" (click)="snackBarRef.dismissWithAction()">
      {{ data.confirmText || 'Sim' }}
    </button>
    <button mat-button class="cancel-button" (click)="snackBarRef.dismiss()">
      {{ data.cancelText || 'Não' }}
    </button>
  `,
  styleUrls: ['./confirm-snackbar.component.scss'] // <--- APONTA PARA O NOVO ARQUIVO SCSS
})
export class ConfirmSnackbarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<ConfirmSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string; confirmText?: string; cancelText?: string }
  ) {}
}