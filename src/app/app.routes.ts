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
import { DailyFormComponent } from './dailies/daily-form/daily-form.component';
import { AtividadeListComponent } from './atividades/atividade-list/atividade-list.component';
import { AtividadeFormComponent } from './atividades/atividade-form/atividade-form.component';
import { HomeComponent } from './home/home';

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

  // *** ROTAS PARA DAILIES ***
  {
    path: 'dailies',
    component: DailyListComponent,
    canActivate: [loginGuard]
  },
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

  // --- ROTAS PARA ATIVIDADES ---
  {
    path: 'atividades',
    component: AtividadeListComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'atividades/nova',
    component: AtividadeFormComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'PROFESSOR' }
  },
  {
    path: 'atividades/editar/:id',
    component: AtividadeFormComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'PROFESSOR' }
  },
  {
    path: 'atividades/:id',
    component: AtividadeFormComponent,
    canActivate: [loginGuard]
  },

  // Rota protegida que exige a role 'PROFESSOR'
  {
    path: 'students/create',
    component: StudentCreateComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'PROFESSOR' }
  },

  // ✅ Página inicial
  { path: '', component: HomeComponent },

  // Rota coringa para qualquer URL inválida
  { path: '**', redirectTo: '/grupos' }
];
