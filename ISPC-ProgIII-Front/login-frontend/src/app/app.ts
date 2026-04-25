import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth-service';

// 👇 importá tus dos nav
import { Nav } from './componentes-compartidos/nav/nav';
import { NavUsuarios } from './componentes-compartidos/nav-usuarios/nav-usuarios';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Nav, NavUsuarios],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  protected readonly title = signal('login-frontend');

  constructor(public auth: AuthService) {}
}