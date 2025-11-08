import { Routes } from '@angular/router';

export default [

    {path: 'incidencias', loadComponent: () => import('./components/incidencias/incidencias.component').then(m => m.IncidenciasComponent)},
    {path: 'quincenas', loadComponent: () => import('./components/quincena/quincena.component').then(m => m.QuincenaComponent)},
    {path: 'diasfestivos', loadComponent: () => import('./components/diasfestivos/diasfestivos.component').then(m => m.DiasfestivosComponent)},
    {path: 'nominas', loadComponent: () => import('./components/nominas/nominas.component').then(m => m.NominasComponent)},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
