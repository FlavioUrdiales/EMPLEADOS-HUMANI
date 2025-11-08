export interface BaseResponse<T> {
  response: string;
  message: string;
  data: T;
}

export interface DiaFeriado {
  id?: number;
  fecha: string; // Formato YYYY-MM-DD
  nombre: string;
  tipo: 'OFICIAL' | 'ADICIONAL';
  anio: number;
}

// Respuestas específicas usando extends de BaseResponse
export interface DiasFeriadosResponse extends BaseResponse<DiaFeriado[]> {}
export interface DiaFeriadoResponse extends BaseResponse<DiaFeriado> {}
export interface DiaFeriadoInsertResponse extends BaseResponse<{ id: number }> {}
export interface DiaFeriadoUpdateResponse extends BaseResponse<{ id: number }> {}
export interface DiaFeriadoDeleteResponse extends BaseResponse<{ id: number }> {}