import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { environment } from '../../../../../environments/environment';
(pdfMake as any).vfs = (pdfFonts as any).vfs;
export interface ReciboNominaRaw {
    id: number;
    chrClave: string;
    nombre_empleado: string;
    quincena: number;
    mes: number;
    anio: number;
    total_sueldo_real: string;
    total_sueldo_fiscal: string;
    total_sueldo_no_fiscal: string;
    total_neto: string;
    retenciones: Array<{ tipo: string, monto: number, observacion: string }>;
}
@Injectable({ providedIn: 'root' })
export class ReciboNominaService {
    // ================== GENERAR PDF ==================
    private generarDoc(data: ReciboNominaRaw) {
        const totalIngresos = parseFloat(data.total_sueldo_no_fiscal || '0').toFixed(2);
        const totalNeto = parseFloat(data.total_sueldo_no_fiscal || '0').toFixed(2);

        const docDefinition: any = {
            pageOrientation: 'portrait',
            pageMargins: [40, 40, 40, 40],
            content: [
                // ===== ENCABEZADO SUPERIOR =====
                {
                    columns: [
                        {
                            width: '*',
                            text: environment.NOMBRE_EMPRESA,
                            fontSize: 8,
                            bold: true,
                            alignment: 'left',
                            margin: [0, 0, 0, 0]
                        },
                        {
                            width: 'auto',
                            columns: [
                                {
                                    text: 'NO.',
                                    fontSize: 8,
                                    margin: [0, 2, 5, 0]
                                },
                                {
                                    table: {
                                        widths: [60],
                                        body: [
                                            [
                                                {
                                                    text: data.id.toString(),
                                                    alignment: 'right',
                                                    fontSize: 8
                                                }
                                            ]
                                        ]
                                    },
                                    layout: {
                                        hLineWidth: () => 1,
                                        vLineWidth: () => 1
                                    }
                                }
                            ],
                            alignment: 'right'
                        }
                    ],
                    margin: [0, 0, 0, 15]
                },
                // ===== TABLA PRINCIPAL: NOMBRE / PERIODO / INGRESOS / EGRESOS =====
                {
                    table: {
                        widths: [80, 260, '*'],
                        body: [
                            // Fila 1: NOMBRE / PERIODO
                            [
                                { text: 'NOMBRE:', bold: true, fontSize: 8 },
                                { text: data.nombre_empleado, fontSize: 8 },
                                {
                                    text: `PERIODO: ${this.getRangoFechas(data)}`,
                                    fontSize: 8
                                }
                            ],
                            // Fila 2: ENCABEZADOS INGRESOS / EGRESOS
                            [
                                {
                                    text: 'INGRESOS',
                                    colSpan: 2,
                                    alignment: 'center',
                                    bold: true,
                                    fontSize: 8,
                                    fillColor: '#E0E0E0'
                                },
                                {},
                                {
                                    text: 'EGRESOS',
                                    alignment: 'center',
                                    bold: true,
                                    fontSize: 8,
                                    fillColor: '#E0E0E0'
                                }
                            ],
                            // Fila 3: HONORARIOS
                            [
                                { text: 'HONORARIOS', fontSize: 8 },
                                {
                                    text: `$ ${totalIngresos}`,
                                    fontSize: 8,
                                    alignment: 'center',
                                    fillColor: '#E0E0E0'
                                },
                                { text: '', fontSize: 9 }
                            ],
                            // Fila 4: TOTAL (dentro de la tabla grande)
                            [
                                { text: 'Total', bold: true, fontSize: 8 },
                                { text: '', fontSize: 8 },
                                { text: '', fontSize: 8 }
                            ]
                        ]
                    },
                    layout: {
                        hLineWidth: () => 1,
                        vLineWidth: () => 1
                    },
                    margin: [0, 0, 0, 10]
                },
                // ===== TOTAL NETO (TABLA SEPARADA, SUBRAYADA) =====
                {
                    table: {
                        widths: [150, 20, 80],
                        body: [
                            [
                                {
                                    text: 'Total neto',
                                    bold: true,
                                    fontSize: 8,
                                    alignment: 'center',
                                    decoration: 'underline'
                                },
                                {
                                    text: '$',
                                    fontSize: 8,
                                    alignment: 'center',
                                    decoration: 'underline'
                                },
                                {
                                    text: totalNeto,
                                    fontSize: 8,
                                    alignment: 'center',
                                    decoration: 'underline'
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders',
                    margin: [180, 0, 0, 20] // mueve la tablita al centro como en el ejemplo
                },
                // ===== TEXTO DEL RECIBO (DOS RENGLONES) =====
                {
                    columns: [
                        {
                            width: 'auto',
                            text: 'RECIBO LA CANTIDAD DE:',
                            fontSize: 8
                        },
                        {
                            width: 'auto',
                            text: `${this.numeroALetras(parseFloat(totalNeto))} 00/100`,
                            bold: true,
                            fontSize: 8,
                            margin: [5, 0, 0, 0]
                        },
                        { width: '*', text: '' }
                    ],
                    margin: [0, 0, 0, 2]
                },
                {
                    text: 'PESOS. POR LA PRESTACIÓN DE SERVICIOS PROFESIONALES PARA IMPARTICION DE CLASES',
                    fontSize: 8,
                    margin: [0, 0, 0, 40]
                },
                // ===== FIRMA =====
                {
                    columns: [
                        { width: '*', text: '' },
                        {
                            width: 300,
                            stack: [
                                {
                                    canvas: [
                                        { type: 'line', x1: 0, y1: 0, x2: 300, y2: 0, lineWidth: 1 }
                                    ],
                                    margin: [0, 0, 0, 2]
                                },
                                {
                                    text: data.nombre_empleado,
                                    bold: true,
                                    alignment: 'center',
                                    fontSize: 8
                                },
                                {
                                    text: 'FIRMA DE RECIBIDO',
                                    alignment: 'center',
                                    fontSize: 8
                                }
                            ]
                        },
                        { width: '*', text: '' }
                    ]
                }
            ]
        };
        return pdfMake.createPdf(docDefinition);
    }
    // ================== GENERAR MULTIPLES ==================
    generarMultiplesRecibos(arreglo: ReciboNominaRaw[], abrir: boolean = true) {
        arreglo.forEach((recibo) => {
            const pdf: any = this.generarDoc(recibo);
            if (abrir) pdf.open();
            else pdf.download(`recibo_${recibo.id}.pdf`);
        });
    }
    // ================== NUMERO A LETRAS ==================
    private numeroALetras(valor: number): string {
        const unidades = ['CERO', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
        const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
        const especiales = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISÉIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
        const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

        const convertirCentenas = (num: number): string => {
            if (num === 100) return 'CIEN';
            const c = Math.floor(num / 100);
            const d = Math.floor((num % 100) / 10);
            const u = num % 10;
            let texto = c > 0 ? centenas[c] + ' ' : '';
            if (d === 1) texto += especiales[u];
            else {
                if (d > 1) texto += decenas[d];
                if (d > 1 && u > 0) texto += ' Y ';
                if (u > 0 && d !== 1) texto += unidades[u];
            }
            return texto.trim();
        }

        if (valor === 0) return 'CERO';

        const entero = Math.floor(valor);
        const miles = Math.floor(entero / 1000);
        const resto = entero % 1000;
        let textoFinal = '';

        if (miles > 0) textoFinal += miles === 1 ? 'MIL ' : `${convertirCentenas(miles)} MIL `;
        if (resto > 0) textoFinal += convertirCentenas(resto);

        const decimales = Math.round((valor - entero) * 100);
        if (decimales > 0) textoFinal += ` CON ${decimales}/100`;

        return textoFinal.trim();
    }

    
    // ================== PERIODO ==================
    public getRangoFechas(nomina: ReciboNominaRaw): string {
        const { mes, anio, quincena } = nomina;
        const primerDia = quincena === 1 ? 1 : 16;
        const ultimoDia = quincena === 1 ? 15 : new Date(anio, mes, 0).getDate();
        const nombreMes = new Date(anio, mes - 1)
            .toLocaleString('es-MX', { month: 'long' });
        return `DEL ${primerDia} AL ${ultimoDia} DE ${nombreMes.toUpperCase()} DE ${anio}`;
    }
}