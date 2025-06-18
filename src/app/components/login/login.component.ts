import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  isActive: boolean = false;
  email: string = '';
  contrasenia: string = '';
  nombre: string = '';


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

}



