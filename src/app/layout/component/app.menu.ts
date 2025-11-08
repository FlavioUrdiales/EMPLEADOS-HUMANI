import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Permisos',
                items: [
                    { label: 'Solicitud de Permiso', icon: 'pi pi-fw pi-file', routerLink: ['/pages/permiso/solicitud'] },
                    { label: 'Autorizaciones', icon: 'pi pi-fw pi-check-square', routerLink: ['/pages/permiso/autorizaciones'] }
                ]
            },
            {
                label: 'Nómina',
                items: [
                    { label: 'Incidencias', icon: 'pi pi-fw pi-calendar-times', routerLink: ['/pages/nomina/incidencias'] },
                    { label: 'Días Festivos', icon: 'pi pi-fw pi-calendar-plus', routerLink: ['/pages/nomina/diasfestivos'] },
                    { label: 'Nóminas', icon: 'pi pi-fw pi-money-bill', routerLink: ['/pages/nomina/nominas'] }
                ]
            },

            {
                label: 'Usuarios',
                items: [
                    { label: 'Relación de Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/pages/usuarios/usuarios'] }
                    , { label: 'Quincenas', icon: 'pi pi-fw pi-money-bill', routerLink: ['/pages/nomina/quincenas'] }

                ]
            },
        ];
    }
}