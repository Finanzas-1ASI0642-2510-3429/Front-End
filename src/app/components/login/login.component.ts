import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzFloatButtonModule } from 'ng-zorro-antd/float-button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ModalRecuperarPasswordComponent } from '../modales/modal-recuperar-password/modal-recuperar-password.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';



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
  mostrarMensajeQC = false;
  animarEntrada = false;
  showModalPassword = false;
  username = '';
  password = '';
  errorMessage = '';
  registerUsername = '';
  registerPassword = '';
  selectedRole = '';
  recordarme = false;

  constructor(private router: Router,
    private translate: TranslateService,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.animarEntrada = true;
    this.movDer = true;

    const recordarmeGuardado = localStorage.getItem('recordarme');
    if (recordarmeGuardado === 'true') {
      this.recordarme = true;
      this.username = localStorage.getItem('recordarme_username') || '';
      this.password = localStorage.getItem('recordarme_password') || '';
    }

    const idiomaGuardado = localStorage.getItem('idioma');
    const idioma = idiomaGuardado ? idiomaGuardado.toUpperCase() : 'ES';

    this.idiomaActual = idioma;
    this.translate.use(idioma.toLowerCase());
    this.actualizarOpciones(false);

    if (this.idiomaActual === 'QC') {
      this.mostrarMensajeQC = true;
      setTimeout(() => {
        this.mensajeDesapareciendo = true;
        setTimeout(() => {
          this.mostrarMensajeQC = false;
          this.mensajeDesapareciendo = false;
        }, 400);
      }, 3000);
    }
  }

  onRecordarmeChange(): void {
    if (this.recordarme) {
      localStorage.setItem('recordarme', 'true');
      localStorage.setItem('recordarme_username', this.username);
      localStorage.setItem('recordarme_password', this.password);
    } else {
      localStorage.removeItem('recordarme');
      localStorage.removeItem('recordarme_username');
      localStorage.removeItem('recordarme_password');
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
    if (!this.username || !this.password) {
      this.errorMessage = 'Usuario y contraseña son obligatorios';
      return;
    }

    if (this.recordarme) {
      localStorage.setItem('recordarme', 'true');
      localStorage.setItem('recordarme_username', this.username);
      localStorage.setItem('recordarme_password', this.password);
    }

    this.loginService.signIn({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.loginService.saveToken(res.token);

        localStorage.setItem('user', this.username);

        this.router.navigate(['/nuevo-bono']);
      },
      error: (err) => {
        this.errorMessage = 'Usuario o contraseña incorrectos';
        console.error('Error login', err);
      }
    });
  }


  seleccionarRol(rol: string): void {
    this.selectedRole = this.selectedRole === rol ? '' : rol;
  }

  register() {
    if (!this.registerUsername || !this.registerPassword || !this.selectedRole) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor completa todos los campos.'
      });
      return;
    }

    const payload = {
      username: this.registerUsername,
      password: this.registerPassword,
      roles: [this.selectedRole]
    };

    this.loginService.signUp(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Ahora puedes iniciar sesión.'
        });

        this.registerUsername = '';
        this.registerPassword = '';
        this.selectedRole = '';
        this.transicionLogin();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrarse',
          text: 'El nombre ya se encunetra registrado.'
        });
        console.error('Error al registrarse:', err);
      }
    });
  }
  usernameValido: boolean | null = null;
  usernameErrorMensaje: string = '';
  passwordValido: boolean | null = null;

  validarPassword(): void {
    const pass = this.registerPassword;
    const user = this.registerUsername;

    const tieneLongitud = pass.length >= 6;
    const tieneLetra = /[A-Za-z]/.test(pass);
    const tieneNumero = /\d/.test(pass);
    const tieneEspecial = /[!@#$%^&*]/.test(pass);
    const noComun = !/(123456|password|admin)/i.test(pass);
    const noIgualUser = pass !== user;

    if (pass.length === 0) {
      this.passwordValido = null; // Oculta los íconos si está vacío
      return;
    }

    this.passwordValido = tieneLongitud && tieneLetra && tieneNumero && tieneEspecial && noComun && noIgualUser;
  }

  validarUsername(): void {
    const u = this.registerUsername || '';

    if (u.length === 0) {
      this.usernameValido = null;
      this.usernameErrorMensaje = '';
      return;
    }
    if (u.includes(' ')) {
      this.usernameValido = false;
      this.usernameErrorMensaje = 'No se permiten espacios';
      return;
    }
    if (u.length < 4) {
      this.usernameValido = false;
      this.usernameErrorMensaje = 'Mínimo 4 caracteres';
      return;
    }
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(u)) {
      this.usernameValido = false;
      this.usernameErrorMensaje = 'Solo letras, números y guiones';
      return;
    }
    // si llegó hasta aquí, es válido
    this.usernameValido = true;
    this.usernameErrorMensaje = '';
  }

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
  mostrarQC = false;
  mensajeDesapareciendo = false;

  toggleIdiomas(): void {
    this.idiomasAbierto = !this.idiomasAbierto;
    this.actualizarOpciones(this.idiomasAbierto);
  }

  actualizarOpciones(valor: boolean): void {
    this.mostrarEN = valor;
    this.mostrarPT = valor;
    this.mostrarES = valor;
    this.mostrarQC = valor;

    if (this.idiomaActual === 'EN') this.mostrarEN = false;
    if (this.idiomaActual === 'PT') this.mostrarPT = false;
    if (this.idiomaActual === 'ES') this.mostrarES = false;
    if (this.idiomaActual === 'QC') this.mostrarQC = false;
  }

  cambiarIdioma(idioma: string): void {
    this.idiomaActual = idioma.toUpperCase();
    const lang = idioma.toLowerCase();

    localStorage.setItem('idioma', lang);
    this.translate.use(lang);

    this.idiomasAbierto = false;
    this.actualizarOpciones(false);

    if (this.idiomaActual === 'QC') {
      this.mostrarMensajeQC = true;
      this.mensajeDesapareciendo = false;

      setTimeout(() => {
        this.mensajeDesapareciendo = true;
        setTimeout(() => {
          this.mostrarMensajeQC = false;
          this.mensajeDesapareciendo = false;
        }, 400);
      }, 3000);
    }
  }


}



