// src/app/grupos/grupo-list.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrupoService, GrupoComNomesAlunosResponse, GrupoModelRequest, GrupoComAlunosResponse } from '../grupos/grupo.service';
import { StudentService, StudentResponse, StudentRequest } from '../students/student.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth';

// Importações dos módulos do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';

// Importações dos módulos do Snackbar
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmSnackbarComponent } from '../shared/components/snackBar/confirm-snackbar.component';

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatTableModule,
    MatSnackBarModule// Adicione o componente de confirmação aqui
  ],
  templateUrl: './grupo-list.html',
  styleUrls: ['./grupo-list.scss']
})
export class GrupoListComponent implements OnInit {
  grupos: GrupoComNomesAlunosResponse[] = [];
  gruposComAlunosDetalhes: GrupoComAlunosResponse[] = [];
  todosAlunos: StudentResponse[] = []; // Lista de todos os alunos
  // alunosNoGrupo: StudentResponse[] = []; // Removido, substituído por getStudentsInCurrentGroup()
  // alunosDisponiveis: StudentResponse[] = []; // Removido, substituído por availableStudentsForAddition

  currentGrupo: GrupoModelRequest = {
    nome: '',
    descricao: ''
  };
  editMode: boolean = false;
  errorMessage: string | null = null; // Mantido conforme pedido
  isProfessor: boolean = false;

  constructor(
    private grupoService: GrupoService,
    private studentService: StudentService,
    private authService: AuthService,
    private snackBar: MatSnackBar // Injete MatSnackBar
  ) { }

  ngOnInit(): void {
    this.isProfessor = this.authService.hasRole('PROFESSOR');
    this.carregarGrupos();
    this.carregarGruposComAlunosDetalhes();
    this.carregarTodosAlunos();
  }

  carregarGrupos(): void {
    this.grupoService.getGruposComNomesAlunos().subscribe({
      next: (data) => {
        this.grupos = data;
        this.errorMessage = null; // Limpa a mensagem de erro da tela
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Erro ao carregar grupos. Tente novamente mais tarde.';
        this.openSnackBar('Não foi possível carregar os grupos. ❌', 'error'); // Exibe também no snackbar
        console.error('Erro ao carregar grupos:', err);
      }
    });
  }

  carregarGruposComAlunosDetalhes(): void {
    this.grupoService.getGruposComAlunosDetalhes().subscribe({
      next: (data) => {
        this.gruposComAlunosDetalhes = data;
        // Não chame filtrarAlunosParaGerenciamento aqui diretamente,
        // pois getStudentsInCurrentGroup e availableStudentsForAddition
        // já farão o trabalho quando acessados pelo HTML.
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar grupos com detalhes dos alunos:', err);
        this.openSnackBar('Não foi possível carregar detalhes dos grupos e alunos. ❌', 'error');
      }
    });
  }

