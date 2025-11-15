import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TurnosService } from '../../services/turnos.service';
import { Turno } from '../../interfaces/turnos.interface';
import { Select } from 'primeng/select';
import { UsuarioChecador } from '../../../usuarios/interfaces/usuario-checador.interface';
import { UsuariosService } from '../../../usuarios/services/usuarios.service';
@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    ToastModule,
    Select
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.scss']
})
export class TurnosComponent {

  private turnosService = inject(TurnosService);
  private usuariosService = inject(UsuariosService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  @ViewChild('dt') dt!: Table;

  public turnos: Turno[] = [];
  public usuarios: UsuarioChecador[] = [];


  private clonTurnos: { [id: number]: Turno } = {};
  public lstDiasSemana: any[] = [
    { label: 'Lunes', value: 'lunes' },
    { label: 'Martes', value: 'martes' },
    { label: 'Miércoles', value: 'miércoles' },
    { label: 'Jueves', value: 'jueves' },
    { label: 'Viernes', value: 'viernes' },
    { label: 'Sábado', value: 'sábado' },
    { label: 'Domingo', value: 'domingo' }
  ];
  public lstUsuarios: any[] = [];

  public editingRowKeys: { [id: number]: boolean } = {};
  private tempId = -1;

  constructor() {
    this.getTurnos();
    this.getUsuarios();
  }

  public getTurnos() {
    this.turnosService.getAll().subscribe({
      next: (res) => this.turnos = res.data,
      error: () => this.turnos = []
    });
  }


    public getUsuarios() {
    this.usuariosService.getUsuariosChecador().subscribe((data) => {
      this.usuarios = data;
      this.lstUsuarios = this.usuarios.map(user => ({ label: `${user.chrNombre} ${user.chrPaterno} ${user.chrMaterno} (${user.chrClaveUsuario})`, value: user.chrClaveUsuario }));
    });
  }
  public agregarFila() {
    const nuevo: Turno = {
      id: this.tempId--,
      chr_clave_usuario: '',
      dia_semana: '',
      entrada: '',
      salida: '',
      comida_inicio: '',
      comida_fin: '',
      observaciones: ''
    };
    this.turnos = [nuevo, ...this.turnos];
    this.editingRowKeys[nuevo.id!] = true;
  }

  public editarFila(turno: Turno) {
    this.clonTurnos[turno.id!] = { ...turno };
    this.editingRowKeys[turno.id!] = true;
  }

  public guardarTurno(turno: Turno, index: number) {
    if (!turno.chr_clave_usuario || !turno.dia_semana || !turno.entrada || !turno.salida) {
      this.messageService.add({ severity: 'warn', summary: 'Campos requeridos', detail: 'Complete los campos obligatorios.' });
      return;
    }

    if (!turno.id || turno.id < 0) {
      this.turnosService.insert(turno).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Turno agregado correctamente' });
          this.getTurnos();
        },
        error: () => this.getTurnos()
      });
    } else {
      this.turnosService.update(turno).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Guardado', detail: 'Cambios guardados correctamente' });
          this.getTurnos();
        },
        error: () => this.getTurnos()
      });
    }

    this.editingRowKeys[turno.id!] = false;
    delete this.clonTurnos[turno.id!];
  }

  public cancelarEdicion(turno: Turno, index: number) {
    if (turno.id! < 0) {
      this.turnos.splice(index, 1);
    } else {
      this.turnos[index] = this.clonTurnos[turno.id!];
    }
    this.editingRowKeys[turno.id!] = false;
    delete this.clonTurnos[turno.id!];
  }

  public confirmarEliminar(id: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar este turno?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.eliminarTurno(id)
    });
  }

  private eliminarTurno(id: number) {
    this.turnosService.delete(id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Turno eliminado correctamente' });
        this.getTurnos();
      },
      error: () => this.getTurnos()
    });
  }

}
