import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// NOVO: Importações para MatSnackBar e o componente customizado
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmSnackbarComponent } from '../../shared/components/snackBar/confirm-snackbar.component'; // Importe o componente de confirmação

// Modelos e Serviços
import { Atividade } from '../atividade.model';
import { AtividadeService } from '../atividade.service';
import { AuthService } from '../../auth/auth';

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
    MatCardModule, MatButtonModule, MatIconModule, MatDividerModule,
    MatSnackBarModule, // Adicione MatSnackBarModule
    ConfirmSnackbarComponent // Adicione ConfirmSnackbarComponent
  ],
  templateUrl: './atividade-list.component.html',
  styleUrls: ['./atividade-list.component.scss']
})
export class AtividadeListComponent implements OnInit {
  atividades: Atividade[] = [];
  errorMessage: string | null = null; // Mantido conforme pedido, mas o snackbar é o principal feedback

  constructor(
    private atividadeService: AtividadeService,
    public authService: AuthService,
    private snackBar: MatSnackBar // Injete o MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadAtividades();
  }

  loadAtividades(): void {
    this.atividadeService.getAtividades().subscribe({
      next: (data) => {
        this.atividades = data;
        this.errorMessage = null; // Limpa a mensagem de erro da tela
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar as atividades.';
        console.error(err);
        this.openSnackBar('Falha ao carregar as atividades. ❌', 'error'); // Usando snackbar com emoji e direita
      }
    });
  }

  // NOVO: Método para exibir o snackbar de confirmação para exclusão
  deleteAtividade(id: number): void {
    const snackBarRef = this.snackBar.openFromComponent(ConfirmSnackbarComponent, {
      data: {
        message: 'Tem certeza que deseja excluir esta atividade?',
        confirmText: 'Sim', // Mantido como "Sim"
        cancelText: 'Não'  // Mantido como "Não"
      },
      duration: 5000, // Snackbar visível por 5 segundos
      horizontalPosition: 'center', // Este continua centralizado
      verticalPosition: 'bottom',
      panelClass: ['confirm-snackbar'] // Classe CSS para estilização
    });

    snackBarRef.onAction().subscribe(() => {
      // Se o usuário clicou em 'Sim'
      this._performDeleteAtividade(id);
    });
  }

  // NOVO: Método privado que executa a exclusão real após a confirmação
  private _performDeleteAtividade(id: number): void {
    this.atividadeService.deleteAtividade(id).subscribe({
      next: () => {
        this.openSnackBar('Atividade excluída com sucesso! ✅', 'success'); // Usando snackbar com emoji e direita
        this.loadAtividades();
      },
      error: (err) => {
        console.error(err);
        this.openSnackBar('Erro ao excluir a atividade. ❌', 'error'); // Usando snackbar com emoji e direita
      }
    });
  }

  // NOVO: Método auxiliar para abrir snackbars de sucesso/erro
  private openSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000, // Duração de 3 segundos
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar'],
      horizontalPosition: 'right', // Definido para a direita
      verticalPosition: 'bottom'
    });
  }
}
