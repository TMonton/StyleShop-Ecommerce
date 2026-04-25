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

  getHeaders() {
    const token = localStorage.getItem('access') || sessionStorage.getItem('access');

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  // 🔥 TRAER CARRITO
  getCarrito() {
    return this.http.get<any>('http://localhost:8000/api/cart/', this.getHeaders())
      .pipe(
        tap(res => {
          this.carritoSubject.next(res.items);

          const total = res.items.reduce((acc: number, item: any) => {
            return acc + item.cantidad;
          }, 0);

          this.totalItemsSubject.next(total);
        })
      );
  }

  // 🔥 AGREGAR
  agregarProducto(producto: any) {
    return this.http.post('http://localhost:8000/api/cart/', producto, this.getHeaders())
      .pipe(
        tap(() => this.getCarrito().subscribe())
      );
  }
  restarProducto(id: number) {
    return this.http.patch(
      'http://localhost:8000/api/cart/',
      { id }, // 👈 importante
      this.getHeaders()
    ).pipe(
      tap(() => this.getCarrito().subscribe())
    );
  }
  vaciarCarrito() {
    return this.http.delete(
      'http://localhost:8000/api/cart/',
      this.getHeaders()
    ).pipe(
      tap(() => this.getCarrito().subscribe())
    );
  }



}