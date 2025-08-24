import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../pages/auth/services/auth.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "../../pages/auth/interfaces/user";
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root',
})
export class PermisosHelper {
  private permisosSistema: string[] = environment.permisosSistema;

  constructor(private auth: AuthService) { }

  public tienePermisoSistema(): Observable<boolean> {
    return this.auth.getPermisosUsuario().pipe(
      map((response: any) => {
        if (response && response.data) {
          return response.data.some((element: any) =>
            this.permisosSistema.includes(element.chrclaveperfil)
          );
        }
        return false;
      })
    );
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