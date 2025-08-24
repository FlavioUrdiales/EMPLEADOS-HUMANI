import { Routes } from '@angular/router';
import { PermisoGuard } from '../guards/permiso.guard';

export default [
    {path: 'permiso', loadChildren: () => import('./permisos/permisos.routes').then(m => m.default), 
        data: { title: 'Permisos' , permisos : ['superAdmin', 'ADMIN', 'PERMISOS']},
        canActivate: [PermisoGuard]},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
