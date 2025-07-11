// src/app/students/student.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Reutilizamos a interface StudentResponse que você já tem no grupo.service.ts
// e a StudentRequest do backend
export interface StudentResponse {
  id: number;
  name: string;
  idTcs: string;
  grupoId?: number | null;
  grupoNome?: string;
  description?: string | null;
}

export interface StudentRequest {
  name: string;
  idTcs: string;
  grupoId?: number | null; 
  description?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:8080/students'; // URL do seu endpoint de alunos

  constructor(private http: HttpClient) { }

  // Método para buscar todos os alunos
  getAllStudents(): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(this.baseUrl);
  }

  // Método para buscar um aluno por ID
  getStudentById(id: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.baseUrl}/${id}`);
  }

  // Método para atualizar um aluno (incluindo sua associação de grupo)
  updateStudent(id: number, studentData: StudentRequest): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.baseUrl}/${id}`, studentData);
  }

  // Método para criar um aluno (se precisar, embora o foco seja associação a grupo)
  createStudent(studentData: StudentRequest): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(this.baseUrl, studentData);
  }
}