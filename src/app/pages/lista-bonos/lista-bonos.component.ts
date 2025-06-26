import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-lista-bonos',
  imports: [CommonModule, NzIconModule, FormsModule],
  standalone: true,
  templateUrl: './lista-bonos.component.html',
  styleUrl: './lista-bonos.component.scss'
})
export class ListaBonosComponent implements OnInit {

  bonos: any[] = [];
  username: string = '';
  filtroNombre: string = '';
  filtrosActivos: boolean = false;
  bonosOriginales: any[] = [];

  ngOnInit(): void {
    this.obtenerBonos();
    this.obtenerUsuario();
    this.bonosOriginales = [...this.bonos];
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

  constructor(private usuarioService: UsuarioService) { }

  obtenerBonos(): void {
    this.usuarioService.listarBonos().subscribe({
      next: (bonos) => {
        const filtrados = bonos.filter(b => b.nombreCliente !== this.username);
        this.bonos = [...filtrados];
        this.bonosOriginales = [...filtrados];
        console.log("Bonos cargados:", this.bonos);
      },
      error: (error) => {
        console.error('Error al obtener bonos:', error);
      }
    });
  }



  filtrarBonos(): void {
    const nombre = this.filtroNombre.toLowerCase().trim();

    this.bonos = this.bonosOriginales.filter(b =>
      b.nombre.toLowerCase().includes(nombre)
    );
  }

  toggleFiltrosAvanzados(): void {
    this.filtrosActivos = !this.filtrosActivos;
  }


  camposFiltroAvanzado: string[] = [
    'Capitalización', 'Frecuencia', 'Monto',
    'Cliente', 'Plazo', 'Tasa Base',
    'Tipo Gracia', 'Moneda', 'Tipo Tasa', 'Tasa Base Tipo'
  ];


}
