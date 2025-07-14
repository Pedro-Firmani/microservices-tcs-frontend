import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AtividadeService } from '../atividade.service';
import { CommonModule } from '@angular/common';

// Imports do Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-atividade-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Adicione os módulos do Material aqui
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './atividade-form.component.html',
  styleUrls: ['./atividade-form.component.scss']
})
export class AtividadeFormComponent implements OnInit {
  // ... (o resto do seu código TypeScript permanece o mesmo)
  atividadeForm: FormGroup;
  isEditMode = false;
  atividadeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private atividadeService: AtividadeService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.atividadeForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      dataEntrega: ['']
    });
  }

  ngOnInit(): void {
    this.atividadeId = this.route.snapshot.params['id'];
    if (this.atividadeId) {
      this.isEditMode = true;
      this.atividadeService.getAtividade(this.atividadeId).subscribe(data => {
        // Formata a data para o formato datetime-local
        const formattedDate = data.dataEntrega ? new Date(data.dataEntrega).toISOString().substring(0, 16) : '';
        this.atividadeForm.patchValue({
          ...data,
          dataEntrega: formattedDate
        });
      });
    }
  }

  onSubmit(): void {
    if (this.atividadeForm.valid) {
      const formValue = this.atividadeForm.value;
      // Converte a data de volta para o formato ISO se ela existir
      const payload = {
        ...formValue,
        dataEntrega: formValue.dataEntrega ? new Date(formValue.dataEntrega).toISOString() : null
      };

      if (this.isEditMode && this.atividadeId) {
        this.atividadeService.updateAtividade(this.atividadeId, payload).subscribe(() => {
          this.router.navigate(['/atividades']);
        });
      } else {
        this.atividadeService.createAtividade(payload).subscribe(() => {
          this.router.navigate(['/atividades']);
        });
      }
    }
  }
}