  carregarTodosAlunos(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.todosAlunos = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar todos os alunos:', err);
        this.openSnackBar('Não foi possível carregar a lista de todos os alunos. ❌', 'error');
      }
    });
  }

  // MÉTODO: Retorna os alunos que estão no grupo atualmente em edição
  getStudentsInCurrentGroup(): StudentResponse[] {
    if (!this.editMode || !this.currentGrupo.id || !this.gruposComAlunosDetalhes) {
      return [];
    }
    const grupoDetalhes = this.gruposComAlunosDetalhes.find(g => g.id === this.currentGrupo.id);
    return grupoDetalhes ? grupoDetalhes.alunos : [];
  }

  // GETTER: Retorna os alunos disponíveis para adicionar ao grupo em edição
  get availableStudentsForAddition(): StudentResponse[] {
    if (!this.editMode || !this.currentGrupo.id || !this.todosAlunos) {
      return [];
    }
    const alunosNoGrupoAtual = this.getStudentsInCurrentGroup();
    // Filtra todos os alunos para encontrar aqueles que não estão no grupo atual
    return this.todosAlunos.filter(aluno =>
      !alunosNoGrupoAtual.some(a => a.id === aluno.id)
    );
  }

  saveGrupo(): void {
    // Validação para impedir criação/atualização de grupos vazios
    if (!this.currentGrupo.nome) {
      this.openSnackBar('Nome do grupo é obrigatório. ⚠️', 'error'); // Adicionado emoji
      return;
    }
    this.errorMessage = null; // Limpa qualquer erro anterior de validação do formulário

    if (this.editMode && this.currentGrupo.id) {
      this.grupoService.atualizarGrupo(this.currentGrupo.id, this.currentGrupo).subscribe({
        next: () => {
          this.openSnackBar('Grupo atualizado com sucesso! ✅', 'success');
          this.resetForm();
          this.carregarGrupos();
          this.carregarGruposComAlunosDetalhes();
          this.carregarTodosAlunos(); // Recarrega alunos para atualizar disponibilidade
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = 'Não foi possível atualizar o grupo.';
          this.openSnackBar('Não foi possível atualizar o grupo. ❌', 'error');
          console.error('Erro ao atualizar grupo:', err);
        }
      });
    } else {
      this.grupoService.criarGrupo(this.currentGrupo).subscribe({
        next: () => {
          this.openSnackBar('Grupo criado com sucesso! ✅', 'success');
          this.resetForm();
          this.carregarGrupos();
          this.carregarGruposComAlunosDetalhes();
          this.carregarTodosAlunos(); // Recarrega alunos para atualizar disponibilidade
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = 'Não foi possível criar o grupo. Verifique os dados.';
          this.openSnackBar('Não foi possível criar o grupo. ❌', 'error');
          console.error('Erro ao criar grupo:', err);
        }
      });
    }
  }

  editGrupo(grupo: GrupoComNomesAlunosResponse): void {
    this.editMode = true;
    this.currentGrupo = { id: grupo.id, nome: grupo.nome, descricao: grupo.descricao }; // Copia os dados para edição
    // Não precisa chamar filtrarAlunosParaGerenciamento aqui, os getters farão o trabalho
  }

  cancelEdit(): void {
    this.resetForm();
  }

  // Método para exibir o snackbar de confirmação para exclusão de grupo
  confirmDeleteGrupo(id: number): void {
    const snackBarRef = this.snackBar.openFromComponent(ConfirmSnackbarComponent, {
      data: {
        message: 'Tem certeza que deseja excluir este grupo? Esta ação é irreversível.',
        confirmText: 'Sim', // Revertido para 'Sim'
        cancelText: 'Não' // Revertido para 'Não'
      },
      duration: 5000,
      horizontalPosition: 'center', // Este continua centralizado
      verticalPosition: 'bottom',
      panelClass: ['confirm-snackbar']
    });

    snackBarRef.onAction().subscribe(() => {
      this._performDeleteGrupo(id); // Chama o método real de exclusão após confirmação
    });
  }

  // Método privado que executa a exclusão real
  private _performDeleteGrupo(id: number): void {
    this.grupoService.deletarGrupo(id).subscribe({
      next: () => {
        this.openSnackBar('Grupo excluído com sucesso! ✅', 'success');
        this.carregarGrupos();
        this.carregarGruposComAlunosDetalhes();
        this.carregarTodosAlunos(); // Recarrega alunos para desvincular do grupo
      },
      error: (err: HttpErrorResponse) => {
        this.openSnackBar('Não foi possível excluir o grupo. ❌', 'error');
        console.error('Erro ao excluir grupo:', err);
      }
    });
  }

  // CORRIGIDO: Renomeado para addStudentToCurrentGroup para corresponder ao HTML
  addStudentToCurrentGroup(student: StudentResponse): void {
    if (!this.currentGrupo.id) {
        this.openSnackBar('Selecione um grupo para adicionar o aluno. ❌', 'error');
        return;
    }

    const studentToUpdate: StudentRequest = {
        name: student.name,
        idTcs: student.idTcs,
        grupoId: this.currentGrupo.id,
        description: student.description
    };

    this.studentService.updateStudent(student.id!, studentToUpdate).subscribe({
        next: () => {
            this.openSnackBar(`${student.name} adicionado ao grupo. ✅`, 'success');
            this.carregarGrupos();
            this.carregarGruposComAlunosDetalhes();
            this.carregarTodosAlunos();
        },
        error: (err) => {
            this.openSnackBar(`Não foi possível adicionar ${student.name}. ❌`, 'error');
        }
    });
  }

  removeStudentFromGroup(student: StudentResponse): void {
    const studentToUpdate: StudentRequest = {
        name: student.name,
        idTcs: student.idTcs,
        grupoId: null, // Desvincula o grupo
        description: student.description
    };

    this.studentService.updateStudent(student.id!, studentToUpdate).subscribe({
        next: () => {
            this.openSnackBar(`${student.name} removido do grupo. ✅`, 'success');
            this.carregarGrupos();
            this.carregarGruposComAlunosDetalhes();
            this.carregarTodosAlunos();
        },
        error: (err) => {
            this.openSnackBar(`Não foi possível remover ${student.name}. ❌`, 'error');
        }
    });
  }

  private resetForm(): void {
      this.editMode = false;
      this.currentGrupo = { nome: '', descricao: '' };
      this.errorMessage = null; // Limpa a mensagem de erro na tela ao resetar
  }

  // Método auxiliar para abrir snackbars de sucesso/erro
  private openSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      panelClass: [type === 'success' ? 'success-snackbar' : 'error-snackbar'],
      horizontalPosition: 'right', // Definido para a direita
      verticalPosition: 'bottom'
    });
  }
}
