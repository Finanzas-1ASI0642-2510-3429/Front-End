import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-lista-bonos',
  imports: [CommonModule, NzIconModule],
  standalone: true,
  templateUrl: './lista-bonos.component.html',
  styleUrl: './lista-bonos.component.scss'
})
export class ListaBonosComponent implements OnInit {

  bonos: any[] = [];
  username: string = '';


  ngOnInit(): void {
    this.obtenerBonos();
    this.obtenerUsuario(); 

  }

  obtenerUsuario() {
    const userData = localStorage.getItem('user');

    try {
      if (userData) {
        if (userData.startsWith('{')) {
          const parsedUser = JSON.parse(userData);
          this.username = parsedUser.username || 'desconocido';
        } else {
          this.username = userData;
          console.log("Usuario:", userData)
        }
      }
    } catch (e) {
      console.error('Error al parsear el usuario desde localStorage:', e);
    }
  }

  constructor(private usuarioService: UsuarioService) {}

  obtenerBonos(): void {
    this.usuarioService.listarBonos().subscribe({
      next: (bonos) => {
        this.bonos = bonos.filter(b => b.nombreCliente !== this.username);
      },
      error: (error) => {
        console.error('Error al obtener bonos:', error);
      }
    });
  }

}
