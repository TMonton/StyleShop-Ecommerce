import { Routes } from '@angular/router';
import { Login } from './paginas/login/login';
import { Home } from './paginas/home/home';
import { Inicio } from './paginas/inicio/inicio';
import { Carrito } from './paginas/carrito/carrito';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Inicio },

  { path: 'home', component: Home },

  { path: 'login', component: Login },

  // 🔒 PROTEGIDA (solo logueados)
  { path: 'carrito', component: Carrito, canActivate: [authGuard] },

  { path: '**', redirectTo: '' }
];