import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { NzIconModule } from 'ng-zorro-antd/icon';
import Swal from 'sweetalert2';
import { ThemeService } from '../../services/theme.service';
import { ActualizarBonoModalComponent } from '../../components/modales/actualizar-bono-modal/actualizar-bono-modal.component';

@Component({
  selector: 'app-nuevo-bono',
  standalone: true,
  imports: [FormsModule, CommonModule, NzIconModule, ActualizarBonoModalComponent],
  templateUrl: './nuevo-bono.component.html',
  styleUrl: './nuevo-bono.component.scss'
})
export class NuevoBonoComponent implements OnInit {
  bono = {
    nombre: '',
    montoNominal: '',
    plazoAnios: '',
    frecuenciaPago: 'anual',
    tipoTasa: 'efectiva',
    capitalizacion: 'anual',
    tipoTasaBase: 'efectiva',
    tasaBase: '',
    tipoMoneda: 'PEN',
    periodoGracia: '',
    tipoGracia: 'parcial'
  };

  resultados: any = null;
  username: string = '';
  listaBonosFiltrados: any[] = [];
  nuevaFilaAnimada = false;
  bonoAgregadoId: string | null = null;
  paginaActual = 1;
  tamanoPagina = 13;
  listaBonos: any[] = [];
  modalVisible: boolean = false;
  bonoSeleccionado: any = null;


  constructor(private bonoService: UsuarioService,
    private http: HttpClient,
    private themeService: ThemeService) {

  }

  ngOnInit(): void {
    this.username = this.obtenerUsuario();

    if (this.username && this.username.trim() !== '') {
      this.obtenerBonos();
    }
  }

  get isDark(): boolean {
    return this.themeService.isDarkMode;
  }


  obtenerUsuario(): string {
    const userData = localStorage.getItem('user');

    try {
      if (userData) {
        if (userData.startsWith('{')) {
          const parsedUser = JSON.parse(userData);
          return parsedUser.username || '';
        } else {
          return userData;
        }
      }
    } catch (e) {
      console.error('Error al parsear el usuario desde localStorage:', e);
    }

    return '';
  }

  registrarBono() {

    if (!this.validarCampos()) {
      return;
    }

    const bonoConCliente = {
      ...this.bono,
      nombreCliente: this.username
    };
    console.log('bono al backend:', bonoConCliente);

    this.bonoService.registrarBono(bonoConCliente).subscribe({
      next: (respuesta) => {
        console.log('respuesta del back:', respuesta);
        this.bonoAgregadoId = respuesta.id || respuesta.nombre;

        this.obtenerBonos(() => {
          const totalBonosUsuario = this.listaBonosFiltrados.length;
          this.paginaActual = Math.ceil(totalBonosUsuario / this.tamanoPagina);

          setTimeout(() => {
            this.bonoAgregadoId = null;
          }, 800);
        });


        this.reiniciarFormulario();
      },
      error: (err) => {
        console.error('Error al registrar el bono:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al registrarse',
          text: 'Erro al relizar la petición, vuelvalo a intentar.'
        });
      }
    });
  }

  reiniciarFormulario() {
    this.bono = {
      nombre: '',
      montoNominal: '',
      plazoAnios: '',
      frecuenciaPago: 'anual',
      tipoTasa: 'efectiva',
      capitalizacion: 'anual',
      tipoTasaBase: 'efectiva',
      tasaBase: '',
      tipoMoneda: 'PEN',
      periodoGracia: '',
      tipoGracia: 'parcial'
    };
  }

  obtenerBonos(callback?: () => void) {


    this.bonoService.obtenerBonosPorUsuario(this.username).subscribe({
      next: (bonos) => {
        this.listaBonos = bonos;
        this.listaBonosFiltrados = bonos;
        console.log("bonos por usuario", bonos)

        if (callback) callback();
      },
      error: (err) => {
        console.error('Error al obtener los bonos del usuario:', err);
      }
    });
  }

  get listaBonosPaginados(): any[] {
    const ordenados = [...this.listaBonos].sort((a, b) => a.id - b.id); // ordena por ID ascendente
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    const fin = inicio + this.tamanoPagina;
    return ordenados.slice(inicio, fin);
  }


  get totalPaginas(): number {
    return Math.ceil(this.listaBonos.length / this.tamanoPagina);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  getDarkMode(): boolean {
    return localStorage.getItem('darkMode') === 'true';
  }

  validarCampos(): boolean {

    const camposRequeridos = [
      { campo: this.bono.nombre, nombre: 'Nombre del bono' },
      { campo: this.bono.montoNominal, nombre: 'Monto nominal' },
      { campo: this.bono.plazoAnios, nombre: 'Plazo (años)' },
      { campo: this.bono.tasaBase, nombre: 'Tasa base' },
      { campo: this.bono.periodoGracia, nombre: 'Periodo de gracia' }
    ];

    const camposVacios = camposRequeridos.filter(c => !c.campo || c.campo.toString().trim() === '');

    if (camposVacios.length > 0) {
      const nombres = camposVacios.map(c => `• ${c.nombre}`).join('<br>');


      Swal.fire({
        icon: 'warning',
        html: `Por favor completa los siguientes campos:<br><br>${nombres}`,
        confirmButtonText: 'Entendido',
        customClass: {
          popup: this.isDark ? 'swal-dark-high' : 'swal-high-popup',
          confirmButton: '',
          cancelButton: ''
        },
        buttonsStyling: false
      });

      return false;
    }

    return true;
  }

  abrirModal(bono: any): void {
    this.bonoSeleccionado = { ...bono };
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  guardarCambiosBono(actualizado: any): void {
    this.bonoService.actualizarBono(actualizado).subscribe({
      next: () => {
        this.cerrarModal();
        this.obtenerBonos();
        Swal.fire({
          icon: 'success',
          title: 'Bono actualizado',
          text: 'Los datos del bono se guardaron correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Error al actualizar el bono:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'Ocurrió un problema. Inténtalo nuevamente.',
        });
      }
    });
  }

  eliminarBono(bonoId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el bono permanentemente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#eb1212',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',

    }).then((result) => {
      if (result.isConfirmed) {
        this.bonoService.eliminarBono(bonoId).subscribe({
          next: () => {
            this.listaBonos = this.listaBonos.filter(b => b.id !== bonoId);
            this.listaBonosFiltrados = this.listaBonosFiltrados.filter(b => b.id !== bonoId);
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El bono ha sido eliminado correctamente.',
              timer: 1600,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error al eliminar el bono:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el bono. Intenta nuevamente.',
            });
          }
        });
      }
    });
  }
  
}
