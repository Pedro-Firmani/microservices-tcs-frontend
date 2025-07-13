import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyService } from './daily.service';
import { DailyAnnotation } from './daily.model';
import { AuthService } from '../auth/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-daily-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './daily-list.component.html',
  styleUrls: ['./daily-list.component.scss']
})
export class DailyListComponent implements OnInit {
  dailies: DailyAnnotation[] = [];
  
  // Adicione a injeção do AuthService
  constructor(private dailyService: DailyService, public authService: AuthService) { }

  ngOnInit(): void {
    // Exemplo: Carregar dailies. Você pode querer uma lógica mais específica,
    // como carregar apenas as do aluno logado, se for o caso.
    this.dailyService.getDailies().subscribe(data => {
      this.dailies = data;
    });
  }

  deleteDaily(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta anotação?')) {
      this.dailyService.deleteDaily(id).subscribe(() => {
        // Remove a daily da lista local
        this.dailies = this.dailies.filter(d => d.id !== id);
      });
    }
  }
}