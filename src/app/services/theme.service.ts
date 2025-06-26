import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.getInitialTheme());
  darkMode$ = this.darkModeSubject.asObservable();

  setDarkMode(isDark: boolean) {
    this.darkModeSubject.next(isDark);
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    document.body.classList.toggle('dark-mode', isDark);
  }

  get isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  }
}
