import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

import { NominaService } from '../../services/nomina.service';
import { RegistroAsistencia } from '../../interfaces/incidencias.interface';

interface UsuarioResumen {
  usuario: string;
  diasConIncidencias: number;
  incidencias: Record<string, { count: number; descripcion: string; cubierta?: boolean }>;
}

@Component({
  selector: 'app-incidencias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    ConfirmDialogModule,
    ButtonModule,
    DatePickerModule,
    TableModule,
    InputTextModule,
    TooltipModule
  ],
  templateUrl: './incidencias.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrls: ['./incidencias.component.scss']
})
export class IncidenciasComponent implements OnInit {
  private nominaService: NominaService = inject(NominaService);

  public registrosAsistencia: RegistroAsistencia[] = [];
  public rangoFechas: Date[] = [];

  // Incidencias fijas
  public codigosIncidencias: Record<string, string> = {
    'Retardo en entrada': 'RET_ENT',
    'Falta de entrada': 'FAL_ENT',
    'Salida anticipada': 'SAL_ANT',
    'Falta de salida': 'FAL_SAL',
    'No checó comida': 'NO_CH_COM',
    'Retardo en salida a comida': 'RET_SAL_COM',
    'Retardo en regreso de comida': 'RET_REG_COM',
    'No hay turno definido para este día': 'NO_TUR',
    'Permiso': 'PERM'
  };

  // Reglas de permisos
  private reglasPermisos: Record<string, string[]> = {
    'faltar': ['FAL_ENT', 'FAL_SAL'],
    'llegar_tarde': ['RET_ENT'],
    'salir_temprano': ['SAL_ANT']
  };

  ngOnInit(): void {
    const fechaFin = new Date();
    const fechaInicio = new Date();
    fechaInicio.setDate(fechaFin.getDate() - 15);
    this.rangoFechas = [fechaInicio, fechaFin];
    this.buscarIncidencias();
  }

  buscarIncidencias(): void {
    if (!this.rangoFechas || this.rangoFechas.length < 2 || !this.rangoFechas[0] || !this.rangoFechas[1]) {
      console.warn('Rango de fechas incompleto');
      return;
    }

    const fechaInicioStr = this.rangoFechas[0].toISOString().split('T')[0];
    const fechaFinStr = this.rangoFechas[1].toISOString().split('T')[0];

    this.nominaService.getReporteAdministrativos(fechaInicioStr, fechaFinStr)
      .subscribe({
        next: (data) => {
          console.log('Data recibida:', data); // <-- aquí ves toda la data
          this.registrosAsistencia = data.map(reg => ({
            ...reg,
            incidencias: this.normalizarIncidencias(reg) ?? []
          }));
        },
        error: (err) => console.error('Error al obtener registros:', err)
      });
  }

  onRangoFechasChange(event: any) {
    this.buscarIncidencias();
  }

  private normalizarIncidencias(registro: RegistroAsistencia): { descripcion: string; codigo: string; cubierta?: boolean }[] {
    const incidencias: { descripcion: string; codigo: string; cubierta?: boolean }[] = [];

    (registro.incidencias ?? []).forEach(inc => {
      if (inc.codigo !== 'NO_TUR') {
        incidencias.push({
          descripcion: inc.descripcion,
          codigo: this.codigosIncidencias[inc.descripcion] || inc.codigo,
          cubierta: false
        });
      }
    });

    (registro.incidencias ?? []).forEach(inc => {
      if (inc.codigo === 'PERM') {
        const tipo = this.extraerTipoPermiso(inc.descripcion);
        if (tipo) {
          incidencias.forEach(i => {
            if (this.permisoCubreIncidencia(tipo, i.codigo)) {
              i.cubierta = true;
            }
          });
        }
      }
    });

    return incidencias;
  }

  private extraerTipoPermiso(descripcion: string): string | null {
    const match = descripcion.match(/tipo:\s*(\w+)/i);
    return match ? match[1] : null;
  }

  private permisoCubreIncidencia(permiso: string, codigoIncidencia: string): boolean {
    return this.reglasPermisos[permiso]?.includes(codigoIncidencia) ?? false;
  }

getUsuariosAgrupados(): UsuarioResumen[] {
  const mapa: Record<string, UsuarioResumen> = {};
  const codigos = Object.values(this.codigosIncidencias);

  this.registrosAsistencia.forEach(r => {
    const user = r.usuario;
    if (!mapa[user]) {
      // Inicializa todas las incidencias en 0
      const incidenciasInit: Record<string, { count: number; descripcion: string; cubierta?: boolean }> = {};
      codigos.forEach(c => incidenciasInit[c] = { count: 0, descripcion: c, cubierta: false });

      mapa[user] = {
        usuario: user,
        diasConIncidencias: 0,
        incidencias: incidenciasInit
      };
    }

    let tieneIncidencia = false;

    (r.incidencias ?? []).forEach(inc => {
      // Siempre contamos cada incidencia, aunque sea cubierta
      if (!mapa[user].incidencias[inc.codigo]) {
        mapa[user].incidencias[inc.codigo] = { count: 0, descripcion: inc.descripcion, cubierta: !!inc.cubierta };
      }

      mapa[user].incidencias[inc.codigo].count += 1;

      if (!inc.cubierta && inc.codigo !== 'NO_TUR') {
        tieneIncidencia = true;
      }
    });

    if (tieneIncidencia) {
      mapa[user].diasConIncidencias += 1;
    }
  });

  console.log('Usuarios agrupados:', mapa);
  return Object.values(mapa);
}


  public Object = Object;
}
