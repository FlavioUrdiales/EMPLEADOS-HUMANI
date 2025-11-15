import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginInterface } from '../interfaces/login';
import { environment } from '../../../../environments/environment';
import { JwtHelperService,JWT_OPTIONS  } from '@auth0/angular-jwt';
import { Observable, catchError, of, throwError } from 'rxjs';
import { PermisosResponse } from '../interfaces/permisos';
import { ToastService } from '../../../shared/services/toastService.service';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private URL = environment.ENPOINT_AUTH;
  private ENDPOIN_VALIDATE = environment.ENDPOINT_VALIDATES;
  private token: string | null = null;
  constructor(private http: HttpClient, private jwtHelper: JwtHelperService, private toastService: ToastService) { }

  public signIn(data: LoginInterface) {
    return this.http.post(`${this.URL}login`, data).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of({});
    }));
  }

  public getFotoUsuario(user:string): Observable<any> {
    let data = {
      data: user
    };
    return this.http.post<any>(`${this.URL}getFotoUsuario`,data).pipe(catchError((err) => {
      console.log(err);
      return of({});
    }));
  }

  getToken(): string | null {
    return this.token || sessionStorage.getItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    sessionStorage.setItem('token', token);
    localStorage.setItem('token', token); // Guardar en localStorage también
  }

  clearToken(): void {
    this.token = null;
    sessionStorage.removeItem('token');
  }


  public isAuthenticated(): boolean {
    const tokenFromMemory = this.token;
    if (tokenFromMemory && !this.jwtHelper.isTokenExpired(tokenFromMemory)) {
      return true;
    }
  
    // Si no está en memoria, lo buscamos en sessionStorage
    const tokenFromStorage = sessionStorage.getItem('token');
    if (tokenFromStorage && !this.jwtHelper.isTokenExpired(tokenFromStorage)) {
      this.token = tokenFromStorage; // Lo cargamos en memoria
      return true;
    }
  
    // Si no hay token válido, retornamos false
    return false;
  }

  public validarPermisos($data: any): Observable<PermisosResponse> {
    return this.http
      .post<PermisosResponse>(`${this.ENDPOIN_VALIDATE}validarPermisos`, $data)
      .pipe(catchError((err) => throwError(() => err)));
  }

  public getPermisosUsuario(): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.ENDPOIN_VALIDATE}getPermisosUsuario`)
      .pipe(catchError((err) => {
        this.toastService.error(err.status);
        return of([]);
      }));
  }

  public changuePassword(chrClave: string, chrPassword: string): Observable<any> {
    let senData = {
      data: {
        chrClave,
        chrPassword
      }
    }
    return this.http.post(`${this.URL}changePassword`, senData).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of({});
    }));
  }

  public logout(): void {
    this.clearToken();
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/auth/login';
  }

}

