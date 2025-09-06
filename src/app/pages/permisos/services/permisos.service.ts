import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ToastService } from '../../../shared/services/toastService.service';
import { catchError, of } from 'rxjs';
import { PermisosResponse } from '../../auth/interfaces/permisos';
import { CorreoJefe, TipoPermiso } from '../interfaces/permisos.interface';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  private apiUrl: string = environment.ENDPOINT_PERMISOS;
  private apiUrlTipoPermisos: string = environment.ENDPOINT_TIPOPERMISOS;
  private apiUrlCorreosJefes: string = environment.ENDPOINT_CORREOSJEFES;

  private http: HttpClient = inject(HttpClient);
  private toastService = inject(ToastService);

  public getAll(): Observable<PermisosResponse> {
    return this.http.get<PermisosResponse>(`${this.apiUrl}getAll`).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of({ response: 'error', message: err.message, data: false });
    }));
  }

  public getAllTiposPermisos(): Observable<TipoPermiso[]> {
    return this.http.get<TipoPermiso[]>(`${this.apiUrlTipoPermisos}getAll`).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of([]);
    }));
  }

  public getAllCorreosJefes(): Observable<CorreoJefe[]> {
    return this.http.get<CorreoJefe[]>(`${this.apiUrlCorreosJefes}getAll`).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of([]);
    }));
  }

  public getById(id: number): Observable<PermisosResponse> {
    return this.http.get<PermisosResponse>(`${this.apiUrl}getById/${id}`).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of({ response: 'error', message: err.message, data: false });
    }));

  }

  public create(data: any): Observable<PermisosResponse> {
    return this.http.post<PermisosResponse>(`${this.apiUrl}create`, data).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of({ response: 'error', message: err.message, data: false });
    }));
  }

  public updateStatus(id: number, estado: string): Observable<PermisosResponse> {
    return this.http.put<PermisosResponse>(`${this.apiUrl}updateStatus/${id}/${estado}`, {}).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of({ response: 'error', message: err.message, data: false });
    }));
  }

}

