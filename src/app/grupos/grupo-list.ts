<<<<<<< HEAD
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrupoService, GrupoComNomesAlunosResponse, GrupoModelRequest, GrupoComAlunosResponse } from '../grupos/grupo.service';
import { StudentService, StudentResponse, StudentRequest } from '../students/student.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth';

// Importações dos módulos do Angular Material (re-adicionados com base no seu primeiro exemplo)
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
=======
// src/app/grupos/grupo-list.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrupoService, GrupoComNomesAlunosResponse, GrupoModelRequest, GrupoComAlunosResponse } from '../grupos/grupo.service'; // Ajuste o caminho se necessário
import { StudentService, StudentResponse, StudentRequest } from '../students/student.service'; // Ajuste o caminho se necessário
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth'; // <<< NOVO: Importe o AuthService
>>>>>>> f8f3bbf1a1f654567dcec7ce724bc0d4a51a2647

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Módulos do Angular Material
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTableModule
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

<<<<<<< HEAD
  public isProfessor: boolean = false;

  // Colunas para a tabela Angular Material, se estiver usando-a
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'alunos', 'actions'];

  constructor(
    @Inject(GrupoService) private grupoService: GrupoService,
    @Inject(StudentService) private studentService: StudentService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isProfessor = this.authService.hasRole('PROFESSOR');
=======
  public isProfessor: boolean = false; // <<< NOVO: Propriedade para controlar a visibilidade

  constructor(
    private grupoService: GrupoService,
    private studentService: StudentService,
    private authService: AuthService // <<< NOVO: Injete o AuthService
  ) { }

  ngOnInit(): void {
    // <<< NOVO: Verifica a role do usuário assim que o componente é carregado
    this.isProfessor = this.authService.hasRole('PROFESSOR');

>>>>>>> f8f3bbf1a1f654567dcec7ce724bc0d4a51a2647
    this.carregarGrupos();
    this.carregarGruposComAlunosDetalhes();
    this.carregarTodosAlunos();
  }

  // ... O RESTANTE DO SEU CÓDIGO PERMANECE IGUAL ...
  // (carregarGrupos, saveGrupo, deleteGrupo, etc.)

  carregarGrupos(): void {
    this.grupoService.getGruposComNomesAlunos().subscribe({
        next: (data: GrupoComNomesAlunosResponse[]) => {
            this.grupos = data;
        },
        error: (err: any) => {
            this.errorMessage = 'Não foi possível carregar a lista de grupos.';
        }
    });
  }

  carregarGruposComAlunosDetalhes(): void {
    this.grupoService.getGruposComAlunosDetalhes().subscribe({
        next: (data: GrupoComAlunosResponse[]) => {
            this.gruposComDetalhes = data;
        },
        error: (err: any) => {
            this.errorMessage = 'Não foi possível carregar os detalhes dos alunos nos grupos.';
        }
    });
  }

  carregarTodosAlunos(): void {
    this.studentService.getAllStudents().subscribe({
        next: (data: StudentResponse[]) => {
            this.allStudents = data;
        },
        error: (err: any) => {
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
<<<<<<< HEAD
      if (this.currentGrupo.id) {
        this.grupoService.atualizarGrupo(this.currentGrupo.id, this.currentGrupo).subscribe({
          next: (response: GrupoComNomesAlunosResponse) => {
            alert('Grupo atualizado com sucesso!');
            this.carregarGrupos();
            this.carregarGruposComAlunosDetalhes();
            this.carregarTodosAlunos(); // Recarregar alunos para atualizar o status de grupo
            this.resetForm();
          },
          error: (err: HttpErrorResponse) => {
            console.error('Erro ao atualizar grupo:', err);
            if (err.status === 0) {
              console.warn('Requisição falhou com status 0. Isso pode ser um problema de CORS ou rede, mas a operação pode ter sido bem-sucedida no backend.');
              alert('Grupo atualizado com sucesso (possível problema de conexão, verifique o console).');
              this.carregarGrupos();
              this.carregarGruposComAlunosDetalhes();
              this.carregarTodosAlunos(); // Recarregar alunos para atualizar o status de grupo
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
=======
        if (this.currentGrupo.id) {
            this.grupoService.atualizarGrupo(this.currentGrupo.id, this.currentGrupo).subscribe({
                next: (response: GrupoComNomesAlunosResponse) => {
                    alert('Grupo atualizado com sucesso!');
                    this.carregarGrupos();
                    this.carregarGruposComAlunosDetalhes();
                    this.resetForm();
                },
                error: (err: HttpErrorResponse) => {
                    if (err.error && typeof err.error === 'string') {
                        this.errorMessage = err.error;
                    } else {
                        this.errorMessage = 'Não foi possível atualizar o grupo.';
                    }
                }
            });
>>>>>>> f8f3bbf1a1f654567dcec7ce724bc0d4a51a2647
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
<<<<<<< HEAD
    if (confirm('Tem certeza que deseja excluir este grupo? Isso também desassociará os alunos!')) {
      this.grupoService.deletarGrupo(id).subscribe({
        next: () => {
          alert('Grupo excluído com sucesso!');
          this.carregarGrupos();
          this.carregarGruposComAlunosDetalhes();
          this.carregarTodosAlunos(); // Recarregar alunos para atualizar o status de grupo
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
=======
      if (confirm('Tem certeza que deseja excluir este grupo?')) {
          this.grupoService.deletarGrupo(id).subscribe({
              next: () => {
                  alert('Grupo excluído com sucesso!');
                  this.carregarGrupos();
                  this.carregarGruposComAlunosDetalhes();
              },
              error: (err: any) => {
                  this.errorMessage = 'Não foi possível excluir o grupo.';
              }
          });
      }
>>>>>>> f8f3bbf1a1f654567dcec7ce724bc0d4a51a2647
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

  /**
   * Retorna uma lista de alunos que NÃO ESTÃO no grupo atual.
   * Isso inclui alunos sem grupo e alunos que pertencem a OUTROS grupos.
   */
  get availableStudentsForAddition(): StudentResponse[] {
    if (!this.currentGrupo.id || !this.allStudents) {
      return [];
    }
    // Filtra para incluir apenas alunos cujo grupoId é diferente do grupo atual
    // ou que não possuem grupoId (são null/undefined)
    return this.allStudents.filter(student => student.grupoId !== this.currentGrupo.id);
  }

  addStudentToCurrentGroup(student: StudentResponse): void {
    if (!this.currentGrupo.id) {
        alert('Selecione ou crie um grupo primeiro.');
        return;
    }

    const studentToUpdate: StudentRequest = {
<<<<<<< HEAD
      name: student.name,
      idTcs: student.idTcs,
      grupoId: this.currentGrupo.id,
      description: student.description // Certifique-se que 'description' está na sua interface StudentRequest/Response
    };

    this.studentService.updateStudent(student.id!, studentToUpdate).subscribe({
      next: (updatedStudent: StudentResponse) => {
        alert(`${updatedStudent.name} associado ao grupo ${this.currentGrupo.nome}.`);
        this.carregarGrupos();
        this.carregarGruposComAlunosDetalhes();
        this.carregarTodosAlunos(); // Essencial para atualizar a lista de alunos disponíveis
      },
      error: (err: any) => {
        console.error('Erro ao adicionar aluno ao grupo:', err);
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = `Não foi possível adicionar ${student.name} ao grupo.`;
=======
        name: student.name,
        idTcs: student.idTcs,
        grupoId: this.currentGrupo.id,
        description: student.description
    };

    this.studentService.updateStudent(student.id!, studentToUpdate).subscribe({
        next: () => {
            alert(`${student.name} adicionado ao grupo.`);
            this.carregarGrupos();
            this.carregarGruposComAlunosDetalhes();
            this.carregarTodosAlunos();
        },
        error: (err) => {
            this.errorMessage = `Não foi possível adicionar ${student.name}.`;
>>>>>>> f8f3bbf1a1f654567dcec7ce724bc0d4a51a2647
        }
    });
  }

  removeStudentFromGroup(student: StudentResponse): void {
    const studentToUpdate: StudentRequest = {
<<<<<<< HEAD
      name: student.name,
      idTcs: student.idTcs,
      grupoId: null, // Para desassociar
      description: student.description // Certifique-se que 'description' está na sua interface StudentRequest/Response
    };

    this.studentService.updateStudent(student.id, studentToUpdate).subscribe({
      next: (updatedStudent: StudentResponse) => {
        alert(`${updatedStudent.name} removido do grupo.`);
        this.carregarGrupos();
        this.carregarGruposComAlunosDetalhes();
        this.carregarTodosAlunos(); // Essencial para atualizar a lista de alunos disponíveis
      },
      error: (err: any) => {
        console.error('Erro ao remover aluno do grupo:', err);
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = `Não foi possível remover ${student.name} do grupo.`;
=======
        name: student.name,
        idTcs: student.idTcs,
        grupoId: null, // Desvincula o grupo
        description: student.description
    };

    this.studentService.updateStudent(student.id!, studentToUpdate).subscribe({
        next: () => {
            alert(`${student.name} removido do grupo.`);
            this.carregarGrupos();
            this.carregarGruposComAlunosDetalhes();
            this.carregarTodosAlunos();
        },
        error: (err) => {
            this.errorMessage = `Não foi possível remover ${student.name}.`;
>>>>>>> f8f3bbf1a1f654567dcec7ce724bc0d4a51a2647
        }
    });
  }

  private resetForm(): void {
      this.editMode = false;
      this.currentGrupo = { nome: '', descricao: '' };
      this.errorMessage = null;
  }
}