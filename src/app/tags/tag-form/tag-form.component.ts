import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TagService } from '../tag.service'; // Importa o serviço
import { CommonModule } from '@angular/common'; // Para ngIf, etc.

@Component({
  selector: 'app-tag-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss']
})
export class TagFormComponent implements OnInit {
  tagForm: FormGroup;
  isEditMode = false;
  tagId: number | null = null;
  formTitle: string = 'Criar Nova Tag';

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.tagForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.tagId = +idParam;
        this.isEditMode = true;
        this.formTitle = 'Editar Tag';
        this.loadTagData(this.tagId);
      }
    });
  }

  loadTagData(id: number): void {
    this.tagService.getTagById(id).subscribe({
      next: (tag) => {
        this.tagForm.patchValue({
          name: tag.name
        });
      },
      error: (err) => {
        console.error('Erro ao carregar dados da tag:', err);
        alert('Erro ao carregar tag. Por favor, tente novamente.');
        this.router.navigate(['/tags']); // Redireciona de volta para a lista se a tag não for encontrada
      }
    });
  }

  onSubmit(): void {
    if (this.tagForm.valid) {
      const tagData = this.tagForm.value;

      if (this.isEditMode && this.tagId !== null) {
        this.tagService.updateTag(this.tagId, tagData).subscribe({
          next: () => {
            alert('Tag atualizada com sucesso!');
            this.router.navigate(['/tags']);
          },
          error: (err) => {
            console.error('Erro ao atualizar tag:', err);
            if (err.status === 403) {
              alert('Você não tem permissão para atualizar tags.');
            } else {
              alert('Ocorreu um erro ao atualizar a tag.');
            }
          }
        });
      } else {
        this.tagService.createTag(tagData).subscribe({
          next: () => {
            alert('Tag criada com sucesso!');
            this.router.navigate(['/tags']);
          },
          error: (err) => {
            console.error('Erro ao criar tag:', err);
            if (err.status === 403) {
              alert('Você não tem permissão para criar tags.');
            } else {
              alert('Ocorreu um erro ao criar a tag.');
            }
          }
        });
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }

  onCancel(): void {
    this.router.navigate(['/tags']);
  }
}