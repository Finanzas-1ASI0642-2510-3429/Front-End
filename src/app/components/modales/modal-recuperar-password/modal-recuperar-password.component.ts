import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-recuperar-password',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule], 
  templateUrl: './modal-recuperar-password.component.html',
  styleUrls: ['./modal-recuperar-password.component.scss']
})
export class ModalRecuperarPasswordComponent {
  email = '';
  @Output() cerrar = new EventEmitter<void>();

  constructor(public translate: TranslateService) {} 

  enviarReset() {
    this.cerrar.emit();
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
