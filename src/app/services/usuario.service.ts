import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarios: any[] = [];

  private baseUrl = `${environment.apiUrl}/api/bonos`;

  constructor(private http: HttpClient) { }

  registrarBono(bono: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/registrar`, bono); 
}

  listarBonos(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
