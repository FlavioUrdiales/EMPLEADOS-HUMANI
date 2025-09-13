import { Routes } from '@angular/router';

export default [

    {path: 'incidencias', loadComponent: () => import('./components/incidencias/incidencias.component').then(m => m.IncidenciasComponent)},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
