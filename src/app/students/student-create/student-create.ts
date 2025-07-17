import { Component, OnInit } from '@angular/core'; // Adicionado OnInit
import { CommonModule, Location } from '@angular/common'; // Adicionado Location
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // Adicionado ActivatedRoute

import { StudentService, StudentRequest, StudentResponse } from '../student.service';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-student-create', // O seletor continua o mesmo
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './student-create.html',
  styleUrls: ['./student-create.scss']
})
export class StudentCreateComponent implements OnInit { // Implementado OnInit
  // Renomeado para 'student' para ser mais genérico
  student: StudentRequest = {
    name: '',
    idTcs: '',
    description: ''
  };

  isEditMode = false;
  private studentId: number | null = null;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute, // Injetado para ler a URL
    private location: Location // Injetado para o botão 'voltar'
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.studentId = Number(id);
      this.studentService.getStudentById(this.studentId).subscribe(data => {
        this.student = data; // Popula o formulário com os dados do aluno
      });
    }
  }

  // Renomeado para 'saveStudent'
  saveStudent(): void {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.isEditMode && this.studentId) {
      // --- LÓGICA DE ATUALIZAÇÃO ---
      this.studentService.updateStudent(this.studentId, this.student).subscribe({
        next: () => {
          this.successMessage = 'Aluno atualizado com sucesso! ✅';
          setTimeout(() => this.router.navigate(['/students']), 1000);
        },
        error: (err) => this.handleError(err)
      });
    } else {
      // --- LÓGICA DE CRIAÇÃO ---
      this.studentService.createStudent(this.student).subscribe({
        next: () => {
          this.successMessage = 'Aluno criado com sucesso! ✅';
          setTimeout(() => this.router.navigate(['/students']), 1000);
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  // Função para tratar erros
  private handleError(err: any): void {
    console.error('Erro:', err);
    this.errorMessage = 'Não foi possível salvar o aluno. ❌';
    if (err.status === 409) {
      this.errorMessage = 'Já existe um aluno com essa matrícula. ⚠️';
    }
  }

  goBack(): void {
    this.location.back();
  }
}