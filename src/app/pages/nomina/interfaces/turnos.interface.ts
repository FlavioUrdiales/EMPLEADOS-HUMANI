
export interface Turno {
    id?: number;
    chr_clave_usuario: string;
    dia_semana: string;
    entrada: string;
    salida: string;
    comida_inicio: string;
    comida_fin: string;
    observaciones: string;
}

export interface TurnoResponse {
    response: boolean;
    message: string;
    data: Turno;
}

export interface TurnosResponse {
    response: boolean;
    message: string;
    data: Turno[];
}

export interface TurnoInsertResponse {
    response: boolean;
    message: string;
    insertedId: number;
}

