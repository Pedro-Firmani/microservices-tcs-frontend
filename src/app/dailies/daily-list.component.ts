import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// --- CAMINHOS DE IMPORTAÇÃO CORRIGIDOS ---
import { DailyAnnotation } from './daily.model';
import { AuthService } from '../auth/auth';
import { DailyService } from './daily.service'; // <-- ADICIONE ESTA LINHA

// Imports do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-daily-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './daily-list.component.html',
  styleUrls: ['./daily-list.component.scss']
})
export class DailyListComponent implements OnInit {
  dailies: DailyAnnotation[] = [];
  errorMessage: string | null = null;
  
  // O construtor agora reconhecerá o DailyService
  constructor(
    private dailyService: DailyService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadDailies();
  }

  loadDailies(): void {
    this.dailyService.getDailies().subscribe({
      next: (data) => {
        this.dailies = data;
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar as dailies. Tente novamente mais tarde.';
        console.error(err);
      }
    });
  }

  deleteDaily(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta daily?')) {
      this.dailyService.deleteDaily(id).subscribe({
        next: () => {
          this.snackBar.open('Daily excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.loadDailies(); // Recarrega a lista
        },
        error: (err) => {
          this.errorMessage = 'Falha ao excluir a daily.';
          console.error(err);
        }
      });
    }
  }
}