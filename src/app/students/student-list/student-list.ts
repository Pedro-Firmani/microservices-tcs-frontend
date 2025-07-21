import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth';
import { StudentService, StudentResponse, StudentRequest } from '../student.service'; // Mantenha StudentRequest aqui
import { HttpErrorResponse } from '@angular/common/http';
import { TagService } from '../../tags/tag.service'; // Importe TagService
import { Tag } from '../../tags/tag.model'; // Importe o modelo Tag

// Angular Material Imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule,
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
  tags: Tag[] = [];
  editedTagId: number | null = null;

  constructor(
    private studentService: StudentService,
    private router: Router,
    public authService: AuthService,
    private snackBar: MatSnackBar,
    public tagService: TagService // <--- CORREÇÃO CRÍTICA AQUI: PRECISA SER PÚBLICO
  ) {}

  ngOnInit(): void {
    this.loadStudents();
    this.loadTags();
  }

  loadTags(): void {
    this.tagService.getAllTags().subscribe(data => {
      console.log('%c1. Tags Carregadas (Frontend):', 'color: green; font-weight: bold;', data);
      this.tags = data;
    });
  }

  // <--- CORREÇÃO CRÍTICA AQUI: MÉTODOS getTagColor e getTagName SÃO ESSENCIAIS
  getTagColor(studentColor: string | null | undefined): string {
      if (!studentColor) {
          return '#673ab7'; // Cor padrão (roxo) se não houver cor
      }
      return studentColor;
  }

  getTagName(tagId: number | null | undefined): string {
    if (!tagId) {
      return '';
    }
    const tag = this.tags.find(t => t.id === tagId);
    return tag ? tag.name.split('').join('<br>') : '';
  }
  // <--- FIM DOS MÉTODOS ESSENCIAIS


  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: StudentResponse[]) => {
        console.log('%c2. Alunos Carregados (Frontend):', 'color: blue; font-weight: bold;', data);
        data.forEach(student => {
          console.log(`Aluno: ${student.name}, ID TCS: ${student.idTcs}, Cor da Tag: ${student.color}`); // ESTE LOG É CHAVE
        });
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
    this.editedTagId = student.tagId || null;
  }

  saveStudent(id: number): void {
    const studentToUpdate = this.students.find(s => s.id === id);
    if (studentToUpdate) {
      const selectedTag = this.tags.find(t => t.id === this.editedTagId);
      const tagColor = selectedTag ? selectedTag.color : null;

      const requestData: StudentRequest = {
        name: this.editedName,
        idTcs: this.editedIdTcs,
        description: this.editedDescription,
        grupoId: studentToUpdate.grupoId,
        tagId: this.editedTagId,
        color: tagColor // <<-- ESTE CAMPO ESTÁ SENDO ENVIADO AO BACKEND
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
    const snackBarRef = this.snackBar.openFromComponent(ConfirmSnackbarComponent, {
      data: {
        message: 'Tem certeza que deseja excluir este aluno?',
        confirmText: 'Sim',
        cancelText: 'Não'
      },
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['confirm-snackbar']
    });

    snackBarRef.onAction().subscribe(() => {
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

    snackBarRef.afterDismissed().subscribe(info => {
      if (!info.dismissedByAction) {
        console.log('Confirmação de exclusão ignorada ou tempo limite atingido.');
      }
    });
  }
}