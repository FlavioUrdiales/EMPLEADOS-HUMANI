import { Routes } from '@angular/router';

export default [
    {
        path: 'permiso', loadChildren: () => import('./permisos/permisos.routes').then(m => m.default),
        data: { title: 'Permisos', permisos: ['superAdmin', 'ADMIN', 'PERMISOS'] },
    },
    {
        path: 'nomina', loadChildren: () => import('./nomina/nomina.routes').then(m => m.default),
        data: { title: 'Nómina', permisos: ['superAdmin', 'ADMIN', 'NOMINA'] },
    },
    {
        path: 'usuarios', loadChildren: () => import('./usuarios/usuarios.routes').then(m => m.default),
        data: { title: 'Usuarios', permisos: ['superAdmin', 'ADMIN', 'USUARIOS'] },
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
