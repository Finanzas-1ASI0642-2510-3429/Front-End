import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-modal-detalles-bono',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './modal-detalles-bono.component.html',
  styleUrls: ['./modal-detalles-bono.component.scss']
})
export class ModalDetallesBonoComponent {


  @Input() bono: any;
  @Output() cerrar = new EventEmitter<void>();
  @Output() abrirPagos = new EventEmitter<void>();

  estadoFavorito: boolean = false;
  estadoMeGusta: boolean = false;
  estadoVista: boolean = false;

  animFavorito: string = '';
  animMeGusta: string = '';
  animVista: string = '';

  indicadores: any = null;


  constructor(private usuarioService: UsuarioService) { }

  visibleInterno: boolean = false;

  private _visible: boolean = false;

  @Input() set visible(value: boolean) {
    if (value) {
      this.visibleInterno = true;
      setTimeout(() => {
        this._visible = true;

        if (this.bono?.id) {
          this.usuarioService.obtenerIndicadoresFinancieros(this.bono.id).subscribe({
            next: (data) => {
              console.log('Indicadores recibidos:', data); 
              this.indicadores = data;
            },
            error: (err) => console.error('Error al obtener indicadores:', err)
          });

        }

      }, 10);
    } else {
      this._visible = false;
      setTimeout(() => this.visibleInterno = false, 300);
    }
  }

  get visible(): boolean {
    return this._visible;
  }

  ngOnChanges(): void {
    if (this.visible && this.bono?.id) {
      this.indicadores = null;
      this.usuarioService.obtenerIndicadoresFinancieros(this.bono.id).subscribe({
        next: (data) => this.indicadores = data,
        error: (err) => console.error('Error al obtener indicadores:', err)
      });
    }
  }


  getCapitalizacion(): string {
    return this.bono?.tipoTasa?.toLowerCase() === 'efectiva' ? 'No aplica' : this.bono?.capitalizacion;
  }


  toggleFavorito() {
    if (this.estadoFavorito) {
      this.animFavorito = 'desactivando';
    } else {
      this.animFavorito = 'activando';
    }
    this.estadoFavorito = !this.estadoFavorito;
    setTimeout(() => this.animFavorito = '', 400);
  }

  toggleMeGusta() {
    if (this.estadoMeGusta) {
      this.animMeGusta = 'desactivando';
    } else {
      this.animMeGusta = 'activando';
    }
    this.estadoMeGusta = !this.estadoMeGusta;
    setTimeout(() => this.animMeGusta = '', 400);
  }

  toggleVista() {
    if (this.estadoVista) {
      this.animVista = 'desactivando';
    } else {
      this.animVista = 'activando';
    }
    this.estadoVista = !this.estadoVista;
    setTimeout(() => this.animVista = '', 400);
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  abrirModalPagos() {
    this.abrirPagos.emit();
  }

  progresoPorcentaje: number = 0;
  intervaloProgreso: any = null;
  duracionHold = 2000;
  paso = 100;

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

  cancelarProgreso() {
    clearInterval(this.intervaloProgreso);
    this.progresoPorcentaje = 0;
  }

  confirmarInversion() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas invertir en el bono ${this.bono.nombre} con un valor nominal de S/ ${this.bono.montoNominal}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, invertir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire({
          icon: 'success',
          title: 'Inversión exitosa',
          text: `Has adquirido correctamente el bono ${this.bono.nombre}.`,
          timer: 2500,
          showConfirmButton: false
        });

      } else {
        this.cancelarProgreso();
      }
    });
  }


}
