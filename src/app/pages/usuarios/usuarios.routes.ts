import { Routes } from '@angular/router';

export default [
    { path: 'usuarios', loadComponent: () => import('./components/relacion/relacion.component').then(m => m.RelacionComponent) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
