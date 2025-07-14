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

// --- NOVOS IMPORTS PARA ATIVIDADES ---
import { AtividadeListComponent } from './atividades/atividade-list/atividade-list.component';
import { AtividadeFormComponent } from './atividades/atividade-form/atividade-form.component';

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
    canActivate: [loginGuard] // Acesso para ALUNO e PROFESSOR
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
    canActivate: [loginGuard] // Acesso para ALUNO e PROFESSOR, conforme SecurityConfig.java
  },
  {
    path: 'atividades/nova',
    component: AtividadeFormComponent,
    canActivate: [authGuard], // Apenas PROFESSOR pode criar
    data: { expectedRole: 'PROFESSOR' }
  },
  {
    path: 'atividades/editar/:id',
    component: AtividadeFormComponent,
    canActivate: [authGuard], // Apenas PROFESSOR pode editar
    data: { expectedRole: 'PROFESSOR' }
  },
  // Opcional: Rota para visualizar detalhes. Pode usar o mesmo form ou um componente dedicado.
  {
    path: 'atividades/:id',
    component: AtividadeFormComponent, // Reutilizando o form para visualização/edição
    canActivate: [loginGuard]
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