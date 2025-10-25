import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toastService.service';
import { Observable } from 'rxjs/internal/Observable';
import { RegistroAsistencia } from '../interfaces/incidencias.interface';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NominaService {

  private apiUrl: string = environment.ENDPOINT_CHECADOR;
  private http: HttpClient = inject(HttpClient);
  private toastService = inject(ToastService);

  public getReporteAdministrativos(fechaInicio: string, fechaFin: string): Observable<RegistroAsistencia[]> {
    return this.http.post<RegistroAsistencia[]>(`${this.apiUrl}getReporteAdministrativos`, { fechaInicio, fechaFin }).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of([]);
    }));
  }



  public generarNominaQuincenal(mes: number, anio: number,diasTrabajadosPorEmpleado: any,incidenciasPorEmpleado: any,rangoFechas: any,bonosPorEmpleado: any = [],cargosPorEmpleado: any = [],retencionesPorEmpleado: any = []): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}generarNominaQuincenal`, {mes,anio,diasTrabajadosPorEmpleado,incidenciasPorEmpleado,rangoFechas,bonosPorEmpleado,cargosPorEmpleado,retencionesPorEmpleado}).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of(null);
    }));
  }

  public guardarNomina(nomina: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}guardarNominas`, {nomina}).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of(null);
    }));
  }

  public finalizarNomina(mes: number, anio: number, quincena: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}finalizarNomina`, {mes,anio,quincena}).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of(null);
    }));
  }

}
