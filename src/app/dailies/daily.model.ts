// app/dailies/daily.model.ts

// Esta interface deve corresponder à RESPOSTA do backend (GET)
export interface DailyAnnotation {
  id: number;
  annotationDate: Date; // Nome correto
  annotationText: string; // Nome correto
  studentId: number;      // Nome correto
  alunoNome?: string;
  professorId: number;
}

// Esta interface corresponde à REQUISIÇÃO para o backend (POST/PUT)
export interface DailyAnnotationRequest {
  studentId: number;
  annotationText: string;
  annotationDate: string;
}