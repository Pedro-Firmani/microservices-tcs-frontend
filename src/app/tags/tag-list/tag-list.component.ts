import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TagService } from '../tag.service';
import { Tag } from '../tag.model'; 

// Importações dos módulos do Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmSnackbarComponent } from '../../shared/components/snackBar/confirm-snackbar.component';
import { MatDividerModule } from "@angular/material/divider"; 

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule, 
    MatSnackBarModule,
    MatDividerModule, 
    ConfirmSnackbarComponent // Adicione ConfirmSnackbarComponent
  ],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {
  tags: Tag[] = [];

  constructor(
    public tagService: TagService,
    private snackBar: MatSnackBar
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

  


  deleteTag(id: number): void {
    const snackBarRef = this.snackBar.openFromComponent(ConfirmSnackbarComponent, {
      data: {
        message: 'Tem certeza que deseja excluir esta tag? Esta ação é irreversível.',
        confirmText: 'Sim',
        cancelText: 'Não'
      },
      duration: 5000,
      horizontalPosition: 'center', 
      verticalPosition: 'bottom',
      panelClass: ['confirm-snackbar']
    });

    snackBarRef.onAction().subscribe(() => {
      this._performDeleteTag(id);
    });
  }

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

  private openSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar'],
      horizontalPosition: 'right', 
      verticalPosition: 'bottom'
    });
  }
}



