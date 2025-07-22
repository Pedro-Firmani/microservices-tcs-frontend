// src/app/error403/error403.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // Para o link de retorno

@Component({
  selector: 'app-error403',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="error-container">
      <h2>Acesso Negado</h2>
      <p>Você não tem permissão para acessar esta página.</p>
      <button routerLink="/grupos" class="back-button">Voltar para Grupos</button>
      <button routerLink="/login" class="login-button">Fazer Login</button>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #F4F2FA; /* Cor de fundo do seu site */
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-align: center;
    }

    .error-container {
      background-color: #FFFFFF;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 450px;
      text-align: center;
      color: #0F0A0A; /* Cor de texto principal do seu site */
    }

    h2 {
      color: #D32F2F; /* Vermelho para erro */
      margin-bottom: 20px;
      font-size: 2.2em;
    }

    p {
      margin-bottom: 30px;
      font-size: 1.1em;
      line-height: 1.6;
    }

    .back-button, .login-button {
      background-color: #6A0DAD; /* Cor roxa do seu site */
      color: #FFFFFF;
      padding: 12px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1.1em;
      font-weight: bold;
      transition: background-color 0.3s ease, transform 0.2s ease;
      text-decoration: none; /* Para remover sublinhado do routerLink */
      display: inline-block; /* Para botões ficarem lado a lado */
      margin: 0 10px;
    }

    .back-button:hover, .login-button:hover {
      background-color: #5A0CA0; /* Tom mais escuro do roxo no hover */
      transform: translateY(-2px);
    }
  `]
})
export class Error403Component { }