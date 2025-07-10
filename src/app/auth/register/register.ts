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
  selectedRole = 'ALUNO'; // Valor padrão para a role
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.errorMessage = null;
    this.successMessage = null;

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
        // this.router.navigate(['/login']); // Opcional: redirecionar após sucesso
      },
      error: (err) => {
        console.error('Erro no registro:', err);
        // Traduz a mensagem de erro recebida do backend
        this.errorMessage = this.translateErrorMessage(err.error);
      }
    });
  }

  private translateErrorMessage(backendMessage: string): string {
    switch (backendMessage) {
      case 'Username is already taken':
        return 'Nome de usuário já está em uso. Por favor, escolha outro.';
      case 'Username cannot contain spaces':
        return 'Nome de usuário não pode conter espaços.';
      case 'Username cannot contain accents or special characters':
        return 'Nome de usuário não pode conter acentos ou caracteres especiais. Use apenas letras e números.';
      case 'Password must be at least 8 characters long':
        return 'Senha deve ter no mínimo 8 caracteres.';
      case 'Password must contain at least one uppercase letter':
        return 'Senha deve conter pelo menos uma letra maiúscula.';
      case 'Password must contain at least one number':
        return 'Senha deve conter pelo menos um número.';
      case "Role must be 'PROFESSOR' or 'ALUNO'":
        return 'Tipo de usuário deve ser "Professor" ou "Aluno".';
      default:
        if (backendMessage.startsWith("User registered, but student creation failed:")) {
          return "O registro do usuário foi concluído, mas houve um erro ao criar o perfil de aluno. Por favor, contate o suporte.";
        }
        return 'Ocorreu um erro inesperado no registro. Tente novamente mais tarde.';
    }
  }
}