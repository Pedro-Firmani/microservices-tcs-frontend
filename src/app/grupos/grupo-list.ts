// src/app/grupos/grupo-list/grupo-list.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessário para *ngFor, *ngIf
import { GrupoService, GrupoComNomesAlunosResponse } from './grupo.service'; // Importe o serviço de grupo e a interface

@Component({
  selector: 'app-grupo-list',
  standalone: true,
  imports: [CommonModule], // Adicione CommonModule
  templateUrl: './grupo-list.html',
  styleUrls: ['./grupo-list.scss'] // Assumindo que você usa SCSS, ajuste para .css se for o caso
})
export class GrupoListComponent implements OnInit {
  grupos: GrupoComNomesAlunosResponse[] = []; // Array para armazenar os grupos
  errorMessage: string | null = null; // Para mensagens de erro

  constructor(private grupoService: GrupoService) { }

  ngOnInit(): void {
    this.carregarGrupos();
  }

  carregarGrupos(): void {
    this.grupoService.getGruposComNomesAlunos().subscribe({
      next: (data) => {
        this.grupos = data;
        console.log('Grupos carregados:', this.grupos); // Para depuração no console
      },
      error: (err) => {
        console.error('Erro ao carregar grupos:', err);
        this.errorMessage = 'Não foi possível carregar a lista de grupos.';
        // Você pode adicionar mais lógica para tratar diferentes erros aqui
        // Ex: if (err.status === 401) { this.errorMessage = 'Sessão expirada.'; }
      }
    });
  }
}