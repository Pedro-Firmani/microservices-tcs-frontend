export interface DailyAnnotation {
  id: number;
  professorId: number;
  professorUsername: string;
  studentId: number;
  studentName: string;
  studentIdTcs: string;
  annotationDate: Date; 
  annotationText: string;
}

export interface DailyAnnotationRequest {
  studentId: number;
  annotationDate: Date; 
  annotationText: string;
}