import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ServiceCarrito } from '../../services/service-carrito';

@Component({
  selector: 'app-nav-usuarios',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-usuarios.html',
  styleUrl: './nav-usuarios.css',
})
export class NavUsuarios implements OnInit {

  private router = inject(Router);

  totalItems = 0;

  user: any = null; // 👈 usuario logueado

  constructor(private serviceCarrito: ServiceCarrito) {}

  ngOnInit() {
    // 🔥 cargar usuario
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    }

    // 🔥 carrito contador
    this.serviceCarrito.totalItems$.subscribe(total => {
      this.totalItems = total;
    });

    this.cargarCantidad();
  }

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('user');
    sessionStorage.removeItem('access');

    this.router.navigate(['/login']);
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