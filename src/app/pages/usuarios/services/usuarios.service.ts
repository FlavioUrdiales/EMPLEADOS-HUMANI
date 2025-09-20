import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toastService.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
 private apiUrl: string = environment.ENDPOINT_CHECADOR;
  private http: HttpClient = inject(HttpClient);
  private toastService = inject(ToastService);

  public insertarUsuarioChecador(id_checador: number, chr_clave_usuario: string): Observable<any> {
    let sendData = { data: { id_checador, chr_clave_usuario } };

    return this.http.post<any>(`${this.apiUrl}insertarUsuarioChecador`, { ...sendData }).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of(null);
    }));
  }

  public eliminarUsuarioChecador(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}eliminarUsuarioChecador/${id}`).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of(null);
    }));
  }

  public getUsuariosChecador(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}getUsuariosChecador`).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of([]);
    }));
  }

}

