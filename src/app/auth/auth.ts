// src/app/auth/auth.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode'; // <<< NOVO: Importa a biblioteca
import { LoginRequest } from './dto/login-request';
import { RegisterRequest } from './dto/register-request';

// Interface para o conteúdo do nosso token JWT
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

  // BehaviorSubjects para reatividade em tempo real na UI
  private _isAuthenticated = new BehaviorSubject<boolean>(false);
  private _userRoles = new BehaviorSubject<string[]>([]);

  // Observables públicos que os componentes podem "escutar"
  public isAuthenticated$ = this._isAuthenticated.asObservable();
  public userRoles$ = this._userRoles.asObservable();

  constructor(private http: HttpClient) {
    // Ao iniciar o serviço, verifica se já existe um token válido
    this.checkTokenOnLoad();
  }

  private checkTokenOnLoad(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: JwtPayload = jwtDecode(token);
        // Verifica se o token não expirou
        if (decodedToken.exp * 1000 > Date.now()) {
          this.updateAuthState(token);
        } else {
          this.logout(); // Token expirado
        }
      } catch (error) {
        this.logout(); // Token inválido
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
        // Limpa o estado em caso de falha no login
        this.logout();
        throw err; // Repassa o erro para o componente tratar
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

  // <<< NOVO MÉTODO >>>
  // Verifica se o usuário tem uma determinada role
  public hasRole(role: string): boolean {
    // O backend salva como "ROLE_PROFESSOR", então removemos o "ROLE_"
    const currentRoles = this._userRoles.getValue().map(r => r.replace('ROLE_', ''));
    return currentRoles.includes(role);
  }

  // <<< NOVO MÉTODO >>>
  // Atualiza o estado de autenticação e decodifica o token
  private updateAuthState(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
    try {
        const decodedToken: JwtPayload = jwtDecode(token);
        this._isAuthenticated.next(true);
        this._userRoles.next(decodedToken.roles || []);
    } catch(error) {
        this.logout(); // Se o token for inválido, desloga
    }
  }
}