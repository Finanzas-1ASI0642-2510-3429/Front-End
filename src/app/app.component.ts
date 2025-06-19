import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { CommonModule } from '@angular/common';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet, NzIconModule, NzLayoutModule, NzMenuModule, CommonModule, NzSwitchModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isCollapsed = false;
  esOscuro = false;


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


  isLoginPage(): boolean {
    return this.router.url === '/login' || this.router.url === '/';
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  toggleTheme(isChecked: boolean): void {
    this.esOscuro = isChecked;

    document.body.classList.toggle('dark-mode', this.esOscuro);
    localStorage.setItem('darkMode', JSON.stringify(this.esOscuro));
  }

}


