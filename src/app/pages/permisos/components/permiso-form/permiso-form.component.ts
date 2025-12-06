import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { User } from '../../../auth/interfaces/user';
import { getDatosUsuario } from '../../../../shared/helpers/permisos.helper';
import { FormsModule } from '@angular/forms';
import { formatDate } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { PermisosService } from '../../services/permisos.service';
import { ToastService } from '../../../../shared/services/toastService.service';
import { CorreoJefe, TipoPermiso } from '../../interfaces/permisos.interface';
import { CorreosService } from '../../../../shared/services/correos/correos.service';
import { CorreosRequest } from '../../../../layout/interfaces/correos';
@Component({
  selector: 'app-permiso-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DatePickerModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    ChipModule,
    TextareaModule,
    RadioButtonModule,
    ToastModule,
    AutoCompleteModule,
    ConfirmDialogModule
  ],
  templateUrl: './permiso-form.component.html',
  styleUrls: ['./permiso-form.component.scss'],
  providers: [ConfirmationService]
})
export class PermisoFormComponent implements OnInit {
  form: FormGroup;
  private user: User = getDatosUsuario();
  private permisosService: PermisosService = inject(PermisosService);
  private correosService = inject(CorreosService);

  tipoFechaSeleccionado: 'rango' | 'individual' = 'rango';
  nuevoDia?: Date;
  mostrarInfoContacto: boolean = false; // o false según tu lógica

  tiposPermiso: TipoPermiso[] = [];

  correosSugeridos: any[] = [];

  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private fb: FormBuilder = inject(FormBuilder);
  private toastService: ToastService = inject(ToastService);

  constructor() {
    this.form = this.fb.group({
      id: [undefined],
      user_id: [undefined],
      nombre_colaborador: ['', Validators.required],
      departamento: [''],
      correo_electronico: ['', [Validators.required, Validators.email]],
      correo_jefe: ['', [Validators.required, Validators.email]],
      fecha_inicio: [undefined],
      fecha_fin: [undefined],
      motivo_permiso: ['', Validators.required],
      tipo_permiso: [undefined, Validators.required],
      estado: ['pendiente'],
      rangoFechas: [undefined, this.rangoFechasValidator.bind(this)],
      diasIndividuales: [[], this.diasIndividualesValidator.bind(this)],
      creado_en: [new Date()],
      actualizado_en: [new Date()]
    });
  }

  ngOnInit(): void {
    // Prellenar datos del usuario
    this.getTiposPermisos();
    this.form.patchValue({
      user_id: this.user.chrClave,
      nombre_colaborador: `${this.user.chrNombre} ${this.user.chrMaterno} ${this.user.chrPaterno}`,
      departamento: this.user.chrDepartamento,
      correo_electronico: this.user.chrEmail,
    });

    // Observar cambios en el tipo de fecha seleccionado
    this.form.get('rangoFechas')?.valueChanges.subscribe(() => {
      if (this.tipoFechaSeleccionado === 'rango') {
        this.form.get('diasIndividuales')?.setValue([]);
      }
    });

    this.form.get('diasIndividuales')?.valueChanges.subscribe(() => {
      if (this.tipoFechaSeleccionado === 'individual') {
        this.form.get('rangoFechas')?.setValue(null);
      }
    });
  }

  public getTiposPermisos() {
    this.permisosService.getAllTiposPermisos().subscribe({
      next: (resp) => {
        this.tiposPermiso = resp;
      }
    });
  }

  // Validadores personalizados
  private rangoFechasValidator(control: FormControl) {
    if (this.tipoFechaSeleccionado !== 'rango') return null;
    return control.value && control.value.length === 2 ? null : { required: true };
  }

  private diasIndividualesValidator(control: FormControl) {
    if (this.tipoFechaSeleccionado !== 'individual') return null;
    return control.value && control.value.length > 0 ? null : { required: true };
  }



  guardar() {
    let mensaje = '';

    if (this.tipoFechaSeleccionado === 'rango' && this.form.value.rangoFechas?.length === 2) {
      const [inicio, fin] = this.form.value.rangoFechas;
      mensaje = `el rango de fechas: ${new Date(inicio).toLocaleDateString()} al ${new Date(fin).toLocaleDateString()}`;
    } else if (this.tipoFechaSeleccionado === 'individual' && this.form.value.diasIndividuales?.length > 0) {
      mensaje =
        'los días: ' +
        this.form.value.diasIndividuales
          .map((d: Date) => new Date(d).toLocaleDateString())
          .join(', ');
    } else {
      mensaje = 'las fechas seleccionadas';
    }

    this.confirmationService.confirm({
      header: 'Confirmar solicitud',
      message: `¿Seguro que quieres solicitar permiso para ${mensaje}?`,
      accept: () => this.insertar(),
      reject: () => this.cancelar(),
    });
  }

