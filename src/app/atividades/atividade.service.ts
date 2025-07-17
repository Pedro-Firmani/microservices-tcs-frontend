import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Atividade } from './atividade.model';

@Injectable({
  providedIn: 'root'
})
export class AtividadeService {
  private apiUrl = 'http://localhost:8081/atividades'; // URL do seu microsserviço de atividades

  constructor(private http: HttpClient) { }

  getAtividades(): Observable<Atividade[]> {
    return this.http.get<Atividade[]>(this.apiUrl);
  }

  getAtividade(id: number): Observable<Atividade> {
    return this.http.get<Atividade>(`${this.apiUrl}/${id}`);
  }

  createAtividade(atividade: Omit<Atividade, 'id' | 'dataCriacao' | 'professorId'>): Observable<Atividade> {
    return this.http.post<Atividade>(this.apiUrl, atividade);
  }

  updateAtividade(id: number, atividade: Partial<Omit<Atividade, 'id' | 'dataCriacao' | 'professorId'>>): Observable<Atividade> {
    return this.http.put<Atividade>(`${this.apiUrl}/${id}`, atividade);
  }

  deleteAtividade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}