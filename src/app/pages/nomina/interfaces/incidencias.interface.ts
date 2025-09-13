// modelo.ts
export interface Incidencia {
  codigo: string;
  descripcion: string;
  cubierta?: boolean; // opcional
}

export interface RegistroAsistencia {
  clave_usuario: string;
  usuario: string;
  fecha: string;
  primer_entrada: string | null;
  salida_comida: string | null;
  regreso_comida: string | null;
  salida_final: string | null;
  entrada_esperada: string | null;
  salida_esperada: string | null;
  incidencias: Incidencia[];
}
