import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// NOVO: Importações para MatSnackBar e o componente customizado
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmSnackbarComponent } from '../shared/components/snackBar/confirm-snackbar.component'; // Importe o componente de confirmação

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
    MatSelectModule,
    MatSnackBarModule, // Adicione MatSnackBarModule
    ConfirmSnackbarComponent // Adicione ConfirmSnackbarComponent
  ],
  templateUrl: './daily-list.component.html',
  styleUrls: ['./daily-list.component.scss']
})
export class DailyListComponent implements OnInit {
  dailies: DailyAnnotation[] = [];
  students: StudentResponse[] = [];
  selectedStudentId: number | null = null;
  // errorMessage: string | null = null; // Removido, pois o snackbar fará o trabalho
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
        // this.errorMessage = 'Falha ao carregar a lista de alunos.'; // Removido
        console.error(err);
        this.openSnackBar('Falha ao carregar a lista de alunos. ❌', 'error'); // Usando snackbar
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
        // this.errorMessage = 'Falha ao carregar as dailies.'; // Removido
        console.error(err);
        this.openSnackBar('Falha ao carregar as dailies. ❌', 'error'); // Usando snackbar
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

  // NOVO: Método para exibir o snackbar de confirmação para exclusão
  confirmDeleteDaily(id: number): void {
    const snackBarRef = this.snackBar.openFromComponent(ConfirmSnackbarComponent, {
      data: {
        message: 'Tem certeza que deseja excluir esta daily?',
        confirmText: 'Sim', // Mantido como "Sim"
        cancelText: 'Não'  // Mantido como "Não"
      },
      duration: 5000, // Snackbar visível por 5 segundos
      horizontalPosition: 'center', // Este continua centralizado
      verticalPosition: 'bottom',
      panelClass: ['confirm-snackbar'] // Classe CSS para estilização
    });

    snackBarRef.onAction().subscribe(() => {
      // Se o usuário clicou em 'Sim'
      this._performDeleteDaily(id);
    });
  }

  // NOVO: Método privado que executa a exclusão real após a confirmação
  private _performDeleteDaily(id: number): void {
    this.dailyService.deleteDaily(id).subscribe({
      next: () => {
        this.openSnackBar('Daily excluída com sucesso! ✅', 'success'); // Usando snackbar com emoji e direita
        this.loadDailies(this.selectedStudentId || undefined);
      },
      error: (err) => {
        // this.errorMessage = 'Falha ao excluir a daily.'; // Removido
        console.error(err);
        this.openSnackBar('Falha ao excluir a daily. ❌', 'error'); // Usando snackbar com emoji e direita
      }
    });
  }

  // NOVO: Método auxiliar para abrir snackbars de sucesso/erro
  private openSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000, // Duração de 3 segundos
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar'],
      horizontalPosition: 'right', // Definido para a direita
      verticalPosition: 'bottom'
    });
  }
}
