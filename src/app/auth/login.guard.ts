// src/app/auth/login.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';
import { map, take } from 'rxjs/operators';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Usamos o observable isAuthenticated$ do nosso serviço
  return authService.isAuthenticated$.pipe(
    take(1), // Pega apenas o valor mais recente e completa
    map(isLoggedIn => {
      if (isLoggedIn) {
        return true; // Se estiver logado, permite o acesso
      } else {
        // Se não estiver logado, redireciona para a página de login
        router.navigate(['/login']);
        return false;
      }
    })
  );
};