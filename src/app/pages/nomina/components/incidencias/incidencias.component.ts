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
import { PopoverModule } from 'primeng/popover';

import { NominaService } from '../../services/nomina.service';
import { RegistroAsistencia } from '../../interfaces/incidencias.interface';
import { NominaDialogComponent } from '../nomina-dialog/nomina-dialog.component';
import { ToastService } from '../../../../shared/services/toastService.service';

interface DetalleIncidencia {
  fecha: string;
  descripcion: string;
  cubierta?: boolean;
}

interface UsuarioResumen {
  clave_usuario: string;
  usuario: string;
  diasConTurno: number;
  diasTrabajados: number;
  diasConIncidencias: number;
  totalIncidencias: number;
  incidencias: Record<
    string,
    {
      count: number;
      descripcion: string;
      cubierta?: boolean;
      detalles?: DetalleIncidencia[];
    }
  >;
  permisos: { count: number; detalles: string[] };
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
    TooltipModule,
    PopoverModule,
    NominaDialogComponent
  ],
  templateUrl: './incidencias.component.html',
  providers: [ConfirmationService, MessageService],
  styleUrls: ['./incidencias.component.scss']
})
export class IncidenciasComponent implements OnInit {
  private nominaService: NominaService = inject(NominaService);
  public showNominaDialog: boolean = false;
  public nominaSeleccionada: any = null;
  public toastService: ToastService = inject(ToastService);
  public registrosAsistencia: RegistroAsistencia[] = [];
  public rangoFechas: Date[] = [];
  public resumenNomina: UsuarioResumen[] = [];
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
    faltar: ['FAL_ENT', 'FAL_SAL'],
    llegar_tarde: ['RET_ENT'],
    salir_temprano: ['SAL_ANT'],
    no_entrada: ['FAL_ENT'],
    no_salida: ['FAL_SAL'],
    comida: ['NO_CH_COM', 'RET_SAL_COM', 'RET_REG_COM']
  };

  ngOnInit(): void {
    this.setQuincenaAnterior();
  }

  setQuincenaAnterior(): void {
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth();

    let fechaInicio: Date;
    let fechaFin: Date;

    if (hoy.getDate() <= 15) {
      // Si estamos en la primera quincena → regresar a la segunda del mes anterior
      const mesAnterior = month - 1;
      const ultimoDiaMesAnterior = new Date(year, month, 0); // último día del mes anterior
      fechaInicio = new Date(year, mesAnterior, 16);
      fechaFin = ultimoDiaMesAnterior;
    } else {
      // Si estamos en la segunda quincena → regresar a la primera del mismo mes
      fechaInicio = new Date(year, month, 1);
      fechaFin = new Date(year, month, 15);
    }

    this.rangoFechas = [fechaInicio, fechaFin];
    this.buscarIncidencias();
  }


  get isQuincenaAnterior(): boolean {
    //validar si es la quincena anterior para saber si se puede generar la nomina quincenal
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = hoy.getMonth();
    const dia = hoy.getDate();

    let fechaInicio: Date;
    let fechaFin: Date;
    if (dia <= 15) {
      // Si estamos en la primera quincena → regresar a la segunda del mes anterior
      const mesAnterior = month - 1;
      const ultimoDiaMesAnterior = new Date(year, month, 0); // último día del mes anterior
      fechaInicio = new Date(year, mesAnterior, 16);
      fechaFin = ultimoDiaMesAnterior;
    }
    else {
      // Si estamos en la segunda quincena → regresar a la primera del mismo mes
      fechaInicio = new Date(year, month, 1);
      fechaFin = new Date(year, month, 15);
    }
    return (this.rangoFechas[0].getTime() === fechaInicio.getTime() &&
      this.rangoFechas[1].getTime() === fechaFin.getTime());
  }


  buscarIncidencias(): void {
    if (
      !this.rangoFechas ||
      this.rangoFechas.length < 2 ||
      !this.rangoFechas[0] ||
      !this.rangoFechas[1]
    ) {
      console.warn('Rango de fechas incompleto');
      return;
    }

    const fechaInicioStr = this.rangoFechas[0].toISOString().split('T')[0];
    const fechaFinStr = this.rangoFechas[1].toISOString().split('T')[0];

    this.nominaService.getReporteAdministrativos(fechaInicioStr, fechaFinStr).subscribe({
      next: (data) => {
        console.log('Data recibida:', data);
        this.registrosAsistencia = data.map((reg) => ({
          ...reg,
          incidencias: this.normalizarIncidencias(reg) ?? []
        }));
        this.resumenNomina = this.getResumenNomina();
      },
      error: (err) => console.error('Error al obtener registros:', err)
    });
  }

  onRangoFechasChange(event: any) {
    this.buscarIncidencias();
  }

  private normalizarIncidencias(
    registro: RegistroAsistencia
  ): { descripcion: string; codigo: string; cubierta?: boolean; fecha: string }[] {
    const incidencias: { descripcion: string; codigo: string; cubierta?: boolean; fecha: string }[] =
      [];
    let permisos: any[] = [];

    (registro.incidencias ?? []).forEach((inc) => {
      if (inc.codigo === 'PERM') {
        permisos.push(inc);
      } else if (inc.codigo !== 'NO_TUR') {
        const codigoNormalizado = this.codigosIncidencias[inc.descripcion] || inc.codigo;
        incidencias.push({
          descripcion: inc.descripcion,
          codigo: codigoNormalizado,
          cubierta: false,
          fecha: registro.fecha
        });
      }
    });

    permisos.forEach((perm) => {
      const tipo = this.extraerTipoPermiso(perm.descripcion);
      if (tipo) {
        incidencias.forEach((inc) => {
          if (this.permisoCubreIncidencia(tipo, inc.codigo)) {
            inc.cubierta = true;
          }
        });
      }

      incidencias.push({
        descripcion: perm.descripcion,
        codigo: 'PERM',
        cubierta: false,
        fecha: registro.fecha
      });
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

  getResumenNomina(): UsuarioResumen[] {
    const mapa: Record<string, UsuarioResumen> = {};
    const codigos = Object.values(this.codigosIncidencias);

    this.registrosAsistencia.forEach((r) => {
      const user = r.usuario;
      if (!mapa[user]) {
        const incidenciasInit: Record<
          string,
          { count: number; descripcion: string; cubierta?: boolean; detalles?: DetalleIncidencia[] }
        > = {};
        codigos.forEach(
          (c) =>
          (incidenciasInit[c] = {
            count: 0,
            descripcion: this.obtenerDescripcionPorCodigo(c),
            cubierta: false,
            detalles: []
          })
        );

        mapa[user] = {
          usuario: user,
          clave_usuario: r.clave_usuario,
          diasConTurno: 0,
          diasTrabajados: 0,
          diasConIncidencias: 0,
          totalIncidencias: 0,
          incidencias: incidenciasInit,
          permisos: { count: 0, detalles: [] }
        };
      }

      // Contar días con turno
      const tieneTurno = r.entrada_esperada !== null && r.entrada_esperada !== undefined;
      if (tieneTurno) {
        mapa[user].diasConTurno += 1;
      }

      // Verificar si trabajó
      // Verificar si trabajó o tiene permisos que cubren faltas
      const diaTrabajado =
        r.primer_entrada !== null || r.salida_final !== null ||
        // Comprobar si hay incidencias cubiertas de faltas de entrada/salida
        this.normalizarIncidencias(r).some(
          inc =>
            inc.cubierta &&
            (this.reglasPermisos['no_entrada'].includes(inc.codigo) ||
              this.reglasPermisos['no_salida'].includes(inc.codigo))
        );

      if (diaTrabajado) {
        mapa[user].diasTrabajados += 1;
      }


      let tieneIncidenciaNoCubierta = false;
      let tienePermiso = false;
      let permisoDetalle = '';

      const incidenciasNormalizadas = this.normalizarIncidencias(r);

      incidenciasNormalizadas.forEach((inc) => {
        if (inc.codigo === 'PERM') {
          tienePermiso = true;
          mapa[user].permisos.count += 1;
          permisoDetalle = inc.descripcion;
        } else if (inc.codigo !== 'NO_TUR') {
          mapa[user].incidencias[inc.codigo].count += 1;
          mapa[user].totalIncidencias += 1;

          if (inc.cubierta) {
            mapa[user].incidencias[inc.codigo].cubierta = true;
          }

          // Guardar detalle
          mapa[user].incidencias[inc.codigo].detalles?.push({
            fecha: inc.fecha,
            descripcion: inc.descripcion,
            cubierta: inc.cubierta
          });

          if (!inc.cubierta) {
            tieneIncidenciaNoCubierta = true;
          }
        }
      });

      if (tienePermiso && permisoDetalle) {
        mapa[user].permisos.detalles.push(`${r.fecha}: ${permisoDetalle}`);
      }

      if (tieneIncidenciaNoCubierta) {
        mapa[user].diasConIncidencias += 1;
      }
    });

    console.log('Resumen nómina:', mapa);
    return Object.values(mapa);
  }

  public obtenerDescripcionPorCodigo(codigo: string): string {
    for (const [desc, cod] of Object.entries(this.codigosIncidencias)) {
      if (cod === codigo) {
        return desc;
      }
    }
    return codigo;
  }

  public Object = Object;

  getTotalDiasConTurno(): number {
    return this.resumenNomina.reduce((total, usuario) => total + usuario.diasConTurno, 0);
  }

  getTotalDiasTrabajados(): number {
    return this.resumenNomina.reduce((total, usuario) => total + usuario.diasTrabajados, 0);
  }

  getTotalDiasConIncidencias(): number {
    return this.resumenNomina.reduce((total, usuario) => total + usuario.diasConIncidencias, 0);
  }

  getTotalPermisos(): number {
    return this.resumenNomina.reduce((total, usuario) => total + usuario.permisos.count, 0);
  }

  getColspan(): number {
    const columnasFijas = 6;
    const codigosIncidencias = Object.values(this.codigosIncidencias);
    const columnasIncidencias = codigosIncidencias.filter(
      (codigo) => codigo !== 'NO_TUR' && codigo !== 'PERM'
    ).length;
    return columnasFijas + columnasIncidencias;
  }

  // Devuelve un resumen para mostrar como tooltip en badge de permisos
  getResumenPermisos(detalles: string[]): string {
    return detalles.length
      ? detalles.map(d => `• ${d}`).join('\n')
      : 'Sin permisos';
  }

  // Devuelve un resumen para mostrar como tooltip en badge de incidencias
  getResumenIncidencias(detalles: any[]): string {
    if (!detalles || detalles.length === 0) return 'Sin incidencias';
    const cubiertas = detalles.filter(d => d.cubierta).length;
    const noCubiertas = detalles.filter(d => !d.cubierta).length;
    return `Total: ${detalles.length}\nCubiertas: ${cubiertas}\nNo cubiertas: ${noCubiertas}`;
  }
  getColorIncidencia(detalles: any[]): string {
    if (!detalles || detalles.length === 0) return 'bg-gray-50 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-600';
    const todasCubiertas = detalles.every(d => d.cubierta);
    const todasNoCubiertas = detalles.every(d => !d.cubierta);

    if (todasCubiertas) return 'bg-green-50 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700';
    if (todasNoCubiertas) return 'bg-red-50 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700';
    return 'bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-700';
  }
  // Devuelve true si alguna incidencia está cubierta
  isCubierta(detalles: any[]): boolean {
    return detalles?.some(d => d.cubierta) ?? false;
  }

  // Devuelve true si alguna incidencia NO está cubierta
  isNoCubierta(detalles: any[]): boolean {
    return detalles?.some(d => !d.cubierta) ?? false;
  }
  // Devuelve el número de incidencias cubiertas
  getCountCubiertas(detalles: any[]): number {
    return detalles?.filter(d => d.cubierta).length ?? 0;
  }

  // Devuelve el número de incidencias no cubiertas
  getCountNoCubiertas(detalles: any[]): number {
    return detalles?.filter(d => !d.cubierta).length ?? 0;
  }

  // Generar nómina quincenal
  public generarNominaQuincenal() {
    let mes = this.rangoFechas[0].getMonth() + 1;
    let anio = this.rangoFechas[0].getFullYear();
    let diasTrabajadosPorEmpleado: Record<string, number> = this.resumenNomina.reduce((acc: { [key: string]: number }, usuario) => {
      acc[usuario.clave_usuario] = usuario.diasConTurno;
      return acc;
    }, {} as { [key: string]: number });

    let incidenciasPorEmpleado: Record<string, any[]> = this.resumenNomina.reduce((acc: { [key: string]: any[] }, usuario) => {
      acc[usuario.clave_usuario] = Object.entries(usuario.incidencias).map(([codigo, info]) => ({
        codigo,
        descripcion: info.descripcion,
        count: info.count,
        cubierta: info.cubierta,
        detalles: info.detalles
      }));
      return acc;
    }, {} as { [key: string]: any[] });

    let bonosPorEmpleado: Record<string, any[]> = {};
    let cargosPorEmpleado: Record<string, any[]> = {};
    let retencionesPorEmpleado: Record<string, any[]> = {};
    let rangoFechas = this.rangoFechas.map(d => d.toISOString().split('T')[0]);
    this.nominaService.generarNominaQuincenal(mes, anio, diasTrabajadosPorEmpleado, incidenciasPorEmpleado, rangoFechas, bonosPorEmpleado, cargosPorEmpleado, retencionesPorEmpleado).subscribe({

      next: (data) => {
        this.showNominaDialog = true;
        this.nominaSeleccionada = data.data;

        console.log('Nómina generada:', data);
      },
      error: (err) => console.error('Error al generar nómina:', err)
    });
  }

  onGuardar(nomina: any) {
   console.log('Guardar nómina:', nomina);
   this.nominaService.guardarNomina(nomina).subscribe({
     next: (data) => {
        this.toastService.success('Nómina guardada correctamente');
        this.showNominaDialog = false;
      },
      error: (err) => console.error('Error al guardar nómina:', err)
    });

  }
  onFinalizar(nomina: any) {
    //primero guardamos los cambios
    this.nominaService.guardarNomina(nomina).subscribe({
      next: (data) => {
        console.log('Nómina guardada antes de finalizar:', data);
        this.finalizarNominaAPI(nomina);
      }
      ,
      error: (err) => console.error('Error al guardar nómina antes de finalizar:', err)
    });
  }

  finalizarNominaAPI(nomina: any) {
    this.nominaService.finalizarNomina(nomina[0].mes, nomina[0].anio, nomina[0].quincena).subscribe({
      next: (data) => {
        this.toastService.success('Nómina finalizada correctamente');
        this.showNominaDialog = false;
      },
      error: (err) => console.error('Error al finalizar nómina:', err)
    });

  }

}
