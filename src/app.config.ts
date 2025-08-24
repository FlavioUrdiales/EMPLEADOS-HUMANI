import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { AuthInterceptor } from './app/interceptor/interceptor.service';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import { ToastService } from './app/shared/services/toastService.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient(withInterceptors([AuthInterceptor])), // ✅ Aquí se registra el interceptor
    provideAnimationsAsync(),
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: {} },
    MessageService,
    ToastService, 
    providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })
  ]
};
