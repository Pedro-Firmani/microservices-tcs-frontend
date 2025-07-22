// src/app/auth/register/register.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../dto/register-request';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  username = '';
  password = '';
  selectedRole = 'ALUNO';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.errorMessage = null;
    this.successMessage = null;

    // Add this check for username
    if (!this.username) {
      this.errorMessage = 'O nome de usuário é obrigatório.';
      return;
    }

    const request: RegisterRequest = {
      username: this.username,
      password: this.password,
      role: this.selectedRole
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido:', response);
        this.successMessage = 'Registro realizado com sucesso! Você pode fazer login agora.';

        this.username = '';
        this.password = '';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (err) => {
        console.error('Erro no registro:', err);
        this.errorMessage = err.error || 'Ocorreu um erro no registro. Tente novamente.';
        if (err.status === 400) {
            this.errorMessage = err.error || 'Nome de usuário já existe ou role inválida.';
        }
      }
    });
  }
}