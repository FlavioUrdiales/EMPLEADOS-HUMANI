import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    constructor(private messageService: MessageService) { }

    private getMensaje(key: string | number) {
        if (typeof key === 'number') {
            switch (key) {
                case 404:
                    return { severity: 'error', summary: 'Error', detail: 'No se encontró el recurso solicitado.' };
                case 500:
                    return { severity: 'error', summary: 'Error', detail: 'Error en el servidor. Intente nuevamente.' };
                case 401:
                    return { severity: 'error', summary: 'Error', detail: 'No autorizado.' };
                case 403:
                    return { severity: 'error', summary: 'Error', detail: 'Acceso denegado.' };
                case 402:  
                    return { severity: 'warn', summary: 'Advertencia', detail: 'Datos no encontrados.' };
                case 8004:
                    return { severity: 'error', summary: 'Error', detail: 'La CURP ya se encuentra registrada.' };
                case 200:
                    return { severity: 'success', summary: 'Éxito', detail: 'Operación realizada.' };
                default:
                    return { severity: 'warn', summary: 'Advertencia', detail: 'Se ha detectado un problema.' };
            }

        }else {
        switch (key) {
            case 'not-results':
                return { severity: 'error', summary: 'Error', detail: 'No se encontraron registros.' };
            case 'save-success':
                return { severity: 'success', summary: 'Éxito', detail: 'Datos guardados correctamente.' };
            case 'update-success':
                return { severity: 'success', summary: 'Éxito', detail: 'Datos actualizados correctamente.' };
            case 'delete-success':
                return { severity: 'success', summary: 'Éxito', detail: 'Datos eliminados correctamente.' };
            case 'error-load':
                return { severity: 'error', summary: 'Error', detail: 'Error al cargar datos. Intente nuevamente.' };
            case 'error-save':
                return { severity: 'error', summary: 'Error', detail: 'Error al guardar datos. Intente nuevamente.' };
            case 'generic-error':
                return { severity: 'error', summary: 'Error', detail: 'Error al realizar la operación. Intente nuevamente.' };
                case 'load-success':
                return { severity: 'success', summary: 'Éxito', detail: 'Datos cargados correctamente.' };
            case 'select-option':
                return { severity: 'warn', summary: 'Advertencia', detail: 'Seleccione al menos una opción.' };
                case 'not-valid':
                return { severity: 'error', summary: 'Error', detail: 'Datos no válidos o incompletos.' };
            case 'matricula-existe':
                return { severity: 'error', summary: 'Error', detail: 'La matrícula ya se encuentra registrada.' };
            case 'bievenido':
                return { severity: 'info', summary: 'Bienvenido', detail: 'Bienvenido a la plataforma.' };
            case 'session-expired':
                return { severity: 'warn', summary: 'Advertencia', detail: 'Su sesión ha expirado. Inicie sesión nuevamente.' };
                
            default:
                return { severity: 'info', summary: 'Información', detail: 'Operación realizada.' };
        }
        }
    }

    // Métodos públicos para cada tipo de mensaje
    public error(key: string | number) {
        const message = this.getMensaje(key);
        this.messageService.add({ ...message, severity: 'error', life: 6000 });
    }

    public info(key: string | number) {
        const message = this.getMensaje(key);
        this.messageService.add({ ...message, severity: 'info' });
    }

    public warning(key: string | number) {
        const message = this.getMensaje(key);
        this.messageService.add({ ...message, severity: 'warn' });
    }

    public success(key: string | number) {
        const message = this.getMensaje(key);
        this.messageService.add({ ...message, severity: 'success' });
    }
}
