import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DailyService } from '../daily.service';
import { StudentResponse, StudentService } from '../../students/student.service';
import { Observable } from 'rxjs';
import { DailyAnnotationRequest } from '../daily.model';

@Component({
  selector: 'app-daily-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './daily-form.component.html',
  styleUrls: ['./daily-form.component.scss']
})
export class DailyFormComponent implements OnInit {
  dailyForm: FormGroup;
  students$: Observable<StudentResponse[]>;
  isEditMode = false;
  dailyId: number | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dailyService: DailyService,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.dailyForm = this.fb.group({
      studentId: ['', Validators.required],
      annotationDate: ['', Validators.required],
      annotationText: ['', Validators.required]
    });

    this.students$ = this.studentService.getAllStudents();
  }

  ngOnInit(): void {
    this.dailyId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.dailyId) {
      this.isEditMode = true;
            this.dailyForm.get('studentId')?.disable();

      // Carrega os dados da daily para edição
      this.dailyService.getDailies().subscribe(dailies => {
        const dailyToEdit = dailies.find(d => d.id === this.dailyId);
        if (dailyToEdit) {
          this.dailyForm.patchValue(dailyToEdit);
        }
      });
    }
  }

  // DENTRO DE daily-form.component.ts

  onSubmit(): void {
    if (this.dailyForm.invalid) {
      return;
    }

    const formValue: DailyAnnotationRequest = this.dailyForm.value;
    this.errorMessage = null;

    const request = this.isEditMode && this.dailyId 
      ? this.dailyService.updateDaily(this.dailyId, formValue)
      : this.dailyService.createDaily(formValue);

    request.subscribe({
      next: () => this.router.navigate(['/dailies']),
      // VVV SUBSTITUA ESTE BLOCO DE ERRO VVV
      error: (err) => {
        // Agora, o erro exibido será a mensagem exata do backend
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = this.isEditMode ? 'Ocorreu um erro ao atualizar.' : 'Ocorreu um erro ao criar.';
        }
      }
    });
  }

  goBack(): void {
    this.location.back();
  }
}