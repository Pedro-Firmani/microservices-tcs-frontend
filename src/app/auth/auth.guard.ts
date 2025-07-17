// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

// O guarda agora é uma função, que é a abordagem moderna do Angular
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Pega a role esperada para a rota (ex: 'PROFESSOR')
  const expectedRole = route.data['expectedRole'];

  if (!authService.hasRole(expectedRole)) {
    // Se não tiver a role, redireciona para a página de grupos
    router.navigate(['/grupos']);
    return false;
  }

  return true; // Permite o acesso
};