// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register'; // Importe este
import { StudentListComponent } from './students/student-list/student-list';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, 
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'students', component: StudentListComponent },
  // ...outras rotas
];