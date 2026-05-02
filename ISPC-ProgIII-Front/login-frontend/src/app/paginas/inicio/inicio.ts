import { Component, inject } from '@angular/core'; // 1. Importa inject
import { RouterLink } from '@angular/router';
import { Nav } from '../../componentes-compartidos/nav/nav';
import { ServiceCarrito } from '../../services/service-carrito';

@Component({
  selector: 'app-inicio',
  standalone: true, // Asegúrate de que tenga standalone: true
  imports: [RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  // 2. Inyecta el servicio aquí
  private serviceCarrito = inject(ServiceCarrito);

  agregarAlCarrito(nombre: string, precio: number) {

    const token = localStorage.getItem('access') || sessionStorage.getItem('access');

    if (!token) {
      alert('Tenés que iniciar sesión para usar el carrito');
      return;
    }

    this.serviceCarrito.agregarProducto({ nombre, precio })
      .subscribe({
        next: () => alert('Producto agregado 🛒'),
        error: () => alert('Error al agregar')
      });
  }
}
