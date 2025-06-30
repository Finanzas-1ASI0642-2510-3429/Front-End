import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-detalles-bono',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detalles-bono.component.html',
  styleUrls: ['./modal-detalles-bono.component.scss']
})
export class ModalDetallesBonoComponent {

  
  @Input() bono: any;
  @Input() visible: boolean = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() abrirPagos = new EventEmitter<void>();

  

  cerrarModal() {
    this.cerrar.emit();
  }

  

  abrirModalPagos() {
    this.abrirPagos.emit();
  }
}
