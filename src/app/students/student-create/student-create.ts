import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { StudentService, StudentRequest } from '../student.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from '../../shared/dialog/dialog-content.component';

@Component({
  selector: 'app-student-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './student-create.html',
  styleUrls: ['./student-create.scss']
})
export class StudentCreateComponent implements OnInit {
  student: StudentRequest = {
    name: '',
    idTcs: '',
    description: '',
    grupoId: 0
  };

  private router = inject(Router);
  private studentService = inject(StudentService);
  private dialog = inject(MatDialog);

  ngOnInit(): void {}

  saveStudent(form: NgForm): void {
    if (!this.student.name || !this.student.idTcs) {
      this.dialog.open(DialogContentComponent, {
        data: {
          title: 'Erro',
          message: 'Preencha todos os campos obrigatórios.'
        }
      });
      return;
    }

    this.studentService.createStudent(this.student).subscribe({
      next: () => {
        this.dialog.open(DialogContentComponent, {
          data: {
            title: 'Sucesso',
            message: 'Aluno criado com sucesso!'
          }
        });
        form.resetForm();
      },
      error: () => {
        this.dialog.open(DialogContentComponent, {
          data: {
            title: 'Erro',
            message: 'Não foi possível criar o aluno.'
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/students']);
  }
}
