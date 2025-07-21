import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';

// Color Picker imports (versão compatível)
import { TagRequest, TagService } from '../tag.service';
import { Tag } from '../tag.model';

@Component({
  selector: 'app-tag-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Angular Material
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatCardModule,
    MatOptionModule,
  ],
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss']
})
export class TagFormComponent implements OnInit {
  tagForm!: FormGroup;
  isEditMode = false;
  private tagId: number | null = null;
  formTitle: string = 'Criar Nova Tag';

  constructor(
    private fb: FormBuilder,
    private tagService: TagService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.tagForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(10)]],
      color: ['#673ab7', Validators.required]
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
      next: (tag: Tag) => {
        if (tag) {
          this.tagForm.patchValue({
            name: tag.name,
            color: tag.color
          });
        } else {
          this.showErrorSnackbar('Tag não encontrada. ❌');
          this.router.navigate(['/tags']);
        }
      },
      error: (err) => {
        console.error('Erro ao carregar dados da tag:', err);
        this.showErrorSnackbar('Erro ao carregar tag. A redirecionar... ❌');
        this.router.navigate(['/tags']);
      }
    });
  }

  onSubmit(): void {
    this.tagForm.markAllAsTouched();

    if (this.tagForm.invalid) {
      if (this.tagForm.get('name')?.hasError('required')) {
        this.showErrorSnackbar('O nome da tag é obrigatório. ⚠️');
      } else if (this.tagForm.get('name')?.hasError('maxlength')) {
        this.showErrorSnackbar('O nome da tag não pode ter mais de 10 caracteres. ⚠️');
      } else if (this.tagForm.get('color')?.hasError('required')) {
        this.showErrorSnackbar('A cor da tag é obrigatória. ⚠️');
      } else {
        this.showErrorSnackbar('Por favor, corrija os erros no formulário. ⚠️');
      }
      return;
    }

    const tagData: TagRequest = this.tagForm.value;
    const operation = this.isEditMode && this.tagId
      ? this.tagService.updateTag(this.tagId, tagData)
      : this.tagService.createTag(tagData);

    operation.subscribe({
      next: () => {
        this.showSuccessSnackbar(`Tag ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso! ✅`);
        this.router.navigate(['/tags']);
      },
      error: (err) => this.handleApiError(err, this.isEditMode ? 'atualizar' : 'criar')
    });
  }

  onCancel(): void {
    this.router.navigate(['/tags']);
  }

  private showSuccessSnackbar(message: string): void {
    this.snackBar.open(message, 'Fechar', { 
      duration: 3000, 
      panelClass: 'success-snackbar', 
      horizontalPosition: 'right', 
      verticalPosition: 'bottom' 
    });
  }

  private showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Fechar', { 
      duration: 5000, 
      panelClass: 'error-snackbar', 
      horizontalPosition: 'right', 
      verticalPosition: 'bottom' 
    });
  }

  private handleApiError(err: any, action: string): void {
    console.error(`Erro ao ${action} tag:`, err);
    if (err.status === 403) {
      this.showErrorSnackbar(`Você não tem permissão para ${action} tags. ❌`);
    } else if (err.status === 400 && err.error && typeof err.error === 'string' && err.error.includes("Já existe uma tag com este nome")) {
      this.showErrorSnackbar('Já existe uma tag com este nome. Por favor, escolha outro. ⚠️');
    } else {
      const serverError = err.error?.errors?.[0] || err.error?.message;
      const errorMessage = serverError || `Ocorreu um erro ao ${action} a tag. ❌`;
      this.showErrorSnackbar(errorMessage);
    }
  }
}