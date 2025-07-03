import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { ThemeService } from './services/theme.service';

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
  mostrarDropdown: boolean = false;

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {
  }

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      this.mostrarDropdown &&
      this.dropdownRef &&
      !this.dropdownRef.nativeElement.contains(event.target)
    ) {
      this.mostrarDropdown = false;
    }
  }

  ngOnInit(): void {
    this.esOscuro = this.themeService.isDarkMode;
    this.themeService.setDarkMode(this.esOscuro);

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
    this.mostrarDropdown = false;

  }

  toggleTheme(isChecked: boolean): void {
    this.esOscuro = isChecked;
    this.themeService.setDarkMode(isChecked);
  }


  abrirPerfil() {
    console.log('Abrir perfil');
    this.mostrarDropdown = false;
  }


  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }


}


