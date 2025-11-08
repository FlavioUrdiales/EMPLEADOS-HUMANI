export interface DetalleIncidencia {
    fecha: string;
    descripcion: string;
    cubierta?: boolean;
}

export interface UsuarioResumen {
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

export interface NominaResumen {
    mes: number;
    anio: number;
    quincena: number;
    estatus: string;
}

export interface NominasResponse {
    response: boolean;
    message: string;
    data: NominaResumen[];
}


export interface ObtenerNominasPorPeriodo {
    mes: number;
    anio: number;
    quincena: number;
}

export interface DetalleNominaResponse {
    response: boolean;
    message: string;
    data: NominaDetalle[];
}

export interface Retencion {
  tipo: string | null;
  monto: number | null;
  observacion?: string | null;
}

export interface NominaDetalle {
  id: number;
  chrClave: string;
    quincena: number;
    mes: number;
    anio: number;
    dias_trabajados: string;
    dias_descontados: string;
    sueldo_diario_real: string;
    sueldo_diario_fiscal: string;
    sueldo_diario_no_fiscal: string;
    total_sueldo_real: string;
    total_sueldo_fiscal: string;
    total_sueldo_no_fiscal: string;
    total_isr: string;
    total_imss: string;
    bonos: string;
    cargos_fiscal: string;
    cargos_no_fiscal: string;
    total_neto: string;
    estatus: string;
    fecha_creacion: string;
    incidencias: string;
    chrNombre: string;
    chrPaterno: string;
    chrMaterno: string;
    retenciones: Retencion[];
    nombre_empleado: string;
    incidencias_aplicadas: any[];
}
