import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';


@Component({
  selector: 'app-modal-detalles-bono',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './modal-detalles-bono.component.html',
  styleUrls: ['./modal-detalles-bono.component.scss']
})
export class ModalDetallesBonoComponent {


  @Input() bono: any;
  @Input() visible: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() abrirPagos = new EventEmitter<void>();

  estadoFavorito: boolean = false;
  estadoMeGusta: boolean = false;
  estadoVista: boolean = false;

  animFavorito: string = '';
  animMeGusta: string = '';
  animVista: string = '';

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
}
