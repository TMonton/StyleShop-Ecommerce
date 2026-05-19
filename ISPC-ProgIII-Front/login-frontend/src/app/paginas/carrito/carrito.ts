import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { ServiceCarrito } from '../../services/service-carrito';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
  // Borramos cualquier configuración extra de ChangeDetection si la hubiera
})
export class Carrito implements OnInit {
  private serviceCarrito = inject(ServiceCarrito);
  private cdr = inject(ChangeDetectorRef); // 🔥 Nos ayuda a forzar el renderizado si se traba

  carrito: any[] = [];
  total: number = 0;

  ngOnInit() {
    this.serviceCarrito.carrito$.subscribe((items) => {
      // 🔥 Forzamos una copia nueva del array ([...items]) para que Angular detecte el cambio de referencia
      this.carrito = [...items]; 
      this.calcularTotal();
      this.cdr.detectChanges(); // 🔥 Le metemos un empujón manual a la vista
    });

    this.serviceCarrito.getCarrito().subscribe();
  }

  sumar(id: number) {
    this.serviceCarrito.sumarProducto(id).subscribe();
  }

  restar(id: number) {
    this.serviceCarrito.restarProducto(id).subscribe();
  }

  vaciarCarrito() {
    this.serviceCarrito.vaciarCarrito().subscribe();
  }

  calcularTotal() {
    // Aseguramos que la operación matemática no falle con strings
    this.total = this.carrito.reduce((acc, item) => {
      return acc + (Number(item.precio) * item.cantidad);
    }, 0);
  }

  finalizarCompra() {
    alert('Redirigiendo al pago...');
  }
}