import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth';
import { StudentService, StudentResponse, StudentRequest } from '../student.service';
import { HttpErrorResponse } from '@angular/common/http';

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Importe o novo componente de confirmação do snackbar
import { ConfirmSnackbarComponent } from '../../shared/components/snackBar/confirm-snackbar.component';

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
    MatInputModule,
    MatSnackBarModule,
    // Adicione o ConfirmSnackbarComponent aqui se ele for usado como parte do módulo,
    // mas se ele for um componente para ser injetado, não precisa estar nos imports do @Component.
    // MatSnackBar já faz a injeção do componente dinamicamente.
  ],
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.scss']
})
export class StudentListComponent implements OnInit {
  students: StudentResponse[] = [];
  isProfessor: boolean = true;
  editingStudentId: number | null = null;
  editedName: string = '';
  editedIdTcs: string = '';
  editedDescription: string = '';

  constructor(
    private studentService: StudentService,
    private router: Router,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: StudentResponse[]) => {
        this.students = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar alunos:', err);
        this.snackBar.open('Não foi possível carregar a lista de alunos. ❌', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
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
      const updatedStudentData: StudentResponse = {
        ...studentToUpdate,
        name: this.editedName,
        idTcs: this.editedIdTcs,
        description: this.editedDescription
      };

      const requestData: StudentRequest = {
        name: updatedStudentData.name,
        idTcs: updatedStudentData.idTcs,
        description: updatedStudentData.description,
        grupoId: updatedStudentData.grupoId
      };

      this.studentService.updateStudent(id, requestData).subscribe({
        next: () => {
          this.loadStudents();
          this.editingStudentId = null;
          this.snackBar.open('Aluno salvo com sucesso! ✅', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao salvar aluno:', err);
          this.snackBar.open('Não foi possível salvar as alterações. ❌', 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      });
    }
  }

  cancelEditing(): void {
    this.editingStudentId = null;
  }

  deleteStudent(id: number): void {
    // Substitui o confirm() nativo pelo MatSnackBar com componente de confirmação
    const snackBarRef = this.snackBar.openFromComponent(ConfirmSnackbarComponent, {
      data: {
        message: 'Tem certeza que deseja excluir este aluno?',
        confirmText: 'Sim',
        cancelText: 'Não'
      },
      duration: 5000, // Tempo para o snackbar desaparecer se não houver interação
      horizontalPosition: 'center', // Centraliza para melhor visibilidade da confirmação
      verticalPosition: 'bottom',
      panelClass: ['confirm-snackbar'] // Opcional: para estilos específicos
    });

    snackBarRef.onAction().subscribe(() => {
      // Ação clicada (botão "Sim")
      this.studentService.deleteStudent(id).subscribe({
        next: () => {
          this.loadStudents();
          this.snackBar.open('Aluno excluído com sucesso! ✅', 'Fechar', {
            duration: 3000,
            panelClass: ['success-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao excluir aluno:', err);
          this.snackBar.open('Não foi possível excluir o aluno. ❌', 'Fechar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        }
      });
    });

    // Opcional: Se quiser fazer algo quando o snackbar for fechado sem ação (ex: tempo limite)
    snackBarRef.afterDismissed().subscribe(info => {
      if (!info.dismissedByAction) {
        console.log('Confirmação de exclusão ignorada ou tempo limite atingido.');
      }
    });
  }
}