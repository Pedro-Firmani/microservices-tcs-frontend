import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
// Serviços e Modelos
import { AtividadeService } from '../atividade.service';
import { Atividade } from '../atividade.model';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-atividade-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './atividade-form.component.html',
  styleUrls: ['./atividade-form.component.scss']
})
export class AtividadeFormComponent implements OnInit {
  atividadeForm: FormGroup;
  isEditMode = false;
  atividadeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private atividadeService: AtividadeService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.atividadeForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required], 
      dataEntrega: [null]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.atividadeId = +idParam;
      this.atividadeService.getAtividade(this.atividadeId).subscribe(data => {
        this.atividadeForm.patchValue({
          titulo: data.titulo,
          descricao: data.descricao,
          dataEntrega: data.dataEntrega ? new Date(data.dataEntrega) : null
        });
      });
    }
  }


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type !== 'text/plain') {
        this.snackBar.open('Erro: Por favor, selecione um arquivo .txt', 'Fechar', { duration: 3000 });
        return;
      }
      
      const reader = new FileReader();

      reader.onload = () => {
        const text = reader.result as string;
        
        // Atualiza o valor do campo 'descricao' no formulário de atividade
        this.atividadeForm.patchValue({
          descricao: text
        });

        // Limpa o valor do input para permitir selecionar o mesmo arquivo novamente
        input.value = '';
      };

      reader.onerror = () => {
          this.snackBar.open('Erro ao ler o arquivo.', 'Fechar', { duration: 3000 });
          console.error("Erro ao ler o arquivo", reader.error);
      };

      reader.readAsText(file);
    }
  }
  // ===================================================================

  onSubmit(): void {
    if (this.atividadeForm.invalid) {
      return;
    }

    const formValue = this.atividadeForm.value;
    const atividadeRequest = {
      titulo: formValue.titulo,
      descricao: formValue.descricao,
      dataEntrega: formValue.dataEntrega ? this.formatDateForBackend(formValue.dataEntrega) : null
    };

    const action = this.isEditMode && this.atividadeId
      ? this.atividadeService.updateAtividade(this.atividadeId, atividadeRequest as any)
      : this.atividadeService.createAtividade(atividadeRequest as any);

    action.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Atividade atualizada com sucesso!' : 'Atividade criada com sucesso!';
        this.snackBar.open(message, 'Fechar', { duration: 3000 });
        this.router.navigate(['/atividades']);
      },
      error: (err) => {
        this.snackBar.open('Erro ao salvar a atividade.', 'Fechar', { duration: 3000 });
        console.error(err);
      }
    });
  }

  private formatDateForBackend(date: Date): string {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    d.setHours(23, 59, 59);
    return d.toISOString().slice(0, 19);
  }
}
