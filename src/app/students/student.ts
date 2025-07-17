// src/app/students/student.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface para o DTO de Resposta do Aluno (ajuste conforme seu backend)
export interface StudentResponse {
  id: number;
  name: string;
  idTcs: string;
  grupoId?: number | null;
  grupoNome?: string | null;
}

export interface StudentRequest {
  name: string;
  idTcs: string;
  grupoId?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8080/students';

  constructor(private http: HttpClient) {}

  getAllStudents(): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(this.apiUrl);
  }

  createStudent(student: StudentRequest): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(this.apiUrl, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getStudentById(id: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.apiUrl}/${id}`);
  }

  updateStudent(id: number, student: StudentRequest): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.apiUrl}/${id}`, student);
  }
}
