import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MenuResponse } from '../../interfaces/menu';
import { catchError, Observable } from 'rxjs';
import { ToastService } from '../../../shared/services/toastService.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private http: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.ENDPOINT_MENU;
  private toastService = inject(ToastService);

  public getMenuByUsuario(usuario: string, sistema: number): Observable<MenuResponse> {
    const body = {
      usuario: usuario,
      sistema: sistema
    };
    return this.http.post<MenuResponse>(`${this.baseUrl}getMenuByUsuario`, body).pipe(
      catchError(err => {
        this.toastService.error(err.error.message);
        throw err;
      })
    );

  }
}
