import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

type MessageKey =
  | 'not-results'
  | 'save-success'
  | 'update-success'
  | 'delete-success'
  | 'error-load'
  | 'error-save'
  | 'generic-error'
  | 'load-success'
  | 'select-option'
  | 'not-valid'
  | 'matricula-existe'
  | 'bienvenido'
  | 'session-expired';

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Mapa de códigos numéricos
  private readonly messagesByCode: Record<number, string> = {
    200: 'Operación realizada.',
    401: 'No autorizado.',
    402: 'Datos no encontrados.',
    403: 'Acceso denegado.',
    404: 'No se encontró el recurso solicitado.',
    500: 'Error en el servidor. Intente nuevamente.',
    8004: 'La CURP ya se encuentra registrada.',
  };

  // Mapa de claves de texto
  private readonly messagesByKey: Record<MessageKey, string> = {
    'not-results': 'No se encontraron registros.',
    'save-success': 'Datos guardados correctamente.',
    'update-success': 'Datos actualizados correctamente.',
    'delete-success': 'Datos eliminados correctamente.',
    'error-load': 'Error al cargar datos. Intente nuevamente.',
    'error-save': 'Error al guardar datos. Intente nuevamente.',
    'generic-error': 'Error al realizar la operación. Intente nuevamente.',
    'load-success': 'Datos cargados correctamente.',
    'select-option': 'Seleccione al menos una opción.',
    'not-valid': 'Datos no válidos o incompletos.',
    'matricula-existe': 'La matrícula ya se encuentra registrada.',
    'bienvenido': 'Bienvenido a la plataforma.',
    'session-expired': 'Su sesión ha expirado. Inicie sesión nuevamente.',
  };

  constructor(private messageService: MessageService) {}

  // Método genérico para mostrar un toast
  private show(detail: string, severity: 'success' | 'error' | 'warn' | 'info', life = 5000) {
    this.messageService.add({ severity, summary: this.getSummary(severity), detail, life });
  }

  // Devuelve el summary automáticamente según el severity
  private getSummary(severity: 'success' | 'error' | 'warn' | 'info'): string {
    switch (severity) {
      case 'success': return 'Éxito';
      case 'error': return 'Error';
      case 'warn': return 'Advertencia';
      case 'info': return 'Información';
    }
  }

  // Resolución del mensaje según clave, código o mensaje custom
  private resolveMessage(key: number | MessageKey | string): string {
    if (typeof key === 'number') return this.messagesByCode[key] ?? key.toString();
    if (typeof key === 'string') return this.messagesByKey[key as MessageKey] ?? key;
    return String(key);
  }

  // Métodos públicos
  public success(key: number | MessageKey | string) {
    this.show(this.resolveMessage(key), 'success');
  }

  public error(key: number | MessageKey | string) {
    this.show(this.resolveMessage(key), 'error', 6000);
  }

  public warning(key: number | MessageKey | string) {
    this.show(this.resolveMessage(key), 'warn');
  }

  public info(key: number | MessageKey | string) {
    this.show(this.resolveMessage(key), 'info');
  }
}
