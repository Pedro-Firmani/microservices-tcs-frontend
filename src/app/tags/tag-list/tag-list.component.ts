import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TagService } from '../tag.service';
import { Tag } from '../tag.model';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card'; 

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule
  ],
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss']
})
export class TagListComponent implements OnInit {
  tags: Tag[] = [];
  displayedColumns: string[] = ['id', 'name', 'color', 'actions'];

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
      }
    });
  }

  deleteTag(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta tag?')) {
      this.tagService.deleteTag(id).subscribe({
        next: () => {
          console.log('Tag excluída com sucesso!');
          this.loadTags(); 
        },
        error: (err) => {
          console.error('Erro ao excluir tag:', err);
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
