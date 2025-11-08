export interface Quincena {
  id?: number;
  empleado_codigo: string;
  chrClave: string;
  quincena: number;
  sueldo_diario_real: number;
  sueldo_diario_fiscal: number;
  sueldo_diario_no_fiscal: number;
  isr_diario: number;
  imss_diario: number;
  tope_sin_bonos: number;
}

// Base genérica para respuestas
interface BaseResponse<T> {
  response: string;
  message: string;
  data: T;
}

// Respuesta de un solo registro
export interface QuincenaResponse extends BaseResponse<Quincena> {}

// Respuesta de múltiples registros
export interface QuincenasResponse extends BaseResponse<Quincena[]> {}

// Respuesta al insertar o actualizar
export interface QuincenaInsertResponse extends BaseResponse<{ id: number }> {}
export interface QuincenaUpdateResponse extends BaseResponse<{ id: number }> {}
