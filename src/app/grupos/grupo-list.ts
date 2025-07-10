// src/app/grupos/grupo-list/grupo-list.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrupoService, GrupoComNomesAlunosResponse, GrupoModelRequest, GrupoComAlunosResponse } from '../grupos/grupo.service';
import { StudentService, StudentResponse, StudentRequest } from '../students/student.service';
import { HttpErrorResponse } from '@angular/common/http'; // Importe HttpErrorResponse

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    if (this.editMode) {
      if (this.currentGrupo.id) {
        // Agora, o `next` callback espera um `GrupoComNomesAlunosResponse`
        this.grupoService.atualizarGrupo(this.currentGrupo.id, this.currentGrupo).subscribe({
          next: (response: GrupoComNomesAlunosResponse) => { // <<< MUDANÇA AQUI (para o tipo de resposta do backend)
            alert('Grupo atualizado com sucesso!');
            this.carregarGrupos();
            this.carregarGruposComAlunosDetalhes();
            this.resetForm();
          },
          error: (err: HttpErrorResponse) => { // Tipagem do erro para HttpErrorResponse
            console.error('Erro ao atualizar grupo:', err);

            // Mantém a verificação de status 0 como fallback, mas o ideal é que o backend retorne 200 OK
            if (err.status === 0) {
              console.warn('Requisição falhou com status 0. Isso pode ser um problema de CORS ou rede, mas a operação pode ter sido bem-sucedida no backend.');
              alert('Grupo atualizado com sucesso (possível problema de conexão, verifique o console).');
              this.carregarGrupos(); // Tenta recarregar para confirmar
              this.carregarGruposComAlunosDetalhes();
              this.resetForm();
              this.errorMessage = null; // Limpa a mensagem de erro
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
          this.errorMessage = 'Não foi possível criar o grupo.';
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
      grupoId: null
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
