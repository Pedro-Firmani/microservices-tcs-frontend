// src/app/students/student-list/student-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../student';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Interface para o DTO de Resposta do Aluno (ajuste conforme seu backend)
// Certifique-se de que esta interface esteja completa com todos os campos que seu backend envia
interface StudentResponse {
  id: number;
  name: string;
  idTcs: string;
  description?: string | null; // Adicione esta linha
  grupoId?: number | null;
  grupoNome?: string | null;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.scss']
})
export class StudentListComponent implements OnInit {
  editingStudentId: number | null = null;
  editedName: string = '';
  editedIdTcs: string = '';
  editedDescription: string = ''; // Novo campo para edição
  students: StudentResponse[] = [];
  errorMessage: string | null = null;
  creatingNew: boolean = false;
  newStudentName: string = '';
  newStudentIdTcs: string = '';
  newStudentDescription: string = ''; // Novo campo para criação

  constructor(
    private studentService: StudentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: (err) => {
        console.error('Erro ao carregar alunos:', err);
        this.errorMessage = 'Não foi possível carregar a lista de alunos.';
        if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'Você não tem permissão para ver os alunos. Faça login como PROFESSOR ou ALUNO.';
        }
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
    const updatedStudent = {
      name: this.editedName,
      idTcs: this.editedIdTcs,
      description: this.editedDescription 
     
    };

    this.studentService.updateStudent(id, updatedStudent).subscribe({
      next: () => {
        const index = this.students.findIndex(s => s.id === id);
        if (index !== -1) {
          this.students[index].name = this.editedName;
          this.students[index].idTcs = this.editedIdTcs;
          this.students[index].description = this.editedDescription; 
        }
        this.editingStudentId = null;
      },
      error: (err) => {
        console.error('Erro ao atualizar aluno:', err);
        alert('Erro ao atualizar aluno.');
      }
    });
  }

  startCreating(): void {
    this.creatingNew = true;
    this.newStudentName = '';
    this.newStudentIdTcs = '';
    this.newStudentDescription = ''; // Limpa o campo de descrição
  }

  cancelCreating(): void {
    this.creatingNew = false;
    this.newStudentName = '';
    this.newStudentIdTcs = '';
    this.newStudentDescription = ''; // Limpa o campo de descrição ao cancelar
  }

  saveNewStudent(): void {
    const newStudent = {
      name: this.newStudentName,
      idTcs: this.newStudentIdTcs,
      description: this.newStudentDescription, // Inclui a descrição na criação
      grupoId: null // Mantém como nulo ou adicione um campo para seleção de grupo
    };

    this.studentService.createStudent(newStudent).subscribe({
      next: (created) => {
        this.students.push(created);
        this.creatingNew = false;
        this.newStudentName = ''; // Limpa os campos após a criação
        this.newStudentIdTcs = '';
        this.newStudentDescription = '';
      },
      error: (err) => {
        console.error('Erro ao criar aluno:', err);
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
        error: (err) => {
          console.error('Erro ao excluir aluno:', err);
          alert('Erro ao excluir aluno.');
        }
      });
    }
  }
}