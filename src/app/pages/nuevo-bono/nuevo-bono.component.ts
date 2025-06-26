import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { NzIconModule } from 'ng-zorro-antd/icon';
import Swal from 'sweetalert2';
import { ThemeService } from '../../services/theme.service';


@Component({
  selector: 'app-nuevo-bono',
  standalone: true,
  imports: [FormsModule, CommonModule, NzIconModule],
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
  username: string = 'desconocido';
  listaBonosFiltrados: any[] = [];
  nuevaFilaAnimada = false;
  bonoAgregadoId: string | null = null;
  paginaActual = 1;
  tamanoPagina = 13;
  listaBonos: any[] = [];

  constructor(private bonoService: UsuarioService,
    private http: HttpClient,
    private themeService: ThemeService) {

  }

  ngOnInit(): void {
    this.obtenerBonos();
    this.obtenerUsuario();
  }

  get isDark(): boolean {
    return this.themeService.isDarkMode;
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
    this.bonoService.listarBonos().subscribe({
      next: (bonos) => {
        this.listaBonos = bonos;
        this.listaBonosFiltrados = bonos.filter(b => b.nombreCliente === this.username);

        if (callback) callback();
      },
      error: (err) => {
        console.error('Error al obtener los bonos:', err);
      }
    });
  }

  get listaBonosPaginados(): any[] {
    const filtrados = this.listaBonos.filter(b => b.nombreCliente === this.username);
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    const fin = inicio + this.tamanoPagina;
    return filtrados.slice(inicio, fin);
  }

  get totalPaginas(): number {
    const totalFiltrados = this.listaBonos.filter(b => b.nombreCliente === this.username).length;
    return Math.ceil(totalFiltrados / this.tamanoPagina);
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

}
