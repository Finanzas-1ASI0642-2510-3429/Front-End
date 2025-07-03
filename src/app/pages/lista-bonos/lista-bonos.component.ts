import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UsuarioService } from '../../services/usuario.service';
import { ModalDetallesBonoComponent } from '../../components/modales/modal-detalles-bono/modal-detalles-bono.component';
import { ModalPagosComponent } from '../../components/modales/modal-pagos/modal-pagos.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-bonos',
  imports: [CommonModule, NzIconModule, FormsModule, ModalDetallesBonoComponent, ModalPagosComponent],
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
        const filtrados = bonos.filter(b => b.nombreCliente !== this.username && b.estadoInvertido === false);
        this.bonos = [...filtrados];
        this.bonosOriginales = [...filtrados];
        console.log("Bonos cargados:", this.bonos);
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo conectar con el servidor. Verifica tu conexión o vuelve a intentarlo más tarde.',
          confirmButtonText: 'Aceptar'
        });
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


  camposFiltroAvanzado = [
    { nombre: 'Tipo Tasa Base', tipo: 'select', opciones: ['TEA', 'TES', 'TEM', 'TNA', 'TNS', 'TNM'], valor: '', activo: false },
    { nombre: 'Capitalización', tipo: 'select', opciones: ['ANUAL', 'Semestral', 'Trimestral', 'Mensual'], valor: '', activo: false },
    { nombre: 'Monto entre', tipo: 'rango', min: null, max: null, activo: false },
    { nombre: 'Cliente', tipo: 'texto', valor: '', activo: false },
    { nombre: 'Tasa Base entre', tipo: 'rango', min: null, max: null, activo: false },
    { nombre: 'Tipo Gracia', tipo: 'select', opciones: ['Sin gracia', 'Parcial', 'Total'], valor: '', activo: false },
    { nombre: 'Moneda', tipo: 'select', opciones: ['PEN', 'USD'], valor: '', activo: false }
  ];
  
  activarCampo(campo: any, event: Event): void {
    event.stopPropagation();
  
    if (!campo.activo) {
      const activos = this.camposFiltroAvanzado.filter(c => c.activo).length;
      if (activos >= 3) {
        Swal.fire({
          icon: 'warning',
          title: 'Máximo 3 filtros',
          text: 'Solo puedes activar hasta 3 filtros avanzados a la vez.',
          confirmButtonColor: '#1d436b'
        });
        return;
      }
    }
  
    campo.activo = !campo.activo;
  
    if (!campo.activo) {
      campo.valor = '';
      campo.min = null;
      campo.max = null;
    }
  }
 

  bonoSeleccionado: any = null;
  modalDetalleVisible = false;
  modalPagosVisible = false;


  abrirModalDetalle(bono: any) {
    this.bonoSeleccionado = bono;
    this.modalDetalleVisible = true;
  }

  cerrarModalDetalle() {
    this.modalDetalleVisible = false;
  }

  abrirModalPagos(bono: any) {
    this.bonoSeleccionado = bono;
    this.modalPagosVisible = true;
  }

  cerrarModalPagos() {
    this.modalPagosVisible = false;
    this.modalDetalleVisible = true;
  }

  onBonoInvertido() {
    this.obtenerBonos();
  }
  
}
