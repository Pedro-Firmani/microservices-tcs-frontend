// src/app/students/student-list/student-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe este
import { StudentService } from '../student'; // Vamos criar este serviço em breve

// Interface para o DTO de Resposta do Aluno (ajuste conforme seu backend)
interface StudentResponse {
  id: number;
  name: string;
  idTcs: string;
}

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule,], // HttpClientModule pode ser opcional aqui se já está em app.config.ts
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.scss']
})
export class StudentListComponent implements OnInit {
  students: StudentResponse[] = []; // Array para armazenar os alunos
  errorMessage: string | null = null;

  constructor(private studentService: StudentService) { }

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
}