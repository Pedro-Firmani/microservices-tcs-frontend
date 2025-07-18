import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TagService } from '../tag.service';
import { Tag } from '../tag.model';

// --- IMPORTAÇÕES DO ANGULAR MATERIAL ---
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tag-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Módulos do Material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss']
})
export class TagFormComponent implements OnInit {
  tagForm: FormGroup;
  isEditMode = false;
  private tagId: number | null = null;
  formTitle: string = 'Criar Nova Tag';

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar // Injeta o SnackBar
  ) {
    this.tagForm = this.fb.group({
      // Adiciona as validações e o campo de cor
      name: ['', [Validators.required, Validators.maxLength(10)]],
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
          name: tag.name,
        });
      },
      error: (err) => {
        console.error('Erro ao carregar dados da tag:', err);
        this.showErrorSnackbar('Erro ao carregar tag. A redirecionar...');
        this.router.navigate(['/tags']);
      }
    });
  }

  onSubmit(): void {
    if (this.tagForm.invalid) {
      this.showErrorSnackbar('Por favor, corrija os erros no formulário.');
      return;
    }

    const tagData = this.tagForm.value;

    const operation = this.isEditMode && this.tagId
      ? this.tagService.updateTag(this.tagId, tagData)
      : this.tagService.createTag(tagData);
      
    const actionText = this.isEditMode ? 'atualizar' : 'criar';

    operation.subscribe({
      next: () => {
        this.showSuccessSnackbar(`Tag ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso!`);
        this.router.navigate(['/tags']);
      },
      error: (err) => this.handleApiError(err, actionText)
    });
  }

  onCancel(): void {
    this.router.navigate(['/tags']);
  }

  // Funções auxiliares para feedback ao usuário
  private showSuccessSnackbar(message: string): void {
    this.snackBar.open(message, '✅', { duration: 3000, panelClass: 'success-snackbar' });
  }

  private showErrorSnackbar(message: string): void {
    this.snackBar.open(message, '❌', { duration: 5000, panelClass: 'error-snackbar' });
  }

  private handleApiError(err: any, action: string): void {
    console.error(`Erro ao ${action} tag:`, err);
    if (err.status === 403) {
      this.showErrorSnackbar(`Você não tem permissão para ${action} tags.`);
    } else {
      const serverError = err.error?.errors?.[0] || err.error?.message;
      const errorMessage = serverError || `Ocorreu um erro ao ${action} a tag.`;
      this.showErrorSnackbar(errorMessage);
    }
  }
}
