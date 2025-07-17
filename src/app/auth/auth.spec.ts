// src/app/auth/auth.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth'; // Corrigido de 'Auth' para 'AuthService'

describe('AuthService', () => { // Corrigido de 'Auth' para 'AuthService'
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule] // Adiciona o módulo para testes de HTTP
    });
    service = TestBed.inject(AuthService); // Corrigido de 'Auth' para 'AuthService'
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});