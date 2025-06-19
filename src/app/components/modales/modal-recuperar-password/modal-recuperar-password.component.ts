import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-recuperar-password.component.html',
  styleUrls: ['./modal-recuperar-password.component.scss']
})
export class ModalRecuperarPasswordComponent {
  email = '';
  @Output() cerrar = new EventEmitter<void>();

  enviarReset() {
    this.cerrar.emit();
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
