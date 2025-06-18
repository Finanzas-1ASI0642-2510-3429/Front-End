import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ModalRecuperarPasswordComponent } from './modales/modal-recuperar-password/modal-recuperar-password.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule, ModalRecuperarPasswordComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  isActive: boolean = false;
  email: string = '';
  contrasenia: string = '';
  nombre: string = '';

  showModalRecuperar = false;

  constructor(private router: Router,
  ) { }

  transicionRegister() {
    this.isActive = true;
  }

  transicionLogin() {
    this.isActive = false;
  }

  login() {

    if (!this.email || !this.contrasenia) {
      return;
    }
    this.router.navigate(['/welcome']);
  };

  showResetForm = false;

activarReset(): void {
  this.showResetForm = true;
}

cerrarReset(event: Event): void {
  event.preventDefault();
  this.showResetForm = false;
}


}



