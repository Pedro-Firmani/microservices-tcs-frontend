import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../auth/auth';
import { StudentService, StudentResponse, StudentRequest } from '../student.service';
import { NotificationService } from '../../shared/notification.service';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    MatInputModule
  ],
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.scss']
})
export class StudentListComponent implements OnInit {
  students: StudentResponse[] = [];
  errorMessage: string | null = null;
  isProfessor: boolean = true;
  editingStudentId: number | null = null;
  editedName: string = '';
  editedIdTcs: string = '';
  editedDescription: string = '';

  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' | null = null;

  constructor(
    private studentService: StudentService,
    private router: Router,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadStudents();

    const messageData = this.notificationService.consumeMessage();
    if (messageData) {
      this.notificationMessage = messageData.message;
      this.notificationType = messageData.type;

      setTimeout(() => {
        this.notificationMessage = null;
        this.notificationType = null;
      }, 5000);
    }
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: StudentResponse[]) => {
        this.students = data;
        this.errorMessage = null;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar alunos:', err);
        this.errorMessage = 'Não foi possível carregar a lista de alunos.';
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
      const requestData: StudentRequest = {
        name: this.editedName,
        idTcs: this.editedIdTcs,
        description: this.editedDescription,
        grupoId: studentToUpdate.grupoId
      };

      this.studentService.updateStudent(id, requestData).subscribe({
        next: () => {
          this.loadStudents();
          this.editingStudentId = null;
          this.notificationService.setMessage('Aluno atualizado com sucesso!', 'success');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao salvar aluno:', err);
          this.errorMessage = 'Não foi possível salvar as alterações.';
          this.notificationService.setMessage('Erro ao atualizar aluno.', 'error');
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
          this.notificationService.setMessage('Aluno excluído com sucesso.', 'success');
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao excluir aluno:', err);
          this.errorMessage = 'Não foi possível excluir o aluno.';
          this.notificationService.setMessage('Erro ao excluir aluno.', 'error');
        }
      });
    }
  }
}
