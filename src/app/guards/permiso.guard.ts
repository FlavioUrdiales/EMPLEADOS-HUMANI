import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../pages/auth/services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PermisoGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const permisosRequeridos: string[] = route.data['permisos'] || [];

    return this.authService.getPermisosUsuario().pipe(
      take(1), 
      map((response : any ) => {
        if (response?.response !== 'success' || !Array.isArray(response.data)) {
          this.router.navigate(['/auth/error']); 
          return false;
        }

        const permisosUsuario = response.data.map((p: { chrclaveperfil: string }) => p.chrclaveperfil);
        const tienePermiso = permisosRequeridos.some(permiso => permisosUsuario.includes(permiso));

        if (!tienePermiso) {
          this.router.navigate(['/auth/access']); 
          return false;
        }
        return true;
      })
    );
  }
}
