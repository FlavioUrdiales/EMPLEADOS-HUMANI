import { Routes } from '@angular/router';
import { PermisoGuard } from '../../guards/permiso.guard';

export default [

    {
        path: 'solicitud',
        loadComponent: () => import('./components/permiso-form/permiso-form.component').then(m => m.PermisoFormComponent),
        canActivate: [PermisoGuard]

    },
    {
        path: 'autorizaciones',
        loadComponent: () => import('./components/autorizaciones/autorizaciones.component').then(m => m.AutorizacionesComponent),
        canActivate: [PermisoGuard]
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
