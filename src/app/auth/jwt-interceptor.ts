// src/app/auth/jwt.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth'; // Importe seu AuthService (o arquivo auth.ts)

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService); // Injeta o AuthService
  const token = authService.getToken(); // Obtém o token de forma síncrona


  const isAuthRequest = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (token && !isAuthRequest) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}` // Formato padrão para Bearer Token
      }
    });
    return next(clonedReq); // Prossegue com a requisição clonada
  }

  return next(req);
};