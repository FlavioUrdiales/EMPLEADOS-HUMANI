import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { AuthService } from '../../pages/auth/services/auth.service';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { User } from '../../pages/auth/interfaces/user';
import { getDatosUsuario } from '../../shared/helpers/permisos.helper';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        StyleClassModule,
        AppConfigurator,
        MenuModule,
        AvatarModule
    ],
    template: `
    <div class="layout-topbar flex justify-between items-center px-4 py-2 shadow-md bg-surface-0 dark:bg-surface-900">
        <!-- Logo y botón de menú -->
        <div class="flex items-center gap-2">
            <button class="layout-menu-button layout-topbar-action mr-3" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars text-xl"></i>
            </button>

            <a class="layout-topbar-logo flex items-center gap-2 no-underline" routerLink="/">
                <img src="/images/logos/isotipo-nuevo.png" alt="Logo" class="h-8 w-auto object-contain" />
                <span class="font-bold text-lg text-primary-700 dark:text-primary-300">U H M</span>
            </a>
        </div>

        <!-- Acciones del topbar -->
        <div class="flex items-center gap-4">
            <!-- Modo oscuro -->
            <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                <i [ngClass]="{
                    'pi': true,
                    'pi-moon': layoutService.isDarkTheme(),
                    'pi-sun': !layoutService.isDarkTheme()
                }" class="text-xl"></i>
            </button>

            <!-- Configurador -->
            <div class="relative">
                <button
                    class="layout-topbar-action layout-topbar-action-highlight"
                    pStyleClass="@next"
                    enterFromClass="hidden"
                    enterActiveClass="animate-scalein"
                    leaveToClass="hidden"
                    leaveActiveClass="animate-fadeout"
                    [hideOnOutsideClick]="true">
                    <i class="pi pi-palette text-xl"></i>
                </button>
                <app-configurator />
            </div>

            <!-- Menú de usuario -->
            <p-menu #userMenu [model]="items" [popup]="true"></p-menu>
            <button
                class="layout-topbar-action"
                (click)="userMenu.toggle($event)">
                <p-avatar
                    [image]="usuario.chrFoto ? usuario.chrFoto : 'assets/demo/images/avatar/default.png'"
                    shape="circle"
                    size="large"
                    styleClass="cursor-pointer"></p-avatar>
            </button>


        </div>
    </div>
    `
})
export class AppTopbar  implements OnInit {
    items: MenuItem[] = [];

    public layoutService: LayoutService = inject(LayoutService);
    private authService: AuthService = inject(AuthService);
    public usuario: User = getDatosUsuario();
    
    constructor() {
        this.items = [
            {
                label: 'Perfil',
                icon: 'pi pi-user',
                routerLink: '/pages/usuarios/perfil'
            },
           /* {
                label: 'Configuraciones',
                icon: 'pi pi-cog',
                routerLink: '/configuracion'
            },*/
            { separator: true },
            {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out',
                command: () => this.cerrarSesion()
            }
        ];


    }

    ngOnInit() {
        this.authService.getFotoUsuario(this.usuario.chrClave).subscribe({
            next: (res) => {
                if (res && res.data) {
                    this.usuario.chrFoto = res.data;
                }
            }
        });

    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    cerrarSesion() {
        this.authService.logout();
    }
}
