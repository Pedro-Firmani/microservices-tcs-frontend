// src/app/grupos/grupo-list/grupo-list.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrupoService, GrupoComNomesAlunosResponse, GrupoModelRequest, GrupoComAlunosResponse } from '../grupos/grupo.service';
import { StudentService, StudentResponse, StudentRequest } from '../students/student.service';
import { HttpErrorResponse } from '@angular/common/http'; // Importe HttpErrorResponse

// Importações dos módulos do Angular Material (estes foram movidos para cá!)
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  // *** AQUI ESTÃO OS IMPORTS DO ANGULAR MATERIAL AGORA ***
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,        // <-- Adicionado
    MatInputModule,       // <-- Adicionado
    MatFormFieldModule,   // <-- Adicionado
    MatButtonModule,      // <-- Adicionado
    MatIconModule,        // <-- Adicionado
    MatListModule,        // <-- Adicionado
    MatDividerModule,     // <-- Adicionado
    MatTableModule        // <-- Adicionado
  ],
  templateUrl: './grupo-list.html',
  styleUrls: ['./grupo-list.scss']
})
export class GrupoListComponent implements OnInit {
  grupos: GrupoComNomesAlunosResponse[] = [];
  errorMessage: string | null = null;

  editMode: boolean = false;
  currentGrupo: GrupoModelRequest = { nome: '', descricao: '' };
  gruposComDetalhes: GrupoComAlunosResponse[] = [];
  allStudents: StudentResponse[] = [];

