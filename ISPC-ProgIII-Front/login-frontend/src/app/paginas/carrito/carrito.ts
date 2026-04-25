import { Component, OnInit, inject } from '@angular/core';
import { ServiceCarrito } from '../../services/service-carrito';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit {

  private serviceCarrito = inject(ServiceCarrito);

  carrito: any[] = [];
  total: number = 0;

  ngOnInit() {
    // 🔥 nos suscribimos al estado global (NO al http directo)
    this.serviceCarrito.carrito$.subscribe(items => {
      this.carrito = items;
      this.calcularTotal();
    });

    // 🔥 carga inicial
    this.serviceCarrito.getCarrito().subscribe();
  }

  // ➕ SUMAR
  sumar(item: any) {
    this.serviceCarrito.agregarProducto({
      nombre: item.nombre,
      precio: item.precio
    }).subscribe();
  }

  // ➖ RESTAR (usa PATCH que hicimos)
  restar(item: any) {
    this.serviceCarrito.restarProducto(item.id).subscribe();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => {
      return acc + (item.precio * item.cantidad);
    }, 0);
  }
  vaciarCarrito() {
    this.serviceCarrito.vaciarCarrito().subscribe();
  }

  finalizarCompra() {
    alert('Redirigiendo al pago...');
  }
}