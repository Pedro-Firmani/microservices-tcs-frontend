// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router'; // Importe o Router
import { AuthService } from './auth/auth'; // Verifique se o caminho está correto

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  title = 'chamada-frontend';

  // O construtor injeta os serviços que vamos usar.
  // Deixar o authService como 'public' permite que o template app.html o acesse.
  constructor(public authService: AuthService, private router: Router) {}

  // Este método será chamado pelo botão "Sair" no app.html
  logout(): void {
    this.authService.logout();
    // Após o logout, redireciona o usuário para a página de login
    this.router.navigate(['/login']);
  }
}