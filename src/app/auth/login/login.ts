// src/app/auth/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';
import { LoginRequest } from '../dto/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.errorMessage = null;

    // <<< CRIE O OBJETO LoginRequest AQUI
    const request: LoginRequest = {
      username: this.username,
      password: this.password
    };

    this.authService.login(request).subscribe({ // <<< PASSE O OBJETO 'request'
      next: (token) => {
        console.log('Login bem-sucedido. Token:', token);
        this.router.navigate(['/students']);
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
        if (err.status === 401) {
          this.errorMessage = 'Usuário ou senha incorretos.';
        } else {
          this.errorMessage = 'Ocorreu um erro. Tente novamente mais tarde.';
        }
      }
    });
  }
}