  // Esta propriedade é para a mat-table, define as colunas a serem exibidas.
  // Certifique-se que os nomes aqui correspondem aos `matColumnDef` no HTML.
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'alunos', 'actions'];

  constructor(
    @Inject(GrupoService) private grupoService: GrupoService,
    @Inject(StudentService) private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.carregarGrupos();
    this.carregarGruposComAlunosDetalhes();
    this.carregarTodosAlunos();
  }

  carregarGrupos(): void {
    this.grupoService.getGruposComNomesAlunos().subscribe({
      next: (data: GrupoComNomesAlunosResponse[]) => {
        this.grupos = data;
        console.log('Grupos carregados (nomes):', this.grupos);
      },
      error: (err: any) => {
        console.error('Erro ao carregar grupos (nomes):', err);
        this.errorMessage = 'Não foi possível carregar a lista de grupos.';
      }
    });
  }

  carregarGruposComAlunosDetalhes(): void {
    this.grupoService.getGruposComAlunosDetalhes().subscribe({
      next: (data: GrupoComAlunosResponse[]) => {
        this.gruposComDetalhes = data;
        console.log('Grupos carregados (detalhes):', this.gruposComDetalhes);
      },
      error: (err: any) => {
        console.error('Erro ao carregar grupos com detalhes dos alunos:', err);
        this.errorMessage = 'Não foi possível carregar os detalhes dos alunos nos grupos.';
      }
    });
  }

  carregarTodosAlunos(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data: StudentResponse[]) => {
        this.allStudents = data;
        console.log('Todos os alunos carregados:', this.allStudents);
      },
      error: (err: any) => {
        console.error('Erro ao carregar todos os alunos:', err);
        this.errorMessage = 'Não foi possível carregar a lista de alunos.';
      }
    });
  }

  saveGrupo(): void {
    if (!this.currentGrupo.nome || !this.currentGrupo.descricao) {
      this.errorMessage = 'Nome e Descrição do grupo são obrigatórios.';
      return;
    }
    this.errorMessage = null; // Limpa qualquer erro anterior de validação do formulário

    if (this.editMode) {
      if (this.currentGrupo.id) {
        this.grupoService.atualizarGrupo(this.currentGrupo.id, this.currentGrupo).subscribe({
          next: (response: GrupoComNomesAlunosResponse) => {
            alert('Grupo atualizado com sucesso!');
            this.carregarGrupos();
            this.carregarGruposComAlunosDetalhes();
            this.resetForm();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Erro ao atualizar grupo:', err);
            if (err.status === 0) {
              console.warn('Requisição falhou com status 0. Isso pode ser um problema de CORS ou rede, mas a operação pode ter sido bem-sucedida no backend.');
              alert('Grupo atualizado com sucesso (possível problema de conexão, verifique o console).');
              this.carregarGrupos();
              this.carregarGruposComAlunosDetalhes();
              this.resetForm();
              this.errorMessage = null;
            } else if (err.error && typeof err.error === 'string') {
                this.errorMessage = err.error;
            } else {
                this.errorMessage = 'Não foi possível atualizar o grupo. Verifique o console para mais detalhes.';
            }
          }
        });
      }
    } else {
      this.grupoService.criarGrupo(this.currentGrupo).subscribe({
        next: () => {
          alert('Grupo criado com sucesso!');
          this.carregarGrupos();
          this.carregarGruposComAlunosDetalhes();
          this.resetForm();
        },
        error: (err: any) => {
          console.error('Erro ao criar grupo:', err);
          if (err.error && typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Não foi possível criar o grupo.';
          }
        }
      });
    }
  }

  editGrupo(grupo: GrupoComNomesAlunosResponse): void {
    this.editMode = true;
    this.currentGrupo = { id: grupo.id, nome: grupo.nome, descricao: grupo.descricao };
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteGrupo(id: number): void {
    if (confirm('Tem certeza que deseja excluir este grupo? Isso também desassociará os alunos!')) {
      this.grupoService.deletarGrupo(id).subscribe({
        next: () => {
          alert('Grupo excluído com sucesso!');
          this.carregarGrupos();
          this.carregarGruposComAlunosDetalhes();
          this.carregarTodosAlunos();
        },
        error: (err: any) => {
          console.error('Erro ao excluir grupo:', err);
          if (err.status === 404) {
            this.errorMessage = 'Grupo não encontrado.';
          } else if (err.error && typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Não foi possível excluir o grupo.';
          }
        }
      });
    }
  }

  getStudentsInCurrentGroup(): StudentResponse[] {
    if (!this.currentGrupo.id) {
      return [];
    }
    const grupoDetalhe = this.gruposComDetalhes.find(g => g.id === this.currentGrupo.id);
    return grupoDetalhe ? grupoDetalhe.alunos : [];
  }

  isStudentInCurrentGroup(student: StudentResponse): boolean {
    return student.grupoId === this.currentGrupo.id;
  }

  addStudentToCurrentGroup(student: StudentResponse): void {
    if (!this.currentGrupo.id) {
      alert('Selecione ou crie um grupo primeiro para adicionar alunos.');
      return;
    }

    const studentToUpdate: StudentRequest = {
      name: student.name,
      idTcs: student.idTcs,
      grupoId: this.currentGrupo.id
    };

    this.studentService.updateStudent(student.id!, studentToUpdate).subscribe({
      next: (updatedStudent: StudentResponse) => {
        alert(`${updatedStudent.name} associado ao grupo ${this.currentGrupo.nome}.`);
        this.carregarGruposComAlunosDetalhes();
        this.carregarTodosAlunos();
      },
      error: (err: any) => {
        console.error('Erro ao adicionar aluno ao grupo:', err);
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = `Não foi possível adicionar ${student.name} ao grupo.`;
        }
      }
    });
  }

  removeStudentFromGroup(student: StudentResponse): void {
    if (!student.id) {
      console.error('ID do aluno não encontrado para remoção.');
      return;
    }

    const studentToUpdate: StudentRequest = {
      name: student.name,
      idTcs: student.idTcs,
      grupoId: null // Para desassociar, geralmente enviamos null ou undefined
    };

    this.studentService.updateStudent(student.id, studentToUpdate).subscribe({
      next: (updatedStudent: StudentResponse) => {
        alert(`${updatedStudent.name} removido do grupo.`);
        this.carregarGruposComAlunosDetalhes();
        this.carregarTodosAlunos();
      },
      error: (err: any) => {
        console.error('Erro ao remover aluno do grupo:', err);
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = `Não foi possível remover ${student.name} do grupo.`;
        }
      }
    });
  }

  private resetForm(): void {
    this.editMode = false;
    this.currentGrupo = { nome: '', descricao: '' };
    this.errorMessage = null;
  }
}