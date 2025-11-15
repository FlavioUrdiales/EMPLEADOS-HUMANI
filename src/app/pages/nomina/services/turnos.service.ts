import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../shared/services/toastService.service';
import { catchError, Observable } from 'rxjs';
import { Turno, TurnoInsertResponse, TurnosResponse } from '../interfaces/turnos.interface';

@Injectable({
  providedIn: 'root'
})
export class TurnosService {

    private apiUrl: string = environment.ENDPOINT_TURNOS;
    private http: HttpClient = inject(HttpClient);
    private toastService = inject(ToastService);

      public getAll(): Observable<TurnosResponse> {
        return this.http.get<TurnosResponse>(`${this.apiUrl}/getAll`).pipe(
          catchError(err => {
            this.toastService.error(err.error.message);
            throw err;
          })
        );
      }
    
      public getById(id: number): Observable<Turno> {
        return this.http.get<Turno>(`${this.apiUrl}/getById/${id}`).pipe(
          catchError(err => {
            this.toastService.error(err.error.message);
            throw err;
          })
        );
      }
    
      public insert(turno: Turno): Observable<TurnoInsertResponse> {
        return this.http.post<any>(`${this.apiUrl}/insert`, turno).pipe(
          catchError(err => {
            this.toastService.error(err.error.message);
            throw err;
          })
        );
      }
    
      public update( turno: Turno): Observable<TurnoInsertResponse> {
        return this.http.put<any>(`${this.apiUrl}/update`, turno).pipe(
          catchError(err => {
            this.toastService.error(err.error.message);
            throw err;
          })
        );
      }
    
      public delete(id: number): Observable<TurnoInsertResponse> {
        return this.http.delete<TurnoInsertResponse>(`${this.apiUrl}/delete/${id}`).pipe(
          catchError(err => {
            this.toastService.error(err.error.message);
            throw err;
          })
        );
      }
  
}
