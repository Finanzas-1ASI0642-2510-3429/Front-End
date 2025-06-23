import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = `${environment.LoginApiUrl}`;

  constructor(private http: HttpClient) {}

  signIn(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/sign-in`, credentials);
  }

  signUp(data: { username: string; password: string; roles: string[] }): Observable<any> {
    return this.http.post(`${this.baseUrl}/sign-up`, data);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

}
