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
      
      // --- ALTERAÇÃO IMPORTANTE AQUI ---
      // Desativa o controlo do aluno SE estiver em modo de edição
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

  onSubmit(): void {
    if (this.dailyForm.invalid) {
      // Se o controlo estiver desativado, o seu valor não é incluído em 'this.dailyForm.value'.
      // Usamos 'getRawValue()' para obter todos os valores, incluindo os desativados.
      if (this.isEditMode && this.dailyForm.get('annotationText')?.valid && this.dailyForm.get('annotationDate')?.valid) {
        // Permite o envio se apenas os campos editáveis forem válidos
      } else {
        return;
      }
    }
    this.errorMessage = null;

    // Usamos getRawValue() para garantir que o studentId (que está desativado) seja incluído no payload
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
