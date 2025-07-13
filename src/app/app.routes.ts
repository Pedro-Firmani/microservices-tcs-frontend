// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { StudentListComponent } from './students/student-list/student-list';
import { GrupoListComponent } from './grupos/grupo-list';
import { StudentCreateComponent } from './students/student-create/student-create';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';
import { DailyListComponent } from './dailies/daily-list.component'; 
// Importe o novo componente de formulário
import { DailyFormComponent } from './dailies/daily-form/daily-form.component';

export const routes: Routes = [
  // Rotas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rotas que exigem apenas que o usuário esteja logado
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'grupos',
    component: GrupoListComponent,
    canActivate: [loginGuard]
  },
  
  // *** ROTAS PARA DAILIES (AGORA ATIVAS) ***
  {
    path: 'dailies',
    component: DailyListComponent,
    canActivate: [loginGuard] // Acesso para ALUNO e PROFESSOR
  },
  // Rotas para criar e editar, protegidas para PROFESSOR
  {
    path: 'dailies/create',
    component: DailyFormComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'PROFESSOR' }
  },
  {
    path: 'dailies/edit/:id',
    component: DailyFormComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'PROFESSOR' }
  },

  // Rota protegida que exige a role 'PROFESSOR'
  {
    path: 'students/create',
    component: StudentCreateComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'PROFESSOR' }
  },

  // Redirecionamento padrão
  { path: '', redirectTo: '/grupos', pathMatch: 'full' },
  { path: '**', redirectTo: '/grupos' }
];