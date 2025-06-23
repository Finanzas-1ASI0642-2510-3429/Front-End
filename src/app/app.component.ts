import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd  } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, CommonModule, NzSwitchModule, FormsModule, NzAvatarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isCollapsed = false;
  esOscuro = false;
  usuarioNombre = '';
  usuarioInicial = '';

  constructor(
    private router: Router,

  ) {
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      this.esOscuro = JSON.parse(savedTheme);
      this.loadTheme();
    }

     this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.actualizarUsuarioDesdeStorage();
      }
    });

    this.actualizarUsuarioDesdeStorage();
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('darkMode');

    if (savedTheme !== null) {
      this.esOscuro = JSON.parse(savedTheme);

      if (this.esOscuro) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }

    console.log("Modo oscuro cargado:", this.esOscuro);
  }

  actualizarUsuarioDesdeStorage(): void {
    const nombre = localStorage.getItem('user');
    if (nombre) {
      this.usuarioNombre = nombre;
      this.usuarioInicial = nombre.charAt(0).toUpperCase();
    } else {
      this.usuarioNombre = '';
      this.usuarioInicial = '';
    }
  }


  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }

  logout(): void {
    this.router.navigate(['/login']);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  toggleTheme(isChecked: boolean): void {
    this.esOscuro = isChecked;

    document.body.classList.toggle('dark-mode', this.esOscuro);
    localStorage.setItem('darkMode', JSON.stringify(this.esOscuro));
  }

}


