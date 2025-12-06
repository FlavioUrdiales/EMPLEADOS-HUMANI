import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../../shared/services/toastService.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, of, throwError } from 'rxjs';
import { CorreosRequest } from '../../../layout/interfaces/correos';

@Injectable({
    providedIn: 'root'
})
export class CorreosService {
    private apiUrl: string = environment.ENDPOINT_INSCRIPCIONES;
    private http: HttpClient = inject(HttpClient);
    private toastService = inject(ToastService);

    public sendCorreoElectronico($data: CorreosRequest): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}sendCorreoElectronico`, $data)
            .pipe(
                catchError(err => throwError(() => err))
            );
    }

}

