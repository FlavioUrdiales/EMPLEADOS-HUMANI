import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './app/pages/auth/services/auth.service';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule],
    template: `<router-outlet></router-outlet><p-toast></p-toast>`
})
export class AppComponent implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService : AuthService,
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const token = params['token'];
            const url = params['url'];

            if (token) {
                sessionStorage.setItem('token', token);
                this.authService.setToken(token); // Guardar el token en el servicio
            }

            if (url) {
                // Espera mínima para asegurar almacenamiento
                setTimeout(() => {
                    this.router.navigate([url]);
                }, 100);
            }
        });
    }
}