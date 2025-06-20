import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ModalRecuperarPasswordComponent } from '../modales/modal-recuperar-password/modal-recuperar-password.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core'; // <-- Agrega esto arriba


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, NzIconModule, ModalRecuperarPasswordComponent, NzFloatButtonModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

  isActive = false;
  movIzq = false;
  movDer = false;

  animarEntrada = false;
  showModalPassword = false;

  constructor(private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.animarEntrada = true;
    this.movDer = true;
  
    const idiomaGuardado = localStorage.getItem('idioma');
    const idioma = idiomaGuardado ? idiomaGuardado.toUpperCase() : 'ES';
  
    this.idiomaActual = idioma;
    this.translate.use(idioma.toLowerCase()); // Aplicar traducción
    this.actualizarOpciones(false); // Ocultar el botón duplicado
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
  openChange(status: boolean): void {
    console.log(status);
  }


  idiomaActual = 'ES';
  idiomasAbierto = false;
  mostrarEN = false;
  mostrarPT = false;
  mostrarES = false;

  toggleIdiomas(): void {
    this.idiomasAbierto = !this.idiomasAbierto;
    this.actualizarOpciones(this.idiomasAbierto);
  }
  
  actualizarOpciones(valor: boolean): void {
    this.mostrarEN = valor;
    this.mostrarPT = valor;
    this.mostrarES = valor;
  
    if (this.idiomaActual === 'EN') this.mostrarEN = false;
    if (this.idiomaActual === 'PT') this.mostrarPT = false;
    if (this.idiomaActual === 'ES') this.mostrarES = false;
  }
  
  cambiarIdioma(idioma: string): void {
    this.idiomaActual = idioma.toUpperCase();
    const lang = idioma.toLowerCase();
  
    localStorage.setItem('idioma', lang);
    this.translate.use(lang);
  
    this.idiomasAbierto = false;
    this.actualizarOpciones(false);
  }


}



