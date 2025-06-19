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

  animarEntrada = false;
  showModalPassword = false;

  constructor(private router: Router,
  ) { }

  ngOnInit(): void {
    this.animarEntrada = true;   
    this.movDer = true;
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

    this.router.navigate(['/nuevo-bono']);
  };

  showResetForm = false;

  activarReset(): void {
    this.showResetForm = true;
  }

  cerrarReset(event: Event): void {
    this.showResetForm = false;
  }


}



