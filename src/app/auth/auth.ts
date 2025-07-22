// src/app/auth/auth.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest } from './dto/login-request';
import { RegisterRequest } from './dto/register-request';

interface JwtPayload {
  sub: string;
  roles: string[];
  userId: number;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private authTokenKey = 'jwt_token';

  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  private _userRoles = new BehaviorSubject<string[]>([]);

  public isAuthenticated$ = this._isAuthenticated.asObservable();
  public userRoles$ = this._userRoles.asObservable();

  constructor(private http: HttpClient) {
    this.checkTokenOnLoad();
  }

  private checkTokenOnLoad(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          this.updateAuthState(token);
        } else {
          this.logout();
        }
      } catch (error) {
        console.error('Erro ao decodificar token ou token inválido na carga inicial:', error);
        this.logout();
      }
    }
  }

  login(request: LoginRequest): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/login`,
      request,
      { responseType: 'text' }
    ).pipe(
      tap(token => {
        this.updateAuthState(token);
      }),
      catchError(err => {
        this.logout();
        throw err;
      })
    );
  }

  register(request: RegisterRequest): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/register`,
      request,
      { responseType: 'text' }
    );
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    this._isAuthenticated.next(false);
    this._userRoles.next([]);
  }

  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  public hasRole(role: string): boolean {
    // Este método já lida com a remoção de 'ROLE_' se necessário, mas para o template
    // é mais direto usar o array userRoles$ que já estará processado.
    const currentRoles = this._userRoles.getValue(); // Já processado por updateAuthState
    return currentRoles.includes(role);
  }

  private updateAuthState(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
    try {
        const decodedToken: JwtPayload = jwtDecode(token);
        this._isAuthenticated.next(true);
        // Processa os roles aqui para remover "ROLE_" antes de armazenar no BehaviorSubject
        const processedRoles = (decodedToken.roles || []).map(r => r.replace('ROLE_', ''));
        this._userRoles.next(processedRoles); // Atualiza os perfis já processados
    } catch(error) {
        console.error('Erro ao decodificar token no updateAuthState:', error);
        this.logout();
    }
  }
}