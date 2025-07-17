// src/app/auth/dto/register-request.ts
export interface RegisterRequest {
  username: string;
  password: string;
  role: string; // Corresponde ao campo adicionado no Java RegisterRequest
}