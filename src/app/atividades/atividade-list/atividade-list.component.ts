import { Component, OnInit } from '@angular/core';
import { AtividadeService } from '../atividade.service';
import { Atividade } from '../atividade.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Imports do Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-atividade-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // Adicione os módulos do Material aqui
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './atividade-list.component.html',
  styleUrls: ['./atividade-list.component.scss'] // Usaremos o novo SCSS
})
export class AtividadeListComponent implements OnInit {
  atividades: Atividade[] = [];
  // Você precisará da sua lógica real para verificar o papel do usuário
  isProfessor = true; // Exemplo: Obtenha do seu AuthService

  constructor(private atividadeService: AtividadeService) { }

  ngOnInit(): void {
    this.loadAtividades();
  }

  loadAtividades(): void {
    this.atividadeService.getAtividades().subscribe(data => {
      this.atividades = data;
    });
  }

  deleteAtividade(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
      this.atividadeService.deleteAtividade(id).subscribe(() => {
        this.loadAtividades();
      });
    }
  }
}