import { Routes } from '@angular/router';
import { PermisoGuard } from '../guards/permiso.guard';

export default [
    {
        path: 'permiso', loadChildren: () => import('./permisos/permisos.routes').then(m => m.default),
        data: { title: 'Permisos', permisos: ['superAdmin', 'ADMIN', 'PERMISOS'] },
        canActivate: [PermisoGuard]
    },
    {
        path: 'nomina', loadChildren: () => import('./nomina/nomina.routes').then(m => m.default),
        data: { title: 'Nómina', permisos: ['superAdmin', 'ADMIN', 'NOMINA'] },
        canActivate: [PermisoGuard]
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
