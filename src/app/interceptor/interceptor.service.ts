import { inject, Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { ToastService } from '../shared/services/toastService.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService); // ✅ Inyectar el servicio de toast
  const token = sessionStorage.getItem('token');

  if (token) {
    const authReq = req.clone({
      setHeaders: { Token: `Bearer ${token}` }
    });

    console.log('✅ Interceptor ejecutado, enviando token:', token); // Debug
    return next(authReq);
  }

  console.log('⚠️ No hay token, pasando la solicitud sin cambios.');
  return next(req);
};
