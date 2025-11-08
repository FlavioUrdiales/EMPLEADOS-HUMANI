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
import { QuincenaService } from '../../services/quincena.service';
import { Quincena } from '../../interfaces/quincena';

@Component({
  selector: 'app-quincena',
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
  templateUrl: './quincena.component.html',
  styleUrls: ['./quincena.component.scss'],
})
export class QuincenaComponent {
  private quincenaService = inject(QuincenaService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  @ViewChild('dt') dt!: Table;

  public quincenas: Quincena[] = [];
  private clonQuincenas: { [id: number]: Quincena } = {};

  /** Para manejar qué filas están en edición */
  public editingRowKeys: { [id: number]: boolean } = {};

  /** ID temporal para nuevas filas */
  private tempId = -1;

  constructor() {
    this.getQuincenas();
  }

  /** Obtener todas las quincenas */
  public getQuincenas() {
    this.quincenaService.getAll().subscribe({
      next: (res) => {
        this.quincenas = res.data;
      },
      error: (err) => {
        this.quincenas = [];
      }

    });
  }

  /** Agregar fila nueva y abrir edición automáticamente */
  public agregarFila() {
    const nueva: Quincena = {
      id: this.tempId--, // ID temporal negativo
      empleado_codigo: '',
      chrClave: '',
      quincena: 1,
      sueldo_diario_real: 0,
      sueldo_diario_fiscal: 0,
      sueldo_diario_no_fiscal: 0,
      isr_diario: 0,
      imss_diario: 0,
      tope_sin_bonos: 0,
    };

    this.quincenas = [nueva, ...this.quincenas];

    // Abrir edición
    this.editingRowKeys[nueva.id!] = true;
  }

  /** Editar fila existente */
  public editarFila(quincena: Quincena) {
    this.clonQuincenas[quincena.id!] = { ...quincena };
    this.editingRowKeys[quincena.id!] = true;
  }

  /** Guardar cambios */
  public guardarQuincena(quincena: Quincena, index: number) {
    if (!quincena.empleado_codigo || !quincena.chrClave || !quincena.quincena) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Complete los campos obligatorios.',
      });
      return;
    }

    // Validar que quincena sea 1 o 2
    if (quincena.quincena < 1) quincena.quincena = 1;
    if (quincena.quincena > 2) quincena.quincena = 2;

    if (!quincena.id || quincena.id < 0) {
      // Fila nueva
      this.quincenaService.insert(quincena).subscribe({
        next: (resp) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Quincena agregada correctamente',
          });
          this.getQuincenas();
        },
        error: (err) => {
          this.getQuincenas();
        },
      });
    } else {
      // Actualización existente
      this.quincenaService.update(quincena).subscribe({
        next: (resp) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Guardado',
            detail: 'Cambios guardados correctamente',
          });
          this.getQuincenas();
        },
        error: (err) => {
          this.getQuincenas();
        },
      });
    }

    this.editingRowKeys[quincena.id!] = false;
    delete this.clonQuincenas[quincena.id!];
  }

  /** Cancelar edición */
  public cancelarEdicion(quincena: Quincena, index: number) {
    if (quincena.id! < 0) {
      // Fila nueva, eliminarla
      this.quincenas.splice(index, 1);
    } else {
      // Restaurar fila existente
      this.quincenas[index] = this.clonQuincenas[quincena.id!];
    }

    this.editingRowKeys[quincena.id!] = false;
    delete this.clonQuincenas[quincena.id!];
  }

  /** Confirmar eliminación */
  public confirmarEliminar(id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar esta quincena?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarQuincena(id);
      },
    });
  }

  /** Eliminar quincena */
  private eliminarQuincena(id: number) {
    this.quincenaService.delete(id).subscribe({
      next: (resp) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Quincena eliminada correctamente',
        });
        this.getQuincenas();
      },
      error: (err) => {
        this.getQuincenas();
      }
    });
  }
}
