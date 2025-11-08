import { Routes } from '@angular/router';

export default [
    { path: 'usuarios', loadComponent: () => import('./components/relacion/relacion.component').then(m => m.RelacionComponent) },
    {path: 'perfil', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
