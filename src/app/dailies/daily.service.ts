import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyAnnotation, DailyAnnotationRequest } from './daily.model';

@Injectable({
  providedIn: 'root'
})
export class DailyService {
  private apiUrl = 'http://localhost:8082/api/daily-annotations'; 

  constructor(private http: HttpClient) { }

  // Busca todas as anotações diárias
  getDailies(): Observable<DailyAnnotation[]> {
    return this.http.get<DailyAnnotation[]>(this.apiUrl);
  }

  // Busca anotações por ID do aluno
  getDailiesByStudent(studentId: number): Observable<DailyAnnotation[]> {
    return this.http.get<DailyAnnotation[]>(`${this.apiUrl}/student/${studentId}`);
  }

  // Cria uma nova anotação
  createDaily(daily: DailyAnnotationRequest): Observable<DailyAnnotation> {
    return this.http.post<DailyAnnotation>(this.apiUrl, daily);
  }

  // Atualiza uma anotação
  updateDaily(id: number, daily: DailyAnnotationRequest): Observable<DailyAnnotation> {
    return this.http.put<DailyAnnotation>(`${this.apiUrl}/${id}`, daily);
  }

  // Deleta uma anotação
  deleteDaily(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}