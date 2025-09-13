import { Pipe, PipeTransform } from '@angular/core';
import { Permisos } from '../../pages/permisos/interfaces/permisos.interface';

@Pipe({
  name: 'filtroEstado',
  standalone: true
})
export class FiltroEstadoPipe implements PipeTransform {
  transform(permisos: Permisos[], estado: string | null): Permisos[] {
    if (!estado) return permisos; // Todos
    return permisos.filter(p => p.estado === estado);
  }
}
