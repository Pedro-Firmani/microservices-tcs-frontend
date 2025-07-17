export interface Atividade {
  id: number;
  titulo: string;
  descricao: string;
  dataCriacao: Date;
  dataEntrega?: Date;
  professorId: number;
}