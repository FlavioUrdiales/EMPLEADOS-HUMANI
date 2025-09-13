import { Routes } from '@angular/router';

export default [

    {path: 'solicitud', loadComponent: () => import('./components/permiso-form/permiso-form.component').then(m => m.PermisoFormComponent)},
    {path: 'autorizaciones', loadComponent: () => import('./components/autorizaciones/autorizaciones.component').then(m => m.AutorizacionesComponent)},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
