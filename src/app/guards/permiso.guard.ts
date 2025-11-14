import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MenuService } from '../layout/service/menu/menu.service';
import { getDatosUsuario } from '../shared/helpers/permisos.helper';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermisoGuard implements CanActivate {

  private menuService: MenuService = inject(MenuService);
  private router: Router = inject(Router);
  private user = getDatosUsuario();

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    // Obtenemos la ruta que se intenta acceder
    const url = state.url;

    return this.menuService.getMenuByUsuario(this.user.chrClave, environment.id_sistema).pipe(
      map(res => {
        const allowed = this.verificarPermiso(res.data, url);
        if (!allowed) {
          // Redirigir a una página de "sin permiso" o dashboard
          this.router.navigate(['/']);
        }
        return allowed;
      }),
      catchError(err => {
        console.error('Error al validar permisos', err);
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }

  // Función recursiva para verificar permiso en el menú
  private verificarPermiso(menu: any[], url: string): boolean {
    for (const item of menu) {
      if (item.items) {
        if (this.verificarPermiso(item.items, url)) {
          return true;
        }
      }
      if (item.routerLink && item.routerLink.includes(url)) {
        return true;
      }
    }
    return false;
  }
}
