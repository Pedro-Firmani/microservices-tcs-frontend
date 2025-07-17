import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// Modelos e Serviços
import { DailyAnnotation } from './daily.model';
import { DailyService } from './daily.service';
import { AuthService } from '../auth/auth';
import { StudentService } from './../students/student.service';
import { StudentResponse } from './../students/student';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-daily-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './daily-list.component.html',
  styleUrls: ['./daily-list.component.scss']
})
export class DailyListComponent implements OnInit {
  dailies: DailyAnnotation[] = [];
  students: StudentResponse[] = [];
  selectedStudentId: number | null = null;
  errorMessage: string | null = null;
  private studentsMap = new Map<number, string>();

  constructor(
    private dailyService: DailyService,
    private studentService: StudentService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadStudents();
    this.loadDailies();
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (studentsData) => {
        this.students = studentsData;
        studentsData.forEach(student => {
          this.studentsMap.set(student.id, student.name);
        });
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar a lista de alunos.';
        console.error(err);
      }
    });
  }

  loadDailies(studentId?: number): void {
    const request$ = studentId
      ? this.dailyService.getDailiesByStudent(studentId)
      : this.dailyService.getDailies();

    request$.subscribe({
      next: (dailiesData) => {
        this.dailies = dailiesData.map(daily => ({
          ...daily,
          alunoNome: this.studentsMap.get(daily.studentId)
        }));
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar as dailies.';
        console.error(err);
      }
    });
  }

  filterByStudent(): void {
    if (this.selectedStudentId) {
      this.loadDailies(this.selectedStudentId);
    } else {
      this.loadDailies();
    }
  }

  deleteDaily(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta daily?')) {
      this.dailyService.deleteDaily(id).subscribe({
        next: () => {
          this.snackBar.open('Daily excluída com sucesso!', 'Fechar', { duration: 3000 });
          this.loadDailies(this.selectedStudentId || undefined);
        },
        error: (err) => {
          this.errorMessage = 'Falha ao excluir a daily.';
          console.error(err);
        }
      });
    }
  }
}
