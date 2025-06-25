import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { NzIconModule } from 'ng-zorro-antd/icon';


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
    tipoGracia: 'ninguna'
  };

  resultados: any = null;

  username: string = 'desconocido';

  listaBonosFiltrados: any[] = [];


  constructor(private bonoService: UsuarioService, private http: HttpClient) {

  }

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

  nuevaFilaAnimada = false;

  bonoAgregadoId: string | null = null;

  onSubmit() {
    const bonoConCliente = {
      ...this.bono,
      nombreCliente: this.username
    };
    console.log('bono al backend:', bonoConCliente);

    this.bonoService.registrarBono(bonoConCliente).subscribe({
      next: (respuesta) => {
        console.log('respuesta del back:', respuesta);
        this.bonoAgregadoId = respuesta.id || respuesta.nombre; 
        this.obtenerBonos();

        setTimeout(() => {
          this.bonoAgregadoId = null;
        }, 800);

        this.reiniciarFormulario();
      },
      error: (err) => {
        console.error('Error al registrar el bono:', err);
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
      tipoGracia: 'ninguna'
    };
  }

  listaBonos: any[] = [];

  obtenerBonos() {
    this.bonoService.listarBonos().subscribe({
      next: (bonos) => {
        this.listaBonos = bonos;
        this.listaBonosFiltrados = bonos.filter(b => b.nombreCliente === this.username);
      },
      error: (err) => {
        console.error('Error al obtener los bonos:', err);
      }
    });
  }

  paginaActual = 1;
  tamanoPagina = 10;

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

  
  
}
