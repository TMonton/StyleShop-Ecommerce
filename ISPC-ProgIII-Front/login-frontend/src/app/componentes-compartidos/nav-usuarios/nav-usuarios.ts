import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  private http = inject(HttpClient);

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

  // 🔐 LOGOUT CORRECTO CON BACKEND
  logout() {
  const refresh = localStorage.getItem('refresh');
  const access = localStorage.getItem('access');

  this.http.post(
    'http://localhost:8000/api/logout/',
    { refresh },
    {
      headers: {
        Authorization: `Bearer ${access}`
      }
    }
  ).subscribe({
    next: () => {
      this.limpiarSesion();
    },
    error: () => {
      // aunque falle, cerramos sesión igual
      this.limpiarSesion();
    }
  });
}

  // 🧹 limpiar todo
  limpiarSesion() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    sessionStorage.clear();

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