// src/app/grupos/grupo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GrupoComNomesAlunosResponse {
  id: number;
  nome: string;
  descricao: string;
  nomesDosAlunos: string[];
}

export interface StudentResponse {
  id: number;
  name: string;
  idTcs: string;
  grupoId?: number;
  grupoNome?: string;
}

export interface GrupoComAlunosResponse {
  id: number;
  nome: string;
  descricao: string;
  alunos: StudentResponse[];
}

// Interface para o GrupoModel que será enviado/recebido nas operações de CRUD
// É essencial que ela reflita a estrutura do seu GrupoModel no backend,
// mas para o PUT/POST de grupo, geralmente você não envia a lista de 'alunos' completa.
// Apenas id, nome e descricao.
export interface GrupoModelRequest {
  id?: number; // Opcional para criação, necessário para edição
  nome: string;
  descricao: string;
  // Não inclua 'alunos' aqui para operações de POST/PUT de grupo,
  // a menos que você tenha um endpoint específico para gerenciar alunos dentro do grupo.
}


@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private baseUrl = 'http://localhost:8080/grupos'; // URL do seu backend

  constructor(private http: HttpClient) { }

  getGruposComNomesAlunos(): Observable<GrupoComNomesAlunosResponse[]> {
    return this.http.get<GrupoComNomesAlunosResponse[]>(this.baseUrl);
  }

  getGruposComAlunosDetalhes(): Observable<GrupoComAlunosResponse[]> {
    return this.http.get<GrupoComAlunosResponse[]>(`${this.baseUrl}/com-alunos`);
  }

  // Novo método para criar um grupo
  criarGrupo(grupo: GrupoModelRequest): Observable<GrupoModelRequest> {
    return this.http.post<GrupoModelRequest>(this.baseUrl, grupo);
  }

  // Novo método para buscar um grupo por ID (útil para preencher formulário de edição)
  getGrupoById(id: number): Observable<GrupoModelRequest> {
    return this.http.get<GrupoModelRequest>(`${this.baseUrl}/${id}`);
  }

  // Novo método para atualizar um grupo
  atualizarGrupo(id: number, grupo: GrupoModelRequest): Observable<GrupoModelRequest> {
    return this.http.put<GrupoModelRequest>(`${this.baseUrl}/${id}`, grupo);
  }

  // Novo método para excluir um grupo
  deletarGrupo(id: number): Observable<void> { // Retorna void porque o backend retorna 204 No Content
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}