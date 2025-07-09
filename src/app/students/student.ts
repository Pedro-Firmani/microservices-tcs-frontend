// src/app/students/student.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface para o DTO de Resposta do Aluno (ajuste conforme seu backend)
interface StudentResponse {
  id: number;
  name: string;
  idTcs: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:8080/students'; // URL base da sua API de alunos

  constructor(private http: HttpClient) { }

  getAllStudents(): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(this.apiUrl);
  }

  // Você pode adicionar outros métodos como getStudentById, createStudent, etc., aqui depois
}