import { Component, OnInit } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
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
    AutoCompleteModule
  ],
  templateUrl: './permiso-form.component.html',
  styleUrls: ['./permiso-form.component.scss']
})
export class PermisoFormComponent implements OnInit {
  form: FormGroup;
  private user: User = getDatosUsuario();
  tipoFechaSeleccionado: 'rango' | 'individual' = 'rango';
  nuevoDia?: Date;
  mostrarInfoContacto: boolean = false; // o false según tu lógica

  tiposPermiso = [
  { label: 'Llegar tarde', value: 'llegar_tarde' },
  { label: 'Faltar', value: 'faltar' },
  { label: 'Salir temprano', value: 'salir_temprano' },
  { label: 'No checó entrada', value: 'no_entrada' },
  { label: 'No checó comida', value: 'no_comida' },
  { label: 'Retardo horario de comida', value: 'retardo_comida' },
  { label: 'No checó salida', value: 'no_salida' },
  { label: 'Cambio de horario', value: 'cambio_horario' },
  { label: 'Visita en oficina foránea', value: 'visita_oficina' },
  { label: 'Falta por permiso de paternidad', value: 'permiso_paternidad' },
  { label: 'Fallecimiento de familiar directo', value: 'fallecimiento_familiar' },
  { label: 'Cambio de numero de usuario', value: 'cambio_usuario' }
];

  estados = [
    { label: 'Pendiente', value: 'pendiente' },
    { label: 'Aprobado', value: 'aprobado' },
    { label: 'Rechazado', value: 'rechazado' }
  ];

  correosSugeridos: any[] = [];




  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      id: [undefined],
      user_id: [undefined],
      nombre_colaborador: ['', Validators.required],
      departamento: ['', Validators.required],
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

      console.log('Solicitud de permiso:', value);
      this.messageService.add({severity:'success', summary:'Éxito', detail:'Solicitud guardada correctamente'});
      
      // Resetear el formulario después de guardar
      this.cancelar();
    } else {
      this.form.markAllAsTouched();
      this.messageService.add({severity:'error', summary:'Error', detail:'Por favor, completa todos los campos requeridos'});
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
      this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Esta fecha ya ha sido agregada'});
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
  // ejemplo de filtrado, reemplazar por tu fuente real
  const todosLosCorreos = [
    'jefe1@empresa.com',
    'jefe2@empresa.com',
    'jefe3@empresa.com',
  ];
  this.correosSugeridos = todosLosCorreos.filter(c => c.toLowerCase().includes(query));
}


isFieldInvalid(field: string): boolean {
  const control = this.form.get(field);
  return control?.invalid && (control.dirty || control.touched) || false;
}

}