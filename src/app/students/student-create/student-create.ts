import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../student'; // Assuming this path is correct

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';       // For <mat-card>
import { MatFormFieldModule } from '@angular/material/form-field'; // For <mat-form-field>
import { MatInputModule } from '@angular/material/input';     // For matInput directive
import { MatButtonModule } from '@angular/material/button';     // For mat-raised-button, mat-stroked-button
import { MatIconModule } from '@angular/material/icon';       // For <mat-icon>

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Add Angular Material Modules here
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './student-create.html',
  styleUrls: ['./student-create.scss']
})
export class StudentCreateComponent {
  newStudent = {
    name: '',
    idTcs: '',
    description: ''
  };

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  createStudent(): void {
    this.successMessage = null;
    this.errorMessage = null;

    this.studentService.createStudent(this.newStudent).subscribe({
      next: () => {
        this.successMessage = 'Aluno criado com sucesso! ✅';
        setTimeout(() => this.router.navigate(['/students']), 1000);
      },
      error: (err) => {
        console.error('Erro ao criar aluno:', err);
        this.errorMessage = 'Não foi possível criar o aluno. ❌';
        if (err.status === 409) {
          this.errorMessage = 'Já existe um aluno com essa matrícula. ⚠️';
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}