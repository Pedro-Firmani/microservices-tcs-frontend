import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Importações do Angular Material para datas e localidade
import { MatDatepickerModule } from '@angular/material/datepicker';
// Adicionado DateAdapter e NativeDateAdapter
import { MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter, NativeDateAdapter } from '@angular/material/core';

// Serviços e Modelos
import { DailyService } from '../daily.service';
import { StudentService } from '../../students/student.service';
import { StudentResponse } from '../../students/student';
import { DailyAnnotationRequest } from '../daily.model';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';


// Definição do formato de data para o Datepicker
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-daily-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatSnackBarModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }, // Define o locale para português do Brasil
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, // Aplica o formato de data personalizado
    // Força o NativeDateAdapter a usar o locale pt-BR
    { provide: DateAdapter, useClass: NativeDateAdapter, deps: [MAT_DATE_LOCALE] }
  ],
  templateUrl: './daily-form.component.html',
  styleUrls: ['./daily-form.component.scss']
})
export class DailyFormComponent implements OnInit {
  dailyForm: FormGroup;
  isEditMode = false;
  dailyId: number | null = null;
  students: StudentResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private dailyService: DailyService,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.dailyForm = this.fb.group({
      studentId: [null, Validators.required],
      annotationText: ['', Validators.required],
      annotationDate: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadStudents();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.dailyId = +idParam;
      
      this.dailyForm.get('studentId')?.disable(); // Desabilita o campo studentId em modo de edição

      this.dailyService.getDailyById(this.dailyId).subscribe({
        next: (data) => {
          this.dailyForm.patchValue({
            studentId: data.studentId,
            annotationText: data.annotationText,
            // Certifique-se de que a data é um objeto Date válido
            annotationDate: data.annotationDate ? new Date(data.annotationDate) : null
          });
        },
        error: (err) => {
          this.openSnackBar('Erro ao carregar daily para edição. ❌', 'error');
          console.error(err);
        }
      });
    }
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (students: StudentResponse[]) => {
        this.students = students;
      },
      error: (err) => {
        this.openSnackBar('Erro ao carregar a lista de alunos. ❌', 'error');
        console.error(err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.type !== 'text/plain') {
        this.openSnackBar('Erro: Por favor, selecione um arquivo .txt ❌', 'error');
        return;
      }
      
      const reader = new FileReader();

      reader.onload = () => {
        const text = reader.result as string;
        
        // Atualiza o valor do campo 'annotationText' no formulário
        this.dailyForm.patchValue({
          annotationText: text
        });

        this.openSnackBar('Arquivo .txt importado com sucesso! ✅', 'success');
        // Limpa o valor do input para permitir selecionar o mesmo arquivo novamente
        input.value = '';
      };

      reader.onerror = () => {
          this.openSnackBar('Erro ao ler o arquivo. ❌', 'error');
          console.error("Erro ao ler o arquivo", reader.error);
      };

      reader.readAsText(file);
    }
  }

  onSubmit(): void {
    // Validação para campos obrigatórios
    if (this.dailyForm.invalid) {
      // Verifica se o erro é devido a campos desabilitados em modo de edição
      if (this.isEditMode && this.dailyForm.get('annotationText')?.valid && this.dailyForm.get('annotationDate')?.valid) {
        // Permite o envio se apenas os campos editáveis forem válidos
      } else {
        this.openSnackBar('Por favor, preencha todos os campos obrigatórios. ⚠️', 'error');
        return;
      }
    }

    const formValue = this.dailyForm.getRawValue(); // Usa getRawValue para incluir campos desabilitados

    const dailyRequest: DailyAnnotationRequest = {
      studentId: formValue.studentId,
      annotationText: formValue.annotationText,
      annotationDate: this.formatDateToYYYYMMDD(formValue.annotationDate),
    };

    console.log('Enviando para o backend:', dailyRequest);

    const action = this.isEditMode && this.dailyId
      ? this.dailyService.updateDaily(this.dailyId, dailyRequest)
      : this.dailyService.createDaily(dailyRequest);

    action.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Daily atualizada com sucesso! ✅' : 'Daily registrada com sucesso! ✅';
        this.openSnackBar(message, 'success');
        this.router.navigate(['/dailies']);
      },
      error: (err) => {
        this.openSnackBar('Ocorreu um erro ao salvar a daily. ❌', 'error');
        console.error(err);
      }
    });
  }

  private formatDateToYYYYMMDD(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  // Método auxiliar para abrir snackbars de sucesso/erro
  private openSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar'],
      horizontalPosition: 'right', // Definido para a direita
      verticalPosition: 'bottom'
    });
  }
}
