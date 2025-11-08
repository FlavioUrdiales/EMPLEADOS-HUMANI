import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toastService.service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Quincena, QuincenaInsertResponse, QuincenaResponse, QuincenasResponse, QuincenaUpdateResponse } from '../interfaces/quincena';

@Injectable({
  providedIn: 'root'
})
export class QuincenaService {

  private apiUrl: string = environment.ENDPOINT_QUINCENA;
  private http: HttpClient = inject(HttpClient);
  private toastService = inject(ToastService);

  public getAll(): Observable<QuincenasResponse> {
    return this.http.get<QuincenasResponse>(`${this.apiUrl}/getAll`).pipe(
      catchError(err => {
        this.toastService.error(err.error.message);
        throw err;
      })
    );
  }

  public getById(id: number): Observable<QuincenaResponse> {
    return this.http.get<QuincenaResponse>(`${this.apiUrl}/getById/${id}`).pipe(
      catchError(err => {
        this.toastService.error(err.error.message);
        throw err;
      })
    );
  }

  public insert(nomina: Quincena): Observable<QuincenaInsertResponse> {
    return this.http.post<QuincenaInsertResponse>(`${this.apiUrl}/insert`, nomina).pipe(
      catchError(err => {
        this.toastService.error(err.error.message);
        throw err;
      })
    );
  }

  public update( nomina: Quincena): Observable<QuincenaUpdateResponse> {
    return this.http.put<QuincenaUpdateResponse>(`${this.apiUrl}/update`, nomina).pipe(
      catchError(err => {
        this.toastService.error(err.error.message);
        throw err;
      })
    );
  }

  public delete(id: number): Observable<QuincenaUpdateResponse> {
    return this.http.delete<QuincenaUpdateResponse>(`${this.apiUrl}/delete/${id}`).pipe(
      catchError(err => {
        this.toastService.error(err.error.message);
        throw err;
      })
    );
  }
}
