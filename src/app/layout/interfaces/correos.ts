export interface CorreosRequest {
    data: Correos;
}

export interface Correos {
    correo: string;
    asunto: string;
    body: string;
    response: responseDatos;
    textButton: string;
    url: string;
    anexos?: File[] | string[];
  }
  
export interface responseDatos {
    chrNombre: string;
    chrPaterno: string;
    chrMaterno: string;
}
