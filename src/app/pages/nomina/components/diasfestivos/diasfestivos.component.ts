import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DiasfestivosService } from '../../services/diasfestivos.service';
import { DiaFeriado } from '../../interfaces/diasferiados.interface';

@Component({
  selector: 'app-diasfestivos',
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
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './diasfestivos.component.html',
  styleUrls: ['./diasfestivos.component.scss'],
})
export class DiasfestivosComponent {
  private diasService = inject(DiasfestivosService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  @ViewChild('dt') dt!: Table;

  public dias: DiaFeriado[] = [];
  private clonDias: { [id: number]: DiaFeriado } = {};
  public editingRowKeys: { [id: number]: boolean } = {};
  private tempId = -1;

  constructor() {
    this.getDias();
  }

  /** Obtener todos los días festivos */
  public getDias() {
    this.diasService.getAll().subscribe({
      next: (res) => {
        this.dias = res.data;
      },
      error: () => {
        this.dias = [];
      },
    });
  }

  /** Agregar fila nueva y abrir edición automáticamente */
  public agregarFila() {
    const nueva: DiaFeriado = {
      id: this.tempId--,
      fecha: '',
      nombre: '',
      tipo: 'OFICIAL',
      anio: new Date().getFullYear(),
    };

    this.dias = [nueva, ...this.dias];
    this.editingRowKeys[nueva.id!] = true;
  }

  /** Editar fila existente */
  public editarFila(dia: DiaFeriado) {
    this.clonDias[dia.id!] = { ...dia };
    this.editingRowKeys[dia.id!] = true;
  }

  /** Guardar cambios */
  public guardarDia(dia: DiaFeriado, index: number) {
    if (!dia.fecha || !dia.nombre || !dia.tipo || !dia.anio) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Complete los campos obligatorios.',
      });
      return;
    }

    if (!dia.id || dia.id < 0) {
      // Fila nueva
      this.diasService.insert(dia).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Día festivo agregado correctamente',
          });
          this.getDias();
        },
        error: () => this.getDias(),
      });
    } else {
      // Actualización existente
      this.diasService.update(dia).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'Cambios guardados correctamente',
          });
          this.getDias();
        },
        error: () => this.getDias(),
      });
    }

    this.editingRowKeys[dia.id!] = false;
    delete this.clonDias[dia.id!];
  }

  /** Cancelar edición */
  public cancelarEdicion(dia: DiaFeriado, index: number) {
    if (dia.id! < 0) {
      this.dias.splice(index, 1);
    } else {
      this.dias[index] = this.clonDias[dia.id!];
    }

    this.editingRowKeys[dia.id!] = false;
    delete this.clonDias[dia.id!];
  }

  /** Confirmar eliminación */
  public confirmarEliminar(id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este día festivo?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminarDia(id),
    });
  }

  /** Eliminar día festivo */
  private eliminarDia(id: number) {
    this.diasService.delete(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Día festivo eliminado correctamente',
        });
        this.getDias();
      },
      error: () => this.getDias(),
    });
  }
}
