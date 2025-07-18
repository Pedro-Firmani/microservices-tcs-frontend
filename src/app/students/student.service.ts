// src/app/students/student.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StudentResponse {
  id: number;
  name: string;
  idTcs: string;
  grupoId?: number | null;
  grupoNome?: string;
  description?: string | null;
  tagId?: number | null;
}

export interface StudentRequest {
  name: string;
  idTcs: string;
  grupoId?: number | null;
  description?: string | null;
  tagId?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:8080/students'; // URL correta

  constructor(private http: HttpClient) { }

  getAllStudents(): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(this.baseUrl);
  }

  getStudentById(id: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.baseUrl}/${id}`);
  }

  updateStudent(id: number, studentData: StudentRequest): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.baseUrl}/${id}`, studentData);
  }

  createStudent(studentData: StudentRequest): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(this.baseUrl, studentData);
  }

  // VVV CORREÇÃO AQUI VVV
  // A função estava usando 'this.apiUrl', que não existe.
  // O correto é usar 'this.baseUrl'.
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}