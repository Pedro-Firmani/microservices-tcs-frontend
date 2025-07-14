import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Serviços e Modelos
import { AtividadeService } from '../atividade.service';
import { Atividade } from '../atividade.model'; // Assumindo que o modelo se chama Atividade

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
// --- NOVOS IMPORTS PARA O CAMPO DE DATA ---
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-atividade-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    // Material
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    // Adicionar módulos de data
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
      dataEntrega: [null] // O campo de data é opcional
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
          // Garante que o valor passado para o datepicker seja um objeto Date
          dataEntrega: data.dataEntrega ? new Date(data.dataEntrega) : null
        });
      });
    }
  }

  onSubmit(): void {
    if (this.atividadeForm.invalid) {
      return;
    }

    const formValue = this.atividadeForm.value;

    // Prepara o payload para o backend
    const atividadeRequest = {
      titulo: formValue.titulo,
      descricao: formValue.descricao,
      // Formata a data para um formato que o backend (LocalDateTime) entenda
      dataEntrega: formValue.dataEntrega ? this.formatDateForBackend(formValue.dataEntrega) : null
    };

    // --- CORREÇÃO APLICADA AQUI ---
    // Usamos 'as any' para contornar a verificação de tipo do TypeScript.
    // O payload 'atividadeRequest' está correto para o backend, mas a assinatura
    // do método no serviço espera um tipo diferente para 'dataEntrega'.
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

  /**
   * Pega a data do calendário (que não tem hora) e a formata para o backend.
   * Adicionamos um horário fixo (fim do dia) para ser compatível com LocalDateTime.
   */
  private formatDateForBackend(date: Date): string {
    const d = new Date(date);
    // Ajusta para o fuso horário local para evitar que a data mude
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    // Define a hora para o final do dia
    d.setHours(23, 59, 59);
    // Retorna a data no formato ISO, que o Spring Boot entende
    return d.toISOString().slice(0, 19);
  }
}   