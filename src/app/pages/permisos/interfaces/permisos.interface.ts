export interface Permisos {
    id?: number;
    user_id?: number;
    nombre_colaborador: string;
    departamento?: string;
    correo_electronico: string;
    correo_jefe: string;
    fecha_inicio?: Date;
    fecha_fin?: Date;
    motivo_permiso: string;
    tipo_permiso: string;
    estado?: string;
    creado_en?: Date;
    actualizado_en?: Date;
    rangoFechas?: Date[];
    diasIndividuales?: Date[];
    [key: string]: any; // Para propiedades adicionales
}

export interface PermisosResponse {
    success: string;
    message: string;
    data: Permisos[];
}

export interface TipoPermiso {
    id: number;
    label: string;
    value: string;
    creado_en: Date;
    actualizado_en: Date;
}

export interface CorreoJefe {
    id: number;
    correo: string;
    creado_en: Date;
    actualizado_en: Date;
}
