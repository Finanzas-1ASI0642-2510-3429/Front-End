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
  registerUsername = '';
  registerPassword = '';
  selectedRole = '';
  recordarme = false;
  usernameValido: boolean | null = null;
  usernameErrorMensaje: string = '';
  passwordValido: boolean | null = null;
  firstName = '';
  lastName = '';
  email = '';
  street = '';
  number = '';
  city = '';
  postalCode = '';
  country = '';

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
    this.registerUsername = '';
    this.registerPassword = '';
    this.selectedRole = '';
    this.usernameValido = null;
    this.usernameErrorMensaje = '';
    this.passwordValido = null;
    this.passwordErrorMensajes = [];
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.street = '';
    this.number = '';
    this.city = '';
    this.postalCode = '';
    this.country = '';
    this.firstNameValido = null;
    this.lastNameValido = null;
    this.emailValido = null;

    setTimeout(() => this.movDer = true, 800);
  }

  transicionRegister() {
    this.isActive = true;
    this.movIzq = false;
    this.movDer = false;

    if (!this.recordarme) {
      this.username = '';
      this.password = '';
    }

    setTimeout(() => this.movIzq = true, 800);
  }

  mensajeBienvenida = '';
  mostrarBienvenida = false;
  mostrarErrorLogin = false;
  mostrandoPreloader = false;

  login() {
    if (!this.username || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor ingresa tu usuario y contraseña.'
      });
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

        this.mensajeBienvenida = `¡Bienvenido, <strong>${this.username}</strong>!`;
        this.mostrarBienvenida = true;

        setTimeout(() => {
          this.mostrandoPreloader = true;

          setTimeout(() => {
            this.router.navigate(['/nuevo-bono']);
          }, 1000);
        }, 1500);
      },
      error: () => {
        this.mostrarErrorLogin = true;
        setTimeout(() => {
          this.mostrarErrorLogin = false;
        }, 1000);
      }
    });
  }


  seleccionarRol(rol: string): void {
    this.selectedRole = this.selectedRole === rol ? '' : rol;
  }

  camposVacios(): boolean {
    return !this.registerUsername ||
      !this.registerPassword ||
      !this.selectedRole ||
      !this.firstName ||
      !this.lastName ||
      !this.email;
  }

  register() {
    if (this.camposVacios()) {
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
      roles: [this.selectedRole],
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      street: this.street,
      number: this.number,
      city: this.city,
      postalCode: this.postalCode,
      country: this.country
    };

    console.log('Payload enviado al backend para el registro:', payload);

    this.loginService.signUp(payload).subscribe({
      next: (res) => {
        Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text: 'Ahora puedes iniciar sesión.'
        });

        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.street = '';
        this.number = '';
        this.city = '';
        this.postalCode = '';
        this.country = '';
        this.registerUsername = '';
        this.registerPassword = '';
        this.selectedRole = '';
        this.transicionLogin();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrarse',
          text: 'Erro al relizar la petición, vuelvalo a intentar.'
        });
        console.error('Error al registrarse:', err);
      }
    });
  }

  passwordErrorMensajes: string[] = [];

  firstNameValido: boolean | null = null;
  lastNameValido: boolean | null = null;

  validarNombre(campo: 'firstName'): void {
    const valor = this[campo];
    const regexSoloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]*$/;

    if (valor === '') {
      this[`${campo}Valido`] = null;
      return;
    }

    this[`${campo}Valido`] = regexSoloLetras.test(valor);
  }

  validarApellido(campo: 'lastName'): void {
    const valor = this[campo];
    const regexSoloLetras = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]*$/;

    if (valor === '') {
      this[`${campo}Valido`] = null;
      return;
    }

    this[`${campo}Valido`] = regexSoloLetras.test(valor);
  }

  emailValido: boolean | null = null;

  validarEmail(): void {
    const regexEmail = /^[^@]+@[^@]+\.[^@]+$/;

    if (this.email === '') {
      this.emailValido = null;
      return;
    }

    this.emailValido = regexEmail.test(this.email);
  }


  validarPassword(): void {
    const pass = this.registerPassword;
    const user = this.registerUsername;
    this.passwordErrorMensajes = [];

    if (pass.length === 0) {
      this.passwordValido = null;
      return;
    }

    if (pass.length < 6) this.passwordErrorMensajes.push('Mínimo 6 caracteres');
    if (!/[A-Za-z]/.test(pass)) this.passwordErrorMensajes.push('Debe contener al menos una letra');
    if (!/\d/.test(pass)) this.passwordErrorMensajes.push('Debe contener al menos un número');
    if (!/[!@#$%^&*]/.test(pass)) this.passwordErrorMensajes.push('Debe incluir un carácter especial');
    if (/(123456|password|admin)/i.test(pass)) this.passwordErrorMensajes.push('No uses contraseñas comunes');
    if (pass === user) this.passwordErrorMensajes.push('No debe ser igual al nombre de usuario');

    this.passwordValido = this.passwordErrorMensajes.length === 0;
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



