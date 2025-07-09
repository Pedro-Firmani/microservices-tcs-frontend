// src/app/auth/auth.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest } from './dto/login-request'; // Importe este
import { RegisterRequest } from './dto/register-request'; // Importe este

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth';
  private authTokenKey = 'jwt_token';
  private _isAuthenticated = new BehaviorSubject<boolean>(this.hasToken());

  isAuthenticated$ = this._isAuthenticated.asObservable();

  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<string> { // Altere o tipo do argumento para LoginRequest
    return this.http.post(
      `${this.apiUrl}/login`,
      request, // Passe o objeto request diretamente
      { responseType: 'text' }
    ).pipe(
      tap(token => {
        this.setToken(token);
        this._isAuthenticated.next(true);
      })
    );
  }

  // NOVO MÉTODO PARA REGISTRO
  register(request: RegisterRequest): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/register`,
      request,
      { responseType: 'text' } // O backend retorna uma String de sucesso
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.authTokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.authTokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.authTokenKey);
    this._isAuthenticated.next(false);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}