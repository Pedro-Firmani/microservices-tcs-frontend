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
      // Adicionado Validators.minLength(2) e Validators.maxLength(10)
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      // Adicione o campo de cor, se a interface Tag tiver 'color'
      // color: ['#673ab7'] // Exemplo: cor padrão
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
          // color: tag.color // Se a interface Tag tiver 'color'
        });
      },
      error: (err) => {
        console.error('Erro ao carregar dados da tag:', err);
        this.showErrorSnackbar('Erro ao carregar tag. A redirecionar... ❌'); // Adicionado emoji
        this.router.navigate(['/tags']);
      }
    });
  }

  onSubmit(): void {
    // Marca todos os campos como "touched" para exibir as mensagens de validação
    this.tagForm.markAllAsTouched();

    if (this.tagForm.invalid) {
      this.showErrorSnackbar('Por favor, corrija os erros no formulário. ⚠️'); // Adicionado emoji
      return; // Retorna para que a requisição não seja feita com dados inválidos
    }

    const tagData = this.tagForm.value;

    const operation = this.isEditMode && this.tagId
      ? this.tagService.updateTag(this.tagId, tagData)
      : this.tagService.createTag(tagData);
      
    const actionText = this.isEditMode ? 'atualizar' : 'criar';

    operation.subscribe({
      next: () => {
        this.showSuccessSnackbar(`Tag ${this.isEditMode ? 'atualizada' : 'criada'} com sucesso! ✅`); // Adicionado emoji
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
    this.snackBar.open(message, 'Fechar', { duration: 3000, panelClass: 'success-snackbar', horizontalPosition: 'right', verticalPosition: 'bottom' }); // Botão 'Fechar' e posição à direita
  }

  private showErrorSnackbar(message: string): void {
    this.snackBar.open(message, 'Fechar', { duration: 5000, panelClass: 'error-snackbar', horizontalPosition: 'right', verticalPosition: 'bottom' }); // Botão 'Fechar' e posição à direita
  }

  private handleApiError(err: any, action: string): void {
    console.error(`Erro ao ${action} tag:`, err);
    if (err.status === 403) {
      this.showErrorSnackbar(`Você não tem permissão para ${action} tags. ❌`); // Adicionado emoji
    } else {
      const serverError = err.error?.errors?.[0] || err.error?.message;
      const errorMessage = serverError || `Ocorreu um erro ao ${action} a tag. ❌`; // Adicionado emoji
      this.showErrorSnackbar(errorMessage);
    }
  }
}
