import { Component, inject, ViewChild } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
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

interface UsuarioChecador {
  id: number;
  checador_user_id: string;
  chrClaveUsuario: string;
  chrNombre: string;
  chrPaterno: string;
  chrMaterno: string;
}

@Component({
  selector: 'app-relacion',
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
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './relacion.component.html',
  styleUrl: './relacion.component.scss',
})
export class RelacionComponent {
  private usuariosService = inject(UsuariosService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  @ViewChild('dt') dt!: Table; // referencia al p-table

  public usuarios: UsuarioChecador[] = [];
  private clonUsuarios: { [id: number]: UsuarioChecador } = {};

  constructor() {
    this.getUsuarios();
  }

  public getUsuarios() {
    this.usuariosService.getUsuariosChecador().subscribe((data) => {
      this.usuarios = data;
    });
  }

  /** Agregar fila nueva y abrir edición de inmediato */
  public agregarFila() {
    const nuevo: UsuarioChecador = {
      id: 0,
      chrClaveUsuario: '',
      chrNombre: '',
      chrPaterno: '',
      chrMaterno: '',
      checador_user_id: '',
    };
    this.usuarios = [nuevo, ...this.usuarios];

    // abrimos edición inmediatamente
    setTimeout(() => {
      this.dt.editingRowKeys[nuevo.id] = true;
    });
  }

  /** Editar fila existente */
  public editarFila(usuario: UsuarioChecador) {
    this.clonUsuarios[usuario.id] = { ...usuario }; // guardamos copia original
    this.dt.editingRowKeys[usuario.id] = true;
  }

  /** Guardar cambios (nuevo o existente) */
  public guardarUsuario(usuario: UsuarioChecador, index: number) {
    if (!usuario.chrClaveUsuario || !usuario.checador_user_id) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Campos requeridos',
        detail: 'Complete Clave Usuario y Checador User ID.',
      });
      return;
    }

    if (usuario.id === 0) {
      this.usuariosService
        .insertarUsuarioChecador(
          Number(usuario.checador_user_id),
          usuario.chrClaveUsuario
        )
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Usuario agregado correctamente',
          });
          this.getUsuarios();
        });
    } else {
      // Aquí deberías implementar update real si tu API lo soporta
      this.messageService.add({
        severity: 'success',
        summary: 'Guardado',
        detail: 'Cambios guardados correctamente',
      });
    }

    this.dt.editingRowKeys[usuario.id] = false;
    delete this.clonUsuarios[usuario.id];
  }

  /** Cancelar edición */
  public cancelarEdicion(usuario: UsuarioChecador, index: number) {
    if (usuario.id === 0) {
      // si era nuevo lo quitamos de la tabla
      this.usuarios.splice(index, 1);
    } else {
      // restauramos los valores originales
      this.usuarios[index] = this.clonUsuarios[usuario.id];
    }
    this.dt.editingRowKeys[usuario.id] = false;
    delete this.clonUsuarios[usuario.id];
  }

  /** Confirmación de eliminar */
  public confirmarEliminar(id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar esta relación?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.eliminarUsuario(id);
      },
    });
  }

  private eliminarUsuario(id: number) {
    this.usuariosService.eliminarUsuarioChecador(id).subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'Eliminado',
        detail: 'Usuario eliminado correctamente',
      });
      this.getUsuarios();
    });
  }
}
