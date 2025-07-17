import { Component, OnInit } from '@angular/core';
import { TagService } from '../tag.service'; // Importa o serviço
import { Tag } from '../tag.model'; // Importa o modelo
import { CommonModule } from '@angular/common'; // Para ngFor, ngIf
import { RouterModule } from '@angular/router'; // Para routerLink

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {
  tags: Tag[] = [];

  constructor(private tagService: TagService) { }

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
        // Exemplo: this.errorMessage = 'Falha ao carregar tags. Por favor, tente novamente.';
      }
    });
  }

  deleteTag(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta tag?')) {
      this.tagService.deleteTag(id).subscribe({
        next: () => {
          console.log('Tag excluída com sucesso!');
          this.loadTags(); // Recarrega a lista após a exclusão
        },
        error: (err) => {
          console.error('Erro ao excluir tag:', err);
          // Tratar erros de autorização (403 Forbidden) ou outros erros
          if (err.status === 403) {
            alert('Você não tem permissão para excluir tags.');
          } else {
            alert('Ocorreu um erro ao excluir a tag.');
          }
        }
      });
    }
  }
}