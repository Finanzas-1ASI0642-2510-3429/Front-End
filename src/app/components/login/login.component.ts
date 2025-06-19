import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ModalRecuperarPasswordComponent } from '../modales/modal-recuperar-password/modal-recuperar-password.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule, ModalRecuperarPasswordComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit{

  isActive = false;
  movIzq = false;
  movDer = false;  
  email: string = '';
  contrasenia: string = '';
  nombre: string = '';
  animarEntrada = false;
  showModalPassword = false;
  recordarme: boolean = false;

  constructor(private router: Router,
  ) { }

  ngOnInit(): void {
    this.animarEntrada = true;   
    this.movDer = true;

    const recordarEmail = localStorage.getItem('savedEmail');
    const recordarPassword = localStorage.getItem('savedPassword');
    const recordarFlag = localStorage.getItem('rememberMe');

    if (recordarFlag === 'true') {
      this.recordarme = true;
      this.email = recordarEmail ?? '';
      this.contrasenia = recordarPassword ?? '';
    }
  }

  transicionLogin() {
    this.isActive = false;
    this.movDer = false;
    this.movIzq = false;
    setTimeout(() => this.movDer = true, 800); 
  }
  
  transicionRegister() {
    this.isActive = true;
    this.movIzq = false;
    this.movDer = false;
    setTimeout(() => this.movIzq = true, 800); 
  }

  login() {

    if (!this.email || !this.contrasenia) return;

    if (this.recordarme) {
      localStorage.setItem('savedEmail', this.email);
      localStorage.setItem('savedPassword', this.contrasenia);
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('savedEmail');
      localStorage.removeItem('savedPassword');
      localStorage.removeItem('rememberMe');
    }
    this.router.navigate(['/welcome']);
  };

  showResetForm = false;

  activarReset(): void {
    this.showResetForm = true;
  }

  cerrarReset(event: Event): void {
    this.showResetForm = false;
  }


}



