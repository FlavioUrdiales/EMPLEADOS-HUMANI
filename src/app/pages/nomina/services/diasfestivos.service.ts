import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toastService.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { 
  DiaFeriado, 
  DiasFeriadosResponse, 
  DiaFeriadoResponse, 
  DiaFeriadoInsertResponse, 
  DiaFeriadoUpdateResponse, 
  DiaFeriadoDeleteResponse 
} from '../interfaces/diasferiados.interface';

@Injectable({
  providedIn: 'root'
})
export class DiasfestivosService {

  private apiUrl: string = environment.ENDPOINT_DIAS_FESTIVOS;
  private http: HttpClient = inject(HttpClient);
  private toastService = inject(ToastService);

  public getAll(): Observable<DiasFeriadosResponse> {
    return this.http.get<DiasFeriadosResponse>(`${this.apiUrl}/getAll`).pipe(
      catchError(err => {
        this.toastService.error(err.error?.message || 'Error al obtener los días festivos');
        throw err;
      })
    );
  }

  public getById(id: number): Observable<DiaFeriadoResponse> {
    return this.http.get<DiaFeriadoResponse>(`${this.apiUrl}/getById/${id}`).pipe(
      catchError(err => {
        this.toastService.error(err.error?.message || 'Error al obtener el día festivo');
        throw err;
      })
    );
  }

  public insert(dia: DiaFeriado): Observable<DiaFeriadoInsertResponse> {
    return this.http.post<DiaFeriadoInsertResponse>(`${this.apiUrl}/insert`, dia).pipe(
      catchError(err => {
        this.toastService.error(err.error?.message || 'Error al insertar el día festivo');
        throw err;
      })
    );
  }

  public update(dia: DiaFeriado): Observable<DiaFeriadoUpdateResponse> {
    return this.http.put<DiaFeriadoUpdateResponse>(`${this.apiUrl}/update`, dia).pipe(
      catchError(err => {
        this.toastService.error(err.error?.message || 'Error al actualizar el día festivo');
        throw err;
      })
    );
  }

  public delete(id: number): Observable<DiaFeriadoDeleteResponse> {
    return this.http.delete<DiaFeriadoDeleteResponse>(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(err => {
        this.toastService.error(err.error?.message || 'Error al eliminar el día festivo');
        throw err;
      })
    );
  }
}
