// src/app/students/student-list/student-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe este
import { StudentService } from '../student'; // Vamos criar este serviço em breve
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';




// Interface para o DTO de Resposta do Aluno (ajuste conforme seu backend)
interface StudentResponse {
  id: number;
  name: string;
  idTcs: string;
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
  students: StudentResponse[] = []; // Array para armazenar os alunos
  errorMessage: string | null = null;
    creatingNew: boolean = false;
  newStudentName: string = '';
  newStudentIdTcs: string = '';


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
        // Você pode adicionar mais lógica para tratar diferentes erros aqui
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
}

saveStudent(id: number): void {
  const updatedStudent = {
    name: this.editedName,
    idTcs: this.editedIdTcs
  };

  this.studentService.updateStudent(id, updatedStudent).subscribe({
    next: () => {
      const index = this.students.findIndex(s => s.id === id);
      if (index !== -1) {
        this.students[index].name = this.editedName;
        this.students[index].idTcs = this.editedIdTcs;
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
}

cancelCreating(): void {
  this.creatingNew = false;
}

saveNewStudent(): void {
  const newStudent = {
    name: this.newStudentName,
    idTcs: this.newStudentIdTcs,
    grupoId: null
  };

  this.studentService.createStudent(newStudent).subscribe({
    next: (created) => {
      this.students.push(created);
      this.creatingNew = false;
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