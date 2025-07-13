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
      // Carrega os dados da daily para edição
      this.dailyService.getDailies().subscribe(dailies => {
        const dailyToEdit = dailies.find(d => d.id === this.dailyId);
        if (dailyToEdit) {
          this.dailyForm.patchValue(dailyToEdit);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.dailyForm.invalid) {
      return;
    }

    const formValue: DailyAnnotationRequest = this.dailyForm.value;
    this.errorMessage = null;

    if (this.isEditMode && this.dailyId) {
      this.dailyService.updateDaily(this.dailyId, formValue).subscribe({
        next: () => this.router.navigate(['/dailies']),
        error: (err) => this.errorMessage = err.error?.message || 'Ocorreu um erro ao atualizar.'
      });
    } else {
      this.dailyService.createDaily(formValue).subscribe({
        next: () => this.router.navigate(['/dailies']),
        error: (err) => this.errorMessage = err.error || 'Ocorreu um erro ao criar.'
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}