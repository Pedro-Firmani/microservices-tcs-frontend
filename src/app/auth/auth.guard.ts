// src/app/auth/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['expectedRole'];

  // Se a rota espera uma role específica E o usuário NÃO tem essa role
  if (expectedRole && !authService.hasRole(expectedRole)) {
    // Redireciona para a NOVA página de erro 403
    router.navigate(['/403']); // <--- ALTERADO AQUI!
    return false; // Impede o acesso à rota
  }

  // Se não há role esperada ou o usuário tem a role, verifica apenas se está autenticado (se necessário para a rota)
  return authService.isAuthenticated$.pipe(
    (obs) => {
      if (!authService.getToken()) {
        router.navigate(['/login']);
        return of(false);
      }
      return obs.pipe(
        map(isLoggedIn => {
          if (!isLoggedIn) {
            router.navigate(['/login']);
            return false;
          }
          return true;
        })
      );
    }
  );
};