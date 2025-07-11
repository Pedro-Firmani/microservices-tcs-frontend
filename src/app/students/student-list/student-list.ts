import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
// Import StudentService e StudentResponse do arquivo de serviço correto
import { StudentService, StudentResponse, StudentRequest } from '../student.service';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http'; // Para tipagem de erros

// Angular Material Imports
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
  students: StudentResponse[] = []; // Alterado para StudentResponse[]
  errorMessage: string | null = null;
  isProfessor: boolean = true; // Considere obter isso de um serviço de autenticação
  editingStudentId: number | null = null; // Alterado para number | null para consistência com id: number
  editedName: string = '';
  editedIdTcs: string = '';
  editedDescription: string = ''; // Corrigido para 'description'

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: StudentResponse[]) => { // Tipagem explícita
        this.students = data;
        this.errorMessage = null;
      },
      error: (err: HttpErrorResponse) => { // Tipagem explícita
        console.error('Erro ao carregar alunos:', err);
        this.errorMessage = 'Não foi possível carregar a lista de alunos.';
        this.students = [];
      }
    });
  }

  goToCreateStudent(): void {
    this.router.navigate(['/students/create']);
  }

  editStudent(student: StudentResponse): void { // Alterado para StudentResponse
    this.editingStudentId = student.id;
    this.editedName = student.name;
    this.editedIdTcs = student.idTcs;
    // Garante que a descrição seja definida, mesmo que nula ou indefinida
    this.editedDescription = student.description || '';
  }

  saveStudent(id: number): void { // ID como number
    const studentToUpdate = this.students.find(s => s.id === id);
    if (studentToUpdate) {
      const updatedStudentData: StudentResponse = { // Tipagem explícita
        ...studentToUpdate, // Mantém outras propriedades como grupoId, grupoNome
        name: this.editedName,
        idTcs: this.editedIdTcs,
        description: this.editedDescription
      };

      // Agora, o método updateStudent no serviço espera StudentRequest.
      // Você pode criar um objeto StudentRequest a partir de StudentResponse.
      const requestData: StudentRequest = {
        name: updatedStudentData.name,
        idTcs: updatedStudentData.idTcs,
        description: updatedStudentData.description,
        grupoId: updatedStudentData.grupoId
      };


      this.studentService.updateStudent(id, requestData).subscribe({ // Passando requestData
        next: () => {
          this.loadStudents();
          this.editingStudentId = null;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao salvar aluno:', err);
          this.errorMessage = 'Não foi possível salvar as alterações.';
        }
      });
    }
  }

  cancelEditing(): void {
    this.editingStudentId = null;
  }

  deleteStudent(id: number): void { // ID como number
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao excluir aluno:', err);
          this.errorMessage = 'Não foi possível excluir o aluno.';
        }
      });
    }
  }
}