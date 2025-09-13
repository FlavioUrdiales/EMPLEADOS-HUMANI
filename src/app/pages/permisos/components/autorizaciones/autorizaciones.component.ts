import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { PopoverModule } from 'primeng/popover';

import { ConfirmationService, MessageService } from 'primeng/api';

import { Permisos } from '../../interfaces/permisos.interface';
import { PermisosService } from '../../services/permisos.service';
import { ToastService } from '../../../../shared/services/toastService.service';
import { FiltroEstadoPipe } from '../../../../shared/pipes/filtro-estado.pipe';

@Component({
  selector: 'app-autorizaciones',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    DropdownModule,
    AvatarModule,
    ChipModule,
    PopoverModule,
    FiltroEstadoPipe
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './autorizaciones.component.html',
  styleUrls: ['./autorizaciones.component.scss']
})
export class AutorizacionesComponent implements OnInit {
  public lstPermisos: Permisos[] = [];
  public estadoSeleccionado: string | null = null;
  public estados = [
    { label: 'Todos', value: null },
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Autorizado', value: 'autorizado' },
    { label: 'Rechazado', value: 'rechazado' }
  ];

  private permisosService = inject(PermisosService);
  private toastService = inject(ToastService);
  private confirmService = inject(ConfirmationService);

  ngOnInit(): void {
    this.cargarPermisos();
  }

  cargarPermisos(): void {
    this.permisosService.getAll().subscribe({
      next: (response) => {
        this.lstPermisos = response.data;
      }
    });
  }

  confirmarAccion(tipo: 'autorizar' | 'rechazar', permiso: Permisos): void {
    console.log(permiso);
    this.confirmService.confirm({
      header: 'Confirmación',
      message: `¿Deseas ${tipo} este permiso?`,
      icon: tipo === 'autorizar' ? 'pi pi-check' : 'pi pi-times',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        tipo === 'autorizar'
          ? this.autorizarPermiso(permiso)
          : this.rechazarPermiso(permiso);
      }
    });
  }

  autorizarPermiso(permiso: Permisos): void {
    this.permisosService.updateStatus(permiso.id!, 'Autorizado').subscribe({
      next: (res) => {
          permiso.estado = 'Autorizado';
          this.toastService.success('Permiso autorizado correctamente');
          this.cargarPermisos();
      },
      error: (err) => this.toastService.error('Error al autorizar: ' + err.message)
    });
  }

  rechazarPermiso(permiso: Permisos): void {
    this.permisosService.updateStatus(permiso.id!, 'Rechazado').subscribe({
      next: (res) => {
          permiso.estado = 'Rechazado';
          this.toastService.info('Permiso rechazado');
          this.cargarPermisos();
      },
      error: (err) => this.toastService.error('Error al rechazar: ' + err.message)
    });
  }
}
