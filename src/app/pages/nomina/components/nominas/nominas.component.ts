import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { NominaService } from '../../services/nomina.service';
import { DetalleNominaResponse, NominaDetalle, NominaResumen, NominasResponse, ObtenerNominasPorPeriodo } from '../../interfaces/nominas';
import { ToastService } from '../../../../shared/services/toastService.service';
import { NominaDialogComponent } from '../nomina-dialog/nomina-dialog.component';

type SeverityType = 'warn' | 'success' | 'danger' | 'info' | 'secondary' | 'contrast';

@Component({
  selector: 'app-nominas',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, TooltipModule,NominaDialogComponent],
  templateUrl: './nominas.component.html',
  styleUrls: ['./nominas.component.scss']
})
export class NominasComponent implements OnInit {
  private nominaService: NominaService = inject(NominaService);
  private toastService : ToastService = inject(ToastService);
  public showNominaDialog: boolean = false;
  public nominaSeleccionada: NominaDetalle[] = [];

  @ViewChild('dt') dt!: Table;
  public lstNominas: NominaResumen[] = [];

  public ngOnInit(): void {
    this.loadNominas();
  }

  public loadNominas(): void {
    this.nominaService.getNominas().subscribe({
      next: (res: NominasResponse) => {
        this.lstNominas = res.data;
      },
      error: () => {
        this.toastService.error('Error al cargar las nóminas');
      }
    });
  }

public getEstatusTag(estatus: string): { value: string; severity: SeverityType } {
  switch (estatus.toUpperCase()) {
    case 'PENDIENTE':
      return { value: 'Pendiente', severity: 'warn' };
    case 'PROCESADA':
      return { value: 'Procesada', severity: 'success' };
    case 'CANCELADA':
      return { value: 'Cancelada', severity: 'danger' };
    default:
      return { value: estatus, severity: 'info' };
  }
}


 public verDetalles(nomina: NominaResumen) : void {
    let data : ObtenerNominasPorPeriodo = {
      mes: nomina.mes,
      anio: nomina.anio,
      quincena: nomina.quincena
    };
    this.nominaService.getNominaDetalle(data).subscribe({
      next: (res: DetalleNominaResponse) => {
        this.nominaSeleccionada = res.data;
        this.showNominaDialog = true;
      },
      error: () => {
        this.toastService.error('Error al obtener los detalles de la nómina');
      }
    });
  }

  public getRangoFechas(nomina: NominaResumen): string {
  const { mes, anio, quincena } = nomina;
  const primerDia = quincena === 1 ? 1 : 16;
  const ultimoDia =
    quincena === 1
      ? 15
      : new Date(anio, mes, 0).getDate(); // Último día del mes

  const formato = (d: number) => d.toString().padStart(2, '0');
  const mesStr = mes.toString().padStart(2, '0');

  return `${formato(primerDia)}/${mesStr}/${anio} - ${formato(ultimoDia)}/${mesStr}/${anio}`;
}

}
