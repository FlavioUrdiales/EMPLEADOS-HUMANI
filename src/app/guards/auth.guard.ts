import { CanActivate } from '@angular/router';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../pages/auth/services/auth.service';


@Injectable
({
  providedIn : 'root'
})

export  class AuthGuard implements CanActivate {
  
  public auth: AuthService = inject(AuthService);
  public router: Router = inject(Router);
  

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
    
  }

}



