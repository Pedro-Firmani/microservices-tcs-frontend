// src/app/students/student-list/student-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService, StudentResponse, StudentRequest } from '../student.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.scss']
})
// V ↓↓↓ VERIFIQUE SE O 'export' ESTÁ AQUI ↓↓↓
export class StudentListComponent implements OnInit {
  editingStudentId: number | null = null;
  editedName: string = '';
  editedIdTcs: string = '';
  editedDescription: string = '';
  students: StudentResponse[] = [];
  errorMessage: string | null = null;
  creatingNew: boolean = false;
  newStudentName: string = '';
  newStudentIdTcs: string = '';
  newStudentDescription: string = '';

  public isProfessor: boolean = false;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isProfessor = this.authService.hasRole('PROFESSOR');
    this.loadStudents();
  }

  // ... resto do código ...
  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar alunos:', err);
        this.errorMessage = 'Não foi possível carregar a lista de alunos.';
      }
    });
  }

  editStudent(student: StudentResponse): void {
    this.editingStudentId = student.id;
    this.editedName = student.name;
    this.editedIdTcs = student.idTcs;
    this.editedDescription = student.description || '';
  }

  saveStudent(id: number): void {
    const updatedStudent: StudentRequest = {
      name: this.editedName,
      idTcs: this.editedIdTcs,
      description: this.editedDescription
    };
    this.studentService.updateStudent(id, updatedStudent).subscribe({
      next: () => {
        this.loadStudents();
        this.editingStudentId = null;
      },
      error: (err: any) => {
        alert('Erro ao atualizar aluno.');
      }
    });
  }

  startCreating(): void {
    this.creatingNew = true;
  }

  cancelCreating(): void {
    this.creatingNew = false;
  }

  saveNewStudent(): void {
    const newStudent: StudentRequest = {
      name: this.newStudentName,
      idTcs: this.newStudentIdTcs,
      description: this.newStudentDescription,
      grupoId: null
    };
    this.studentService.createStudent(newStudent).subscribe({
      next: () => {
        this.loadStudents();
        this.creatingNew = false;
      },
      error: (err: any) => {
        alert('Erro ao criar aluno.');
      }
    });
  }

  deleteStudent(id: number): void {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.students = this.students.filter(s => s.id !== id);
        },
        error: (err: any) => {
          console.error('Erro ao excluir aluno:', err);
          alert('Erro ao excluir aluno.');
        }
      });
    }
  }
}