import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { getDatosUsuario } from '../../../../shared/helpers/permisos.helper';
import { User } from '../../../auth/interfaces/user';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [ CommonModule, CardModule, AvatarModule, DividerModule, ButtonModule, TagModule ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  usuario: User = getDatosUsuario();
  private authService = inject(AuthService);
  permisos: any = [];
  ngOnInit(): void {
    // Si quieres actualizar la foto al cargar
    this.authService.getFotoUsuario(this.usuario.chrClave).subscribe({
      next: (res) => {
        if (res?.data) {
          this.usuario.chrFoto = res.data;
        }
      }
    });

    this.authService.getPermisosUsuario().subscribe({
      next: (res) => {
        console.log('Permisos del usuario:', res);
        this.permisos = res.data || [];
      }
    });
  }
}