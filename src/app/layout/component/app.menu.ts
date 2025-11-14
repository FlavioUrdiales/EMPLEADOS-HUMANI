import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MenuService } from '../service/menu/menu.service';
import { User } from '../../pages/auth/interfaces/user';
import { getDatosUsuario } from '../../shared/helpers/permisos.helper';
import { environment } from '../../../environments/environment';

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
    private menuService: MenuService = inject(MenuService);
    private user: User = getDatosUsuario();

    ngOnInit() {
         this.menuService.getMenuByUsuario(this.user.chrClave, environment.id_sistema).subscribe({
            next: (res) => {
                this.model = res.data;
            },
            error: (err) => {

                console.error('Error al cargar el menú:', err);
            }
        });

    }
}