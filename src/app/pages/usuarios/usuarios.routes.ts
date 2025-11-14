import { Routes } from '@angular/router';
import { PermisoGuard } from '../../guards/permiso.guard';

export default [
    {
        path: 'usuarios',
        loadComponent: () => import('./components/relacion/relacion.component').then(m => m.RelacionComponent),
        canActivate: [PermisoGuard]

    },
    {
        path: 'perfil',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent),

    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
