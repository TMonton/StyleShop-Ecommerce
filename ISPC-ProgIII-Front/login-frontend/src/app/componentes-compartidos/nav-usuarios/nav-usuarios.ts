import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ServiceCarrito } from '../../services/service-carrito';


@Component({
  selector: 'app-nav-usuarios',
  imports: [RouterLink],
  templateUrl: './nav-usuarios.html',
  styleUrl: './nav-usuarios.css',
})
export class NavUsuarios implements OnInit {
  private router = inject(Router);
  constructor(private serviceCarrito: ServiceCarrito) { }
  logout() {
    // 1. Limpiamos las credenciales
    localStorage.removeItem('access');
    sessionStorage.removeItem('access');

    // 2. Redirigimos al login
    this.router.navigate(['/login']);
  }

  totalItems = 0;

  ngOnInit() {
    this.serviceCarrito.totalItems$.subscribe(total => {
      this.totalItems = total;
    });
  }

  cargarCantidad() {
    this.serviceCarrito.getCarrito().subscribe((res: any) => {
      this.totalItems = res.items.reduce(
        (acc: number, item: any) => acc + item.cantidad,
        0
      );
    });
  }
}
