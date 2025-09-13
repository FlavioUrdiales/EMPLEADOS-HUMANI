import { inject, Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { ToastService } from '../shared/services/toastService.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService); 
  const token = sessionStorage.getItem('token');

  if (token) {
    const authReq = req.clone({
      setHeaders: { Token: `Bearer ${token}` }
    });

    return next(authReq);
  }
  toastService.error('No autenticado');

  return next(req);
};
