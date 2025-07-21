// src/app/students/student.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Adicione HttpParams
import { Observable } from 'rxjs';

export interface StudentResponse {
  id: number;
  name: string;
  idTcs: string;
  grupoId?: number | null;
  grupoNome?: string;
  description?: string | null;
  tagId?: number | null;
  color?: string | null;
}

export interface StudentRequest {
  name: string;
  idTcs: string;
  grupoId?: number | null;
  description?: string | null;
  tagId?: number | null;
  color?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:8080/students';

  constructor(private http: HttpClient) { }

  // Modifique getAllStudents para aceitar um tagId opcional
  getAllStudents(tagId?: number | null): Observable<StudentResponse[]> { // Modificado
    let params = new HttpParams(); // Novo
    if (tagId) { // Novo
      params = params.set('tagId', tagId.toString()); // Novo
    } // Novo
    return this.http.get<StudentResponse[]>(this.baseUrl, { params: params }); // Modificado
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

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}