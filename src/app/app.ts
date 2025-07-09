// src/app/app.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // Este import é necessário para <router-outlet>

@Component({
  selector: 'app-root', // Este seletor deve corresponder ao do index.html
  standalone: true,
  imports: [CommonModule, RouterOutlet], // RouterOutlet deve estar aqui
  templateUrl: './app.html', // Seu app.html
  styleUrls: ['./app.scss'] // Seu app.scss
})
export class AppComponent {
  title = 'chamada-frontend'; // Ou qualquer título que você tenha
}