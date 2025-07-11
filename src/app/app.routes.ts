// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { StudentListComponent } from './students/student-list/student-list';
import { GrupoListComponent } from './grupos/grupo-list';
import { StudentCreateComponent } from './students/student-create/student-create';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard'; // <<< NOVO: Importa o guarda de login

export const routes: Routes = [
  // Rotas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rotas que exigem apenas que o usuário esteja logado
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [loginGuard] // <<< APLICA O NOVO GUARDA
  },
  {
    path: 'grupos',
    component: GrupoListComponent,
    canActivate: [loginGuard] // <<< APLICA O NOVO GUARDA
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