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
import { TagListComponent } from './tags/tag-list/tag-list.component';
import { TagFormComponent } from './tags/tag-form/tag-form.component';
import { HomeComponent } from './home/home';
import { Error403Component } from './error403/error403'; 

export const routes: Routes = [
  // Rotas públicas (não precisam de autenticação)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: HomeComponent }, 

  // Rota para a página de acesso negado (403)
  { path: '403', component: Error403Component },

  // --- ROTAS PARA ESTUDANTES ---
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [loginGuard] // Exige apenas login
  },
  {
    path: 'students/create',
    component: StudentCreateComponent,
    canActivate: [authGuard], // Exige login E role específica
    data: { expectedRole: 'PROFESSOR' } // Apenas PROFESSOR pode criar alunos
  },

  // --- ROTAS PARA GRUPOS ---
  {
    path: 'grupos',
    component: GrupoListComponent,
    canActivate: [loginGuard] // Exige apenas login
  },

  // --- ROTAS PARA DAILIES ---
  {
    path: 'dailies',
    component: DailyListComponent,
    canActivate: [authGuard], // Exige login E role específica
    data: { expectedRole: 'PROFESSOR' } // Apenas PROFESSOR pode ver dailies
  },
  {
    path: 'dailies/new',
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
    path: 'atividades/:id', // Esta rota parece ser para detalhes ou visualização de uma atividade específica
    component: AtividadeFormComponent, // Verifique se este é o componente correto para visualização
    canActivate: [loginGuard]
  },

  // --- ROTAS PARA TAGS ---
  {
    path: 'tags',
    component: TagListComponent,
    canActivate: [loginGuard] // Exige apenas login para ver a lista de tags
  },
  {
    path: 'tags/new',
    component: TagFormComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'PROFESSOR' } // Apenas PROFESSOR pode criar tags
  },
  {
    path: 'tags/edit/:id',
    component: TagFormComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'PROFESSOR' } // Apenas PROFESSOR pode editar tags
  },

  // Rota Wildcard (sempre a última!) - Redireciona para home ou 404
  { path: '**', redirectTo: '/403' } // Redireciona qualquer rota não encontrada para 403
];