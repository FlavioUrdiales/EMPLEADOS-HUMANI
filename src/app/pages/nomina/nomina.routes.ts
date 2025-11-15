import { Routes } from '@angular/router';
import { PermisoGuard } from '../../guards/permiso.guard';

export default [

    {
        path: 'incidencias',
        loadComponent: () => import('./components/incidencias/incidencias.component').then(m => m.IncidenciasComponent),
        canActivate: [PermisoGuard]

    },
    {
        path: 'quincenas',
        loadComponent: () => import('./components/quincena/quincena.component').then(m => m.QuincenaComponent),
        canActivate: [PermisoGuard]

    },
    {
        path: 'diasfestivos',
        loadComponent: () => import('./components/diasfestivos/diasfestivos.component').then(m => m.DiasfestivosComponent),
        canActivate: [PermisoGuard]

    },
    {
        path: 'nominas',
        loadComponent: () => import('./components/nominas/nominas.component').then(m => m.NominasComponent),
        canActivate: [PermisoGuard]

    },

    //turnos
    {
        path: 'turnos',
        loadComponent: () => import('./components/turnos/turnos.component').then(m => m.TurnosComponent),
        canActivate: [PermisoGuard]
    },

    
    
    { path: '**', redirectTo: '/notfound' }
] as Routes;
