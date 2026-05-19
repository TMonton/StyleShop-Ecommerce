import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServiceCarrito {
  private http = inject(HttpClient);

  private carritoSubject = new BehaviorSubject<any[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  private totalItemsSubject = new BehaviorSubject<number>(0);
  totalItems$ = this.totalItemsSubject.asObservable();

  private baseUrl = 'http://localhost:8000/api/cart/';

  // 🔐 HEADERS
  getHeaders() {
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // 🔄 MÉTODO CENTRALIZADO PARA PROCESAR RESPUESTAS
  private actualizarEstado(res: any) {
    this.carritoSubject.next(res.items || []);
    const total = (res.items || []).reduce((acc: number, item: any) => acc + item.cantidad, 0);
    this.totalItemsSubject.next(total);
  }

  // 🛒 TRAER CARRITO
  getCarrito() {
    return this.http.get<any>(this.baseUrl, this.getHeaders()).pipe(
      tap((res) => this.actualizarEstado(res))
    );
  }

  // ➕ AGREGAR PRODUCTO
  agregarProducto(producto: any) {
    return this.http
      .post<any>(this.baseUrl, producto, this.getHeaders())
      .pipe(tap((res) => this.actualizarEstado(res)));
  }

  // ➕ SUMAR
  sumarProducto(id: number) {
    return this.http
      .patch<any>(`${this.baseUrl}${id}/sumar/`, {}, this.getHeaders())
      .pipe(tap((res) => this.actualizarEstado(res)));
  }

  // ➖ RESTAR
  restarProducto(id: number) {
    return this.http
      .patch<any>(`${this.baseUrl}${id}/restar/`, {}, this.getHeaders())
      .pipe(tap((res) => this.actualizarEstado(res)));
  }

  // 🗑️ VACIAR
  vaciarCarrito() {
    return this.http
      .delete<any>(`${this.baseUrl}vaciar/`, this.getHeaders())
      .pipe(tap((res) => this.actualizarEstado(res)));
  }
}