import { Routes } from '@angular/router';
import { Login } from './paginas/login/login';
import { Home } from './paginas/home/home';
import { Inicio } from './paginas/inicio/inicio';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'home', component: Home },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' }
];
