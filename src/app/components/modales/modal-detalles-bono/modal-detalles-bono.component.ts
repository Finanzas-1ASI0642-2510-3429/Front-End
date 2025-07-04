import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-detalles-bono',
  standalone: true,
  imports: [CommonModule, NzIconModule, FormsModule],
  templateUrl: './modal-detalles-bono.component.html',
  styleUrls: ['./modal-detalles-bono.component.scss']
})
export class ModalDetallesBonoComponent implements OnChanges {

  @Input() bono: any;
  @Output() cerrar = new EventEmitter<void>();
  @Output() abrirPagos = new EventEmitter<void>();
  @Output() bonoInvertido = new EventEmitter<void>();

  indicadores: any = null;
  precioCompra: number = 0;
  errorPrecioCompra: boolean = false;

  estadoFavorito = false;
  estadoMeGusta = false;
  estadoVista = false;

  animFavorito = '';
  animMeGusta = '';
  animVista = '';

  progresoPorcentaje: number = 0;
  intervaloProgreso: any = null;
  duracionHold = 2000;
  paso = 100;

  visibleInterno: boolean = false;
  private _visible: boolean = false;

  @Input() set visible(value: boolean) {
    if (value) {
      this.visibleInterno = true;
      setTimeout(() => {
        this._visible = true;
        this.precioCompra = this.bono?.precioCompra || 0;
        this.cargarIndicadores();
      }, 10);
    } else {
      this._visible = false;
      setTimeout(() => this.visibleInterno = false, 300);
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  constructor(private usuarioService: UsuarioService) { }

  ngOnChanges(): void {
    if (this.visible && this.bono?.id) {
      this.precioCompra = this.bono.precioCompra || 0;
      this.cargarIndicadores();
    }
  }

  cargarIndicadores() {
    if (!this.bono?.id) return;
    this.indicadores = null;
    this.usuarioService.obtenerIndicadoresFinancieros(this.bono.id).subscribe({
      next: (data) => this.indicadores = data,
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo obtener los indicadores financieros.',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  validarYEnviarPrecioCompra() {
    const min = this.bono.montoNominal * 0.95;
    const max = this.bono.montoNominal * 1.05;

    if (this.precioCompra < min || this.precioCompra > max) {
      this.errorPrecioCompra = true;
      return;
    }

    this.errorPrecioCompra = false;

    this.usuarioService.actualizarPrecioCompra(this.bono.id, this.precioCompra).subscribe({
      next: () => {
        this.bono.precioCompra = this.precioCompra;
        this.cargarIndicadores();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo actualizar el precio de compra.', 'error');
      }
    });
  }

  getCapitalizacion(): string {
    return this.bono?.tipoTasa?.toLowerCase() === 'efectiva' ? 'No aplica' : this.bono?.capitalizacion;
  }

  esTasaExcluida(): boolean {
    const tipo = this.bono?.tipoTasaBase?.toUpperCase();
    return tipo === 'TEA' || tipo === 'TES' || tipo === 'TEM';
  }

  toggleFavorito() {
    this.animFavorito = this.estadoFavorito ? 'desactivando' : 'activando';
    this.estadoFavorito = !this.estadoFavorito;
    setTimeout(() => this.animFavorito = '', 400);
  }

  toggleMeGusta() {
    this.animMeGusta = this.estadoMeGusta ? 'desactivando' : 'activando';
    this.estadoMeGusta = !this.estadoMeGusta;
    setTimeout(() => this.animMeGusta = '', 400);
  }

  toggleVista() {
    this.animVista = this.estadoVista ? 'desactivando' : 'activando';
    this.estadoVista = !this.estadoVista;
    setTimeout(() => this.animVista = '', 400);
  }

  cerrarModal() {
    this.cerrar.emit();
    this.errorPrecioCompra = false;
  }

  abrirModalPagos() {
    this.abrirPagos.emit();
  }

  iniciarProgreso() {
    this.progresoPorcentaje = 0;
    const incremento = this.paso / this.duracionHold * 100;

    this.intervaloProgreso = setInterval(() => {
      this.progresoPorcentaje += incremento;
      if (this.progresoPorcentaje >= 100) {
        this.progresoPorcentaje = 100;
        clearInterval(this.intervaloProgreso);
        this.confirmarInversion();
      }
    }, this.paso);
  }

  verificarYIniciarInversion() {
    const min = this.bono.montoNominal * 0.95;
    const max = this.bono.montoNominal * 1.05;
  
    if (!this.precioCompra || this.precioCompra < min || this.precioCompra > max) {
      Swal.fire({
        icon: 'warning',
        title: 'Precio inválido',
        text: `Ingrese un precio de compra entre S/ ${min.toFixed(2)} y S/ ${max.toFixed(2)} antes de invertir.`,
        confirmButtonText: 'Entendido'
      });
      return;
    }
  
    if (!this.indicadores?.trea) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan indicadores',
        text: 'Debe calcular la TREA ingresando un precio de compra válido antes de invertir.',
        confirmButtonText: 'Entendido'
      });
      return;
    }
  
    this.iniciarProgreso();
  }
  

  cancelarProgreso() {
    clearInterval(this.intervaloProgreso);
    this.progresoPorcentaje = 0;
  }

  confirmarInversion() {
    const usuario = localStorage.getItem('user');
  
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas invertir en el bono ${this.bono.nombre} con un valor nominal de S/ ${this.bono.montoNominal}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, invertir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.actualizarEstadoInvertido(this.bono.id, usuario!).subscribe({
          next: (respuesta) => {
            Swal.fire({
              icon: 'success',
              title: 'Inversión exitosa',
              text: `Has adquirido correctamente el bono ${this.bono.nombre}.`,
              timer: 2500,
              showConfirmButton: false
            }).then(() => {
              this.bono.estadoInvertido = respuesta.estadoInvertido;
              this.bono.usuarioInversor = respuesta.usuarioInversor;
              this.bonoInvertido.emit();
              this.cerrarModal();
            });
          },
          error: () => {
            Swal.fire('Error', 'No se pudo invertir en el bono', 'error');
            this.cancelarProgreso();
          }
        });
      }
    });
  }
  

}