  insertar() {

    if (this.form.valid) {
      const value = this.form.value;

      // Asignar fecha_inicio y fecha_fin si viene un rango
      if (value.rangoFechas && value.rangoFechas.length === 2) {
        value.fecha_inicio = value.rangoFechas[0];
        value.fecha_fin = value.rangoFechas[1];
      } else if (value.diasIndividuales && value.diasIndividuales.length > 0) {
        // Para días individuales, establecer la primera y última fecha
        const diasOrdenados = [...value.diasIndividuales].sort();
        value.fecha_inicio = new Date(diasOrdenados[0]);
        value.fecha_fin = new Date(diasOrdenados[diasOrdenados.length - 1]);
      }
      let sendingData = {
        data: { ...value }
      };
      this.permisosService.create(sendingData).subscribe({
        next: (resp) => {
          this.toastService.success('Permiso guardado con éxito');
          let data: CorreosRequest = {
            data: {
              correo: value.correo_jefe,
              asunto: 'Nueva solicitud de permiso',
              body: `<p>Hola,</p>
                       <p>El colaborador ${value.nombre_colaborador} ha solicitado un permiso.</p>
                        <p>Motivo: ${value.motivo_permiso}</p>
                        <p>Fechas: ${value.fecha_inicio?.toLocaleDateString()} - ${value.fecha_fin?.toLocaleDateString()}</p>
                        <p>Por favor, revisa y autoriza o rechaza la solicitud en el sistema.</p>
                        <p>Saludos,</p>
                        <p>${this.user.chrNombre} ${this.user.chrPaterno}</p>`,
              response: { chrNombre: value.nombre_colaborador, chrPaterno: '', chrMaterno: '' },
              textButton: '',
              url: ''
            }
          };
          this.correosService.sendCorreoElectronico(data).subscribe({
            next: () => {
              this.toastService.success('Correo de notificación enviado al jefe.');
            },
            error: (err) => {
              this.toastService.error('Error al enviar correo: ' + err.message);
            }
          });
          

        },
        error: (err) => {
          this.toastService.error('Error al guardar el permiso: ' + err.message);
        }
      });


      // Resetear el formulario después de guardar
      this.cancelar();
    } else {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, completa todos los campos requeridos' });
    }
  }

  cancelar() {
    this.form.reset({
      estado: 'pendiente',
      user_id: this.user.chrClave,
      nombre_colaborador: `${this.user.chrNombre} ${this.user.chrMaterno} ${this.user.chrPaterno}`,
      departamento: this.user.chrDepartamento,
      correo_electronico: this.user.chrEmail,
      rangoFechas: null,
      diasIndividuales: []
    });
    this.tipoFechaSeleccionado = 'rango';
    this.nuevoDia = undefined;
  }

  agregarDiaSeleccionado() {
    if (!this.nuevoDia) return;

    const fechaStr = this.nuevoDia.toISOString().split('T')[0]; // YYYY-MM-DD
    const dias = this.form.get('diasIndividuales')?.value as string[];

    // Evitar duplicados
    if (!dias.includes(fechaStr)) {
      dias.push(fechaStr);
      this.form.get('diasIndividuales')?.setValue([...dias]);
      this.nuevoDia = undefined; // limpiar input
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Esta fecha ya ha sido agregada' });
    }
  }

  eliminarDia(index: number) {
    const dias = this.form.get('diasIndividuales')?.value as string[];
    dias.splice(index, 1);
    this.form.get('diasIndividuales')?.setValue([...dias]);
  }

  // Formatear para mostrar en chips
  formatoDia(dia: string) {
    return formatDate(dia, 'dd/MM/yyyy', 'en-US');
  }

  toggleMotivo(valor: string) {
    const motivos = this.form.get('motivos')?.value || [];
    if (motivos.includes(valor)) {
      this.form.get('motivos')?.setValue(motivos.filter((v: string) => v !== valor));
    } else {
      this.form.get('motivos')?.setValue([...motivos, valor]);
    }
  }

  buscarCorreos(event: any) {
    const query = event.query.toLowerCase();

    this.permisosService.getAllCorreosJefes().subscribe({
      next: (resp: CorreoJefe[]) => {
        this.correosSugeridos = resp.map(cj => cj.correo).filter(c => c.toLowerCase().includes(query));
      }
    });
  }


  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control?.invalid && (control.dirty || control.touched) || false;
  }

}