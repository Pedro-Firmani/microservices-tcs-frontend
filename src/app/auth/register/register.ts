// src/app/auth/register/register.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importe este
import { AuthService } from '../auth'; // Importe o AuthService
import { Router, RouterLink } from '@angular/router'; // Importe o Router
import { RegisterRequest } from '../dto/register-request'; // Importe o DTO de registro

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Adicione FormsModule aqui
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
      role: this.selectedRole // Pega a role selecionada
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido:', response);
        this.successMessage = 'Registro realizado com sucesso! Você pode fazer login agora.';
        // Opcional: Limpar campos ou redirecionar para a tela de login
        this.username = '';
        this.password = '';
        // this.router.navigate(['/login']);
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