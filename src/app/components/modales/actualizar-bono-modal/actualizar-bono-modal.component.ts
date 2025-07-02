import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  standalone: true,
  selector: 'app-actualizar-bono-modal',
  imports: [CommonModule, FormsModule, NzIconModule],
  templateUrl: './actualizar-bono-modal.component.html',
  styleUrl: './actualizar-bono-modal.component.scss'
})
export class ActualizarBonoModalComponent {

  @Input() bono: any = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() actualizar = new EventEmitter<any>();

  isClosing: boolean = false;


  emitirActualizacion() {
    this.actualizar.emit(this.bono);
  }
  


cerrarConAnimacion() {
  this.isClosing = true;
  setTimeout(() => {
      this.cerrar.emit();
    this.isClosing = false;
  }, 180); 
}


  

}
