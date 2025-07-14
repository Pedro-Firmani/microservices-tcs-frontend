import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DailyAnnotation, DailyAnnotationRequest } from './daily.model';

@Injectable({
  providedIn: 'root'
})
export class DailyService {
  private apiUrl = 'http://localhost:8082/api/daily-annotations'; 

  constructor(private http: HttpClient) { }

  getDailies(): Observable<DailyAnnotation[]> {
    return this.http.get<DailyAnnotation[]>(this.apiUrl);
  }
  
  // --- MÉTODO NOVO ADICIONADO AQUI ---
  // Busca uma anotação específica pelo seu ID
  getDailyById(id: number): Observable<DailyAnnotation> {
    return this.http.get<DailyAnnotation>(`${this.apiUrl}/${id}`);
  }
  
  getDailiesByStudent(studentId: number): Observable<DailyAnnotation[]> {
    return this.http.get<DailyAnnotation[]>(`${this.apiUrl}/student/${studentId}`);
  }

  createDaily(daily: DailyAnnotationRequest): Observable<DailyAnnotation> {
    return this.http.post<DailyAnnotation>(this.apiUrl, daily);
  }

  updateDaily(id: number, daily: DailyAnnotationRequest): Observable<DailyAnnotation> {
    return this.http.put<DailyAnnotation>(`${this.apiUrl}/${id}`, daily);
  }

  deleteDaily(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}