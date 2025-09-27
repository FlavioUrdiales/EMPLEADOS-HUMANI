import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Retencion {
  tipo: string;
  monto: number;
  observacion?: string;
}

@Component({
  selector: 'app-nomina-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, InputTextModule, SelectModule, TableModule, FormsModule, Tooltip, ToastModule],
  providers: [MessageService],
  templateUrl: './nomina-dialog.component.html',
  styleUrls: ['./nomina-dialog.component.scss']
})
export class NominaDialogComponent {
  @Input() visible: boolean = false;
  @Input() nominas: any[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() guardar = new EventEmitter<any[]>();
  @Output() finalizar = new EventEmitter<any[]>();

  selectedNomina: any = null;
  viewMode: 'individual' | 'todos' = 'todos';

  tiposRetencion = ['ISR','IMSS','Infonavit','Afore','Fonacot','Préstamo','Multa','Otro'];

  constructor(private messageService: MessageService) {}

  ngOnChanges() {
    if (this.nominas?.length && !this.selectedNomina) {
      this.selectedNomina = { ...this.nominas[0] };
    }
  }

  cerrarDialog() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }

  esFiscales(tipo: string): boolean {
    const fiscales = ['ISR','IMSS','Infonavit','Afore'];
    return fiscales.includes(tipo);
  }

 // Calcula neto fiscal considerando cargos y retenciones fiscales
calcularFiscal(nomina: any): number {
  const totalFiscal = parseFloat(nomina.total_sueldo_fiscal) || 0;
  const cargosF = parseFloat(nomina.cargos_fiscal) || 0;

  let retencionesF = (nomina.retenciones || [])
    .filter((r: Retencion) => this.esFiscales(r.tipo)) // solo fiscales
    .reduce((sum: number, r: Retencion) => sum + (parseFloat(r.monto as any) || 0), 0);

  if (retencionesF > totalFiscal - cargosF) {
    retencionesF = totalFiscal - cargosF;
    this.messageService.add({
      severity: 'warn',
      summary: 'Retención fiscal limitada',
      detail: `La retención fiscal de ${nomina.nombre_empleado} fue limitada al disponible.`
    });
  }

  return totalFiscal - cargosF - retencionesF;
}

// Calcula neto no fiscal considerando cargos, retenciones no fiscales y sobrante de las fiscales
calcularNoFiscal(nomina: any): number {
  const totalNoFiscal = parseFloat(nomina.total_sueldo_no_fiscal) || 0;
  const bonos = parseFloat(nomina.bonos) || 0;
  const cargosNF = parseFloat(nomina.cargos_no_fiscal) || 0;

  // Retenciones no fiscales (Préstamo, Multa, Otro, etc.)
  let retencionesNoFiscales = (nomina.retenciones || [])
    .filter((r: Retencion) => !this.esFiscales(r.tipo))
    .reduce((sum: number, r: Retencion) => sum + (parseFloat(r.monto as any) || 0), 0);

  // Retenciones fiscales totales (para calcular excedente)
  const retencionesFiscalesTotales = (nomina.retenciones || [])
    .filter((r: Retencion) => this.esFiscales(r.tipo))
    .reduce((sum: number, r: Retencion) => sum + (parseFloat(r.monto as any) || 0), 0);

  const fiscalDisponible = parseFloat(nomina.total_sueldo_fiscal) - (parseFloat(nomina.cargos_fiscal)||0);
  let excedente = retencionesFiscalesTotales - fiscalDisponible;
  if (excedente < 0) excedente = 0;

  let retencionesNF = retencionesNoFiscales + excedente;

  if (retencionesNF > totalNoFiscal + bonos - cargosNF) {
    retencionesNF = totalNoFiscal + bonos - cargosNF;
    this.messageService.add({
      severity: 'warn',
      summary: 'Retención no fiscal limitada',
      detail: `La retención excede el total no fiscal de ${nomina.nombre_empleado}, se ajustó al disponible.`
    });
  }

  return totalNoFiscal + bonos - cargosNF - retencionesNF;
}


  calcularTotalNeto(nomina: any): number {
    return this.calcularFiscal(nomina) + this.calcularNoFiscal(nomina);
  }

  guardarCambios() {
    this.nominas.forEach(n => n.total_neto = this.calcularTotalNeto(n));
    this.guardar.emit(this.nominas);
  }

  finalizarNomina() {
    this.nominas.forEach(n => {
      n.total_neto = this.calcularTotalNeto(n);
      n.estatus = 'Finalizada';
    });
    this.finalizar.emit(this.nominas);
    this.cerrarDialog();
  }

  total(field: string) {
    return this.nominas.reduce((sum, n) => sum + (parseFloat(n[field]) || 0), 0);
  }

  totalNetoTodos() {
    return this.nominas.reduce((sum, n) => sum + this.calcularTotalNeto(n), 0);
  }

  agregarRetencion(nomina: any) {
    if (!nomina.retenciones) nomina.retenciones = [];
    nomina.retenciones.push({ tipo: 'Otro', monto: 0, observacion: '' });
  }

  eliminarRetencion(nomina: any, index: number) {
    if (nomina.retenciones && nomina.retenciones.length > index) {
      nomina.retenciones.splice(index, 1);
    }
  }

  retencionesTotales(nomina?: any): number {
    if (nomina) {
      return (nomina.retenciones || []).reduce((sum: number, r: Retencion) => sum + (parseFloat(r.monto as any) || 0), 0);
    }
    return this.nominas.reduce((sum, row) => {
      const totalRet = (row.retenciones || []).reduce((s: number, r: Retencion) => s + (parseFloat(r.monto as any) || 0), 0);
      return sum + totalRet;
    }, 0);
  }

  get totalFiscalTodos(): number {
    return this.nominas.reduce((sum, n) => sum + this.calcularFiscal(n), 0);
  }

  get totalNoFiscalTodos(): number {
    return this.nominas.reduce((sum, n) => sum + this.calcularNoFiscal(n), 0);
  }
}
