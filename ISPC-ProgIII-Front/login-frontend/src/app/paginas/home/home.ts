import { Component, inject } from '@angular/core';
import { NavUsuarios } from '../../componentes-compartidos/nav-usuarios/nav-usuarios';


@Component({
  selector: 'app-home',
  imports: [NavUsuarios],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  
}
