import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TagService } from '../tag.service';
import { Tag } from '../tag.model'; // Certifique-se de que 'color: string;' está nesta interface

import { MatTableModule } from '@angular/material/table'; // Mantido caso haja necessidade futura, mas não usado no novo layout
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card'; // Mantido caso haja necessidade futura, mas não usado no novo layout

// Importações dos módulos do Snackbar
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmSnackbarComponent } from '../../shared/components/snackBar/confirm-snackbar.component';
import { MatDivider } from "@angular/material/divider"; // Importe o componente de confirmação

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule, // Pode ser removido se não for mais usado
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule, // Pode ser removido se não for mais usado
    MatSnackBarModule, // Adicione MatSnackBarModule
    ConfirmSnackbarComponent // Adicione ConfirmSnackbarComponent
    ,
    MatDivider
],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {
  tags: Tag[] = [];
  // displayedColumns: string[] = ['id', 'name', 'color', 'actions']; // Não é mais usado com o novo layout

  constructor(
    private tagService: TagService,
    private snackBar: MatSnackBar // Injete o MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadTags();
  }

  loadTags(): void {
    this.tagService.getAllTags().subscribe({
      next: (data) => {
        this.tags = data;
      },
      error: (err) => {
        console.error('Erro ao carregar tags:', err);
        this.openSnackBar('Erro ao carregar tags. ❌', 'error');
      }
    });
  }

  // Função auxiliar para escurecer uma cor hexadecimal
  // Esta é uma implementação simplificada e pode não ser perfeita para todas as cores.
  // Para uma solução mais robusta, considere uma biblioteca de manipulação de cores.
  getDarkerColor(hex: string, percent: number): string {
    if (!hex || hex === '#ccc') { // Se for a cor padrão ou inválida, retorna um roxo escuro fixo
      return '#512da8'; // $primary-dark-color
    }

    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.floor(r * (1 - percent / 100));
    g = Math.floor(g * (1 - percent / 100));
    b = Math.floor(b * (1 - percent / 100));

    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // NOVO: Método para exibir o snackbar de confirmação para exclusão
  deleteTag(id: number): void {
    const snackBarRef = this.snackBar.openFromComponent(ConfirmSnackbarComponent, {
      data: {
        message: 'Tem certeza que deseja excluir esta tag? Esta ação é irreversível.',
        confirmText: 'Sim',
        cancelText: 'Não'
      },
      duration: 5000,
      horizontalPosition: 'right', // Alterado para 'right'
      verticalPosition: 'bottom',
      panelClass: ['confirm-snackbar']
    });

    snackBarRef.onAction().subscribe(() => {
      // Se o usuário clicou em 'Sim'
      this._performDeleteTag(id);
    });
  }

  // NOVO: Método privado que executa a exclusão real após a confirmação
  private _performDeleteTag(id: number): void {
    this.tagService.deleteTag(id).subscribe({
      next: () => {
        this.openSnackBar('Tag excluída com sucesso! ✅', 'success');
        this.loadTags();
      },
      error: (err) => {
        console.error('Erro ao excluir tag:', err);
        if (err.status === 403) {
          this.openSnackBar('Você não tem permissão para excluir tags. ❌', 'error');
        } else {
          this.openSnackBar('Ocorreu um erro ao excluir a tag. ❌', 'error');
        }
      }
    });
  }

  // NOVO: Método auxiliar para abrir snackbars de sucesso/erro
  private openSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar'],
      horizontalPosition: 'right', // Definido para a direita
      verticalPosition: 'bottom'
    });
  }
}
