import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav-usuarios',
  imports: [RouterLink],
  templateUrl: './nav-usuarios.html',
  styleUrl: './nav-usuarios.css',
})
export class NavUsuarios {
  private router = inject(Router);

  logout() {
    // 1. Limpiamos las credenciales
    localStorage.removeItem('access');
    sessionStorage.removeItem('access');

    // 2. Redirigimos al login
    this.router.navigate(['/login']);
  }
}
