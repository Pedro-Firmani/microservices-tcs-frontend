import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Mantenha FormsModule para ngModel
import { Router, ActivatedRoute } from '@angular/router';

import { StudentService, StudentRequest, StudentResponse } from '../student.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './student-create.html',
  styleUrls: ['./student-create.scss']
})
export class StudentCreateComponent implements OnInit {
  student: StudentRequest = {
    name: '',
    idTcs: '',
    description: ''
  };

  isEditMode = false;
  private studentId: number | null = null;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.studentId = Number(id);
      this.studentService.getStudentById(this.studentId).subscribe(data => {
        this.student = data;
      });
    }
  }

  saveStudent(): void {
    // --- Nova Lógica de Validação Front-end ---
    if (!this.student.name || this.student.name.trim() === '') {
      this.snackBar.open('O nome do aluno é obrigatório. ⚠️', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
      return; // Impede a execução do restante da função
    }

    if (!this.student.idTcs || this.student.idTcs.trim() === '') {
      this.snackBar.open('A matrícula (ID TCS) é obrigatória. ⚠️', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
      return; // Impede a execução do restante da função
    }
    // --- Fim da Nova Lógica de Validação Front-end ---


    if (this.isEditMode && this.studentId) {
      this.studentService.updateStudent(this.studentId, this.student).subscribe({
        next: () => {
          this.snackBar.open('Aluno atualizado com sucesso! ✅', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
          setTimeout(() => this.router.navigate(['/students']), 1000);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      this.studentService.createStudent(this.student).subscribe({
        next: () => {
          this.snackBar.open('Aluno criado com sucesso! ✅', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
          setTimeout(() => this.router.navigate(['/students']), 1000);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleError(err: any): void {
    console.error('Erro:', err);
    let message = 'Não foi possível salvar o aluno. ❌';
    if (err.status === 409) {
      message = 'Já existe um aluno com essa matrícula. ⚠️';
    }
    this.snackBar.open(message, 'Fechar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}
