import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// Modelos e Serviços
import { Atividade } from '../atividade.model';
import { AtividadeService } from '../atividade.service';
import { AuthService } from '../../auth/auth'; // <-- 1. IMPORTAR O AUTHSERVICE

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-atividade-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    MatCardModule, MatButtonModule, MatIconModule, MatDividerModule
  ],
  templateUrl: './atividade-list.component.html',
  styleUrls: ['./atividade-list.component.scss']
})
export class AtividadeListComponent implements OnInit {
  atividades: Atividade[] = [];
  errorMessage: string | null = null;

  constructor(
    private atividadeService: AtividadeService,
    public authService: AuthService, // <-- 2. INJETAR COMO PÚBLICO
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAtividades();
  }

  loadAtividades(): void {
    this.atividadeService.getAtividades().subscribe({
      next: (data) => { this.atividades = data; },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar as atividades.';
        console.error(err);
      }
    });
  }

  deleteAtividade(id: number): void {
    if (confirm('Tem a certeza que deseja excluir esta atividade?')) {
      this.atividadeService.deleteAtividade(id).subscribe({
        next: () => {
          this.snackBar.open('Atividade excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.loadAtividades();
        },
        error: (err) => {
          this.snackBar.open('Erro ao excluir a atividade.', 'Fechar', { duration: 3000 });
          console.error(err);
        }
      });
    }
  }
}