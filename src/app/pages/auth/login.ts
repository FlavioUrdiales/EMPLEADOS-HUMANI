import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from './services/auth.service';
import { ToastService } from '../../shared/services/toastService.service';
import { LoginInterface } from './interfaces/login';
import { getDatosUsuario, PermisosHelper } from '../../shared/helpers/permisos.helper';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
<div class="text-center mb-8">
  <!-- Imagen en lugar de SVG -->
  <img src="/images/logos/isotipo-nuevo.png" 
       alt="Logo"
       class="mb-8 w-16 mx-auto object-contain" />

  <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">
    Bienvenido de vuelta
  </div>
  <span class="text-muted-color font-medium">
    Inicia sesión para continuar
  </span>
</div>


                        <div>
                            <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Usuario</label>
                            <input pInputText id="email1" type="text" placeholder="Usuario o Correo" class="w-full md:w-[30rem] mb-8" [(ngModel)]="email" />

                            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                            <p-password id="password1" [(ngModel)]="password" placeholder="Password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false"></p-password>

                            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                <div class="flex items-center">
                                    <p-checkbox [(ngModel)]="checked" id="rememberme1" binary class="mr-2"></p-checkbox>
                                    <label for="rememberme1">Recordarme</label>
                                </div>
                                <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Olvidaste tu contraseña?</span>
                            </div>
                            <p-button label="Sign In" styleClass="w-full" (click)="login()"></p-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login {
    public email: string = '';
    public password: string = '';
    public checked: boolean = false;
    public formBuilder: FormBuilder = inject(FormBuilder);
    public router: Router = inject(Router);
    public auth: AuthService = inject(AuthService);
    public toastService: ToastService = inject(ToastService);
    public helperPermisos: PermisosHelper = inject(PermisosHelper);


    public login = async () => {
        if (this.email === '' || this.password === '') {
            this.toastService.error('not-valid');
            return;
        }

        const data: LoginInterface = { username: this.email, password: this.password };
        this.auth.signIn(data).subscribe({
            next: (res: any) => {
                if (res.response != null) {
                    sessionStorage.setItem('token', res.data);
                    const user = getDatosUsuario();
                    this.helperPermisos.tienePermisoSistema(user.chrClave).subscribe({
                        next: (res: any) => {
                            if (res) {
                                this.toastService.success('Bienvenido de nuevo');
                                this.router.navigate(['/']);
                            } else {
                                sessionStorage.removeItem('token');
                                this.toastService.error(403);
                            }
                        }
                    });

                }
            }
        });
    };
}
