import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-daily-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule
  ],
  templateUrl: './daily-form.component.html',
  styleUrls: ['./daily-form.component.scss']
})
export class DailyFormComponent implements OnInit {
  dailyForm: FormGroup;
  isEditMode = false;
  dailyId: number | null = null;
  errorMessage: string | null = null;
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
      annotationText: ['', Validators.required], // Este é o campo que vamos preencher
      annotationDate: [new Date(), Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadStudents();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.dailyId = +idParam;
      
      this.dailyForm.get('studentId')?.disable();

      this.dailyService.getDailyById(this.dailyId).subscribe(data => {
        this.dailyForm.patchValue({
          studentId: data.studentId,
          annotationText: data.annotationText,
          annotationDate: new Date(data.annotationDate)
        });
      });
    }
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe((students: StudentResponse[]) => {
      this.students = students;
    });
  }

  // ===================================================================
  // NOVA FUNÇÃO PARA IMPORTAR O ARQUIVO
  // ===================================================================
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
        
        // Atualiza o valor do campo 'annotationText' no formulário
        this.dailyForm.patchValue({
          annotationText: text
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
    if (this.dailyForm.invalid) {
      if (this.isEditMode && this.dailyForm.get('annotationText')?.valid && this.dailyForm.get('annotationDate')?.valid) {
        // Permite o envio se apenas os campos editáveis forem válidos
      } else {
        return;
      }
    }
    this.errorMessage = null;

    const formValue = this.dailyForm.getRawValue();

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
        const message = this.isEditMode ? 'Daily atualizada com sucesso!' : 'Daily registrada com sucesso!';
        this.snackBar.open(message, 'Fechar', { duration: 3000 });
        this.router.navigate(['/dailies']);
      },
      error: (err) => {
        this.errorMessage = 'Ocorreu um erro ao salvar a daily.';
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
}
