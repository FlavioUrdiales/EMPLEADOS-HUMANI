import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../pages/auth/services/auth.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../../pages/auth/interfaces/user";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MenuService } from "../../layout/service/menu/menu.service";

@Injectable({
  providedIn: 'root',
})
export class PermisosHelper {
  private permisosSistema: string[] = environment.permisosSistema;
  constructor(private auth: AuthService,private menuService: MenuService) { }

  public tienePermisoSistema(usuario:string): Observable<boolean> {
  return this.menuService.getMenuByUsuario(usuario, environment.id_sistema).pipe(
      map(res => {
        return res.data.length > 0;
      }
    ));
  }
}

// Función utilitaria para verificar permisos individuales
export const tienePermiso = (permisos: string[], permiso: string): boolean => {
  return permisos.includes(permiso);
};


export const getDatosUsuario = (): User => {
  let jwtHelper: JwtHelperService = new JwtHelperService();
  let usuario = sessionStorage.getItem('token');
  if (usuario) {
    return jwtHelper.decodeToken(usuario).data;
  } else {
    return {} as User;
  }

}