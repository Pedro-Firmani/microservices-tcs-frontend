import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StudentService } from '../student';
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { f } from "../../../../node_modules/@angular/material/icon-module.d-COXCrhrh"; // Ajuste o path se necessário

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCard, MatCardModule, MatInputModule, f],
  templateUrl: './student-create.html',
  styleUrls: ['./student-create.scss']
})
export class StudentCreateComponent {
  newStudent = {
    name: '',
    idTcs: ''
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
        this.successMessage = 'Aluno criado com sucesso!';
        setTimeout(() => this.router.navigate(['/students']), 1000);
      },
      error: (err) => {
        console.error('Erro ao criar aluno:', err);
        this.errorMessage = 'Não foi possível criar o aluno.';
        if (err.status === 409) {
          this.errorMessage = 'Já existe um aluno com essa matrícula.';
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}
