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

// Importar os novos componentes de Tag
import { TagListComponent } from './tags/tag-list/tag-list.component';
import { TagFormComponent } from './tags/tag-form/tag-form.component';

export const routes: Routes = [
  // Rotas públicas
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] }, // Adicionado loginGuard para login/register
  { path: 'register', component: RegisterComponent, canActivate: [loginGuard] },

  // Rotas que exigem apenas que o usuário esteja logado (qualquer role)
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
  // --- ROTAS PARA ATIVIDADES ---
  {
    path: 'atividades',
    component: AtividadeListComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'atividades/:id', // Rota para visualizar uma atividade específica (se houver, com loginGuard)
    component: AtividadeFormComponent, // Usando o form para visualizar detalhes, se for o caso
    canActivate: [loginGuard]
  },
  // --- NOVAS ROTAS PARA TAGS ---
  {
    path: 'tags',
    component: TagListComponent,
    canActivate: [loginGuard] // Qualquer usuário logado pode ver a lista de tags
  },

  // Rotas protegidas que exigem a role 'PROFESSOR'
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
    path: 'students/create',
    component: StudentCreateComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'PROFESSOR' }
  },
  // --- NOVAS ROTAS PARA TAGS QUE EXIGEM PROFESSOR ---
  {
    path: 'tags/new',
    component: TagFormComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'PROFESSOR' } // Apenas professor pode criar tags
  },
  {
    path: 'tags/edit/:id',
    component: TagFormComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'PROFESSOR' } // Apenas professor pode editar tags
  },

  // ✅ Página inicial (rota padrão após login)
  { path: 'home', component: HomeComponent, canActivate: [loginGuard] }, // Proteger home com loginGuard
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redireciona a rota base para home

  // Rota curinga para qualquer URL inválida (após login, redireciona para home)
  { path: '**', redirectTo: '/home' }
];