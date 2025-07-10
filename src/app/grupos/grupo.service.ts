// src/app/grupos/grupo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces para os DTOs do backend (como definimos anteriormente)

// Para o endpoint /grupos (apenas nomes de alunos)
export interface GrupoComNomesAlunosResponse {
  id: number;
  nome: string;
  descricao: string;
  nomesDosAlunos: string[]; // Lista de nomes de alunos
}

// Para o endpoint /grupos/com-alunos (detalhes completos de alunos)
export interface StudentResponse {
  id: number;
  name: string;
  idTcs: string;
  grupoId?: number;   // Opcional, como no seu backend
  grupoNome?: string; // Opcional
}

export interface GrupoComAlunosResponse {
  id: number;
  nome: string;
  descricao: string;
  alunos: StudentResponse[]; // Lista de objetos StudentResponse
}

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private baseUrl = 'http://localhost:8080/grupos'; // URL do seu backend

  constructor(private http: HttpClient) { }

  // Método para buscar grupos com apenas os nomes dos alunos (/grupos)
  getGruposComNomesAlunos(): Observable<GrupoComNomesAlunosResponse[]> {
    return this.http.get<GrupoComNomesAlunosResponse[]>(this.baseUrl);
  }

  // Método para buscar grupos com detalhes completos dos alunos (/grupos/com-alunos)
  getGruposComAlunosDetalhes(): Observable<GrupoComAlunosResponse[]> {
    return this.http.get<GrupoComAlunosResponse[]>(`${this.baseUrl}/com-alunos`);
  }
}