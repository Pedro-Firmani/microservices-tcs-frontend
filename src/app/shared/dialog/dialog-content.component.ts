import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-content',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">
        {{ data.title }}
        <span class="dialog-emoji" *ngIf="data.title === 'Erro'">❌</span>
        <span class="dialog-emoji" *ngIf="data.title === 'Sucesso'">🎉</span>
      </h2>
      <div class="dialog-message">{{ data.message }}</div>
      <div class="dialog-actions">
        <button mat-button (click)="close()">OK</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      background: #fff;
      border-radius: 8px;
      padding: 24px 32px;
      max-width: 400px;
      color: #333;
      font-family: 'Roboto', sans-serif;
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      text-align: left;
    }

    .dialog-title {
      font-size: 1.8em;
      font-weight: 600;
      color: #673ab7; /* primary-color */
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
      justify-content: flex-start;
    }

    .dialog-emoji {
      font-size: 1.4em;
      line-height: 1;
    }

    .dialog-message {
      font-size: 1.1em;
      color: #555;
      margin-bottom: 24px;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
    }

    .dialog-actions button {
      min-width: 100px;
      height: 40px;
      font-weight: 600;
      color: #673ab7; /* primary-color */
      background-color: #d1c4e9; /* lilás claro */
      border-radius: 4px;
      transition: background-color 0.3s ease;
    }

    .dialog-actions button:hover {
      background-color: #b39ddb; /* lilás um pouco mais escuro */
    }
  `]
})
export class DialogContentComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string },
    private dialogRef: MatDialogRef<DialogContentComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
