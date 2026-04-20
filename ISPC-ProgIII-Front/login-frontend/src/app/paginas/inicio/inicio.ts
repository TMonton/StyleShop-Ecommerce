import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Nav } from '../../componentes-compartidos/nav/nav';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Nav],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {}
