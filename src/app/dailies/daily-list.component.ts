import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// Modelos e Serviços
import { DailyAnnotation } from './daily.model';
import { DailyService } from './daily.service';
import { AuthService } from '../auth/auth';
import { StudentService } from './../students/student.service'; // <-- 1. IMPORTAR O SERVIÇO DE ALUNOS
import { StudentResponse } from './../students/student';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-daily-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './daily-list.component.html',
  styleUrls: ['./daily-list.component.scss']
})
export class DailyListComponent implements OnInit {
  dailies: DailyAnnotation[] = [];
  errorMessage: string | null = null;
  private studentsMap = new Map<number, string>(); // <-- 2. MAPA PARA GUARDAR OS NOMES DOS ALUNOS

  constructor(
    private dailyService: DailyService,
    private studentService: StudentService, // <-- 3. INJETAR O SERVIÇO DE ALUNOS
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadDailies();
  }

  loadDailies(): void {
    // 4. PRIMEIRO, CARREGAMOS OS ALUNOS
    this.studentService.getAllStudents().subscribe({
      next: (students: StudentResponse[]) => {
        // Criamos um mapa de ID -> Nome para fácil acesso
        students.forEach(student => {
          this.studentsMap.set(student.id, student.name);
        });

        // 5. DEPOIS DE TER OS ALUNOS, CARREGAMOS AS DAILIES
        this.dailyService.getDailies().subscribe({
          next: (dailiesData) => {
            // 6. PARA CADA DAILY, ADICIONAMOS O NOME DO ALUNO
            this.dailies = dailiesData.map(daily => {
              return {
                ...daily, // Copia todas as propriedades existentes da daily
                alunoNome: this.studentsMap.get(daily.studentId) // Adiciona/sobrescreve a propriedade alunoNome
              };
            });
          },
          error: (err) => {
            this.errorMessage = 'Falha ao carregar as dailies.';
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar a lista de alunos.';
        console.error(err);
      }
    });
  }

  deleteDaily(id: number): void {
    if (confirm('Tem a certeza que deseja excluir esta daily?')) {
      this.dailyService.deleteDaily(id).subscribe({
        next: () => {
          this.snackBar.open('Daily excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.loadDailies();
        },
        error: (err) => {
          this.errorMessage = 'Falha ao excluir a daily.';
          console.error(err);
        }
      });
    }
  }
}