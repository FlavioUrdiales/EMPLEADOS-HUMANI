import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toastService.service';
import { Observable } from 'rxjs/internal/Observable';
import { RegistroAsistencia } from '../interfaces/incidencias.interface';
import { catchError, of } from 'rxjs';
import { DetalleNominaResponse, NominasResponse, ObtenerNominasPorPeriodo } from '../interfaces/nominas';

@Injectable({
  providedIn: 'root'
})
export class NominaService {

  private apiUrl: string = environment.ENDPOINT_CHECADOR;
  private http: HttpClient = inject(HttpClient);
  private toastService = inject(ToastService);

  public getReporteAdministrativos(fechaInicio: string, fechaFin: string,usuario : any = null): Observable<RegistroAsistencia[]> {
    return this.http.post<RegistroAsistencia[]>(`${this.apiUrl}getReporteAdministrativos`, { fechaInicio, fechaFin,usuario }).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of([]);
    }));
  }

  public getReporteAdministrativosByUser(fechaInicio: string, fechaFin: string,usuario : string): Observable<RegistroAsistencia[]> {
    return this.http.post<RegistroAsistencia[]>(`${this.apiUrl}getReporteAdministrativos`, { fechaInicio, fechaFin, usuario }).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of([]);
    }));
  }

  public generarNominaQuincenal(mes: number, anio: number, diasTrabajadosPorEmpleado: any, incidenciasPorEmpleado: any, rangoFechas: any, bonosPorEmpleado: any = [], cargosPorEmpleado: any = [], retencionesPorEmpleado: any = []): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}generarNominaQuincenal`, { mes, anio, diasTrabajadosPorEmpleado, incidenciasPorEmpleado, rangoFechas, bonosPorEmpleado, cargosPorEmpleado, retencionesPorEmpleado }).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of(null);
    }));
  }

  public guardarNomina(nomina: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}guardarNominas`, { nomina }).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of(null);
    }));
  }

  public finalizarNomina(mes: number, anio: number, quincena: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}finalizarNomina`, { mes, anio, quincena }).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of(null);
    }));
  }


  public getNominas(): Observable<NominasResponse> {
    return this.http.get<NominasResponse>(`${this.apiUrl}obtenerListadoDeNominas`).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of({ response: false, message: 'Error al obtener nóminas', data: [] });
    }));
  }

  public getNominaDetalle(obtenerNominasPorPeriodo: ObtenerNominasPorPeriodo): Observable<DetalleNominaResponse> {
    return this.http.post<DetalleNominaResponse>(`${this.apiUrl}obtenerNominasPorPeriodo`, obtenerNominasPorPeriodo).pipe(catchError((err) => {
      this.toastService.error(err.status);
      return of({ response: false, message: 'Error al obtener detalles de nómina', data: [] });
    }));
  }



}
