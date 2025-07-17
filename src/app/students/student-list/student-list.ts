import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth';
import { StudentService, StudentResponse, StudentRequest } from '../student.service';
import { HttpErrorResponse } from '@angular/common/http';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// REMOVIDO: import { NotificationService } from 'caminho/para/o/seu/notification.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.scss']
})
export class StudentListComponent implements OnInit {
  students: StudentResponse[] = [];
  isProfessor: boolean = true;
  editingStudentId: number | null = null;
  editedName: string = '';
  editedIdTcs: string = '';
  editedDescription: string = '';

  // REMOVIDO: notificationMessage: string | null = null;
  // REMOVIDO: notificationType: string | null = null;

  constructor(
    private studentService: StudentService,
    private router: Router,
    public authService: AuthService,
    private snackBar: MatSnackBar
    // REMOVIDO: private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadStudents();

    // REMOVIDO: Todo o bloco de código que usava notificationService, notificationMessage e notificationType
    /*
    const messageData = this.notificationService.consumeMessage();
    if (messageData) {
      this.notificationMessage = messageData.message;
      this.notificationType = messageData.type;

      setTimeout(() => {
        this.notificationMessage = null;
        this.notificationType = null;
      }, 5000);
    }
    */
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: StudentResponse[]) => {
        this.students = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar alunos:', err);
        this.snackBar.open('Não foi possível carregar a lista de alunos. ❌', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.students = [];
      }
    });
  }

  goToCreateStudent(): void {
    this.router.navigate(['/students/create']);
  }

  editStudent(student: StudentResponse): void {
    this.editingStudentId = student.id;
    this.editedName = student.name;
    this.editedIdTcs = student.idTcs;
    this.editedDescription = student.description || '';
  }

  saveStudent(id: number): void {
    const studentToUpdate = this.students.find(s => s.id === id);
    if (studentToUpdate) {
      const updatedStudentData: StudentResponse = {
        ...studentToUpdate,
        name: this.editedName,
        idTcs: this.editedIdTcs,
        description: this.editedDescription
      };

      const requestData: StudentRequest = {
        name: updatedStudentData.name,
        idTcs: updatedStudentData.idTcs,
        description: updatedStudentData.description,
        grupoId: updatedStudentData.grupoId
      };

      this.studentService.updateStudent(id, requestData).subscribe({
        next: () => {
          this.loadStudents();
          this.editingStudentId = null;
          this.snackBar.open('Aluno salvo com sucesso! ✅', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao salvar aluno:', err);
          this.snackBar.open('Não foi possível salvar as alterações. ❌', 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }

  cancelEditing(): void {
    this.editingStudentId = null;
  }

  deleteStudent(id: number): void {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents();
          this.snackBar.open('Aluno excluído com sucesso! ✅', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao excluir aluno:', err);
          this.snackBar.open('Não foi possível excluir o aluno. ❌', 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }
}