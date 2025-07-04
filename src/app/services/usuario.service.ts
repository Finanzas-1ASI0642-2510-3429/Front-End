import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarios: any[] = [];

  private baseUrl = `${environment.apiUrl}/api/bonos`;

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  registrarBono(bono: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/registrar`, bono, { headers });
  }

  listarBonos(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.baseUrl, { headers });
  }

  obtenerBonosPorUsuario(nombreCliente: string): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/cliente/${nombreCliente}`, { headers });
  }

  actualizarBono(bono: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.baseUrl}/actualizarBono/${bono.id}`, bono, { headers });
  }

  eliminarBono(bonoId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/eliminarBono/${bonoId}`, { headers });
  }

  obtenerIndicadoresFinancieros(bonoId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.baseUrl}/${bonoId}/indicadores`, { headers });
  }

  actualizarEstadoInvertido(bonoId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${bonoId}/invertir`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarEstadoDesinvertido(bonoId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${bonoId}/desinvertir`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  actualizarPrecioCompra(bonoId: number, precioCompra: number): Observable<any> {
    const body = { precioCompra };
    return this.http.patch(`${this.baseUrl}/${bonoId}/precio-compra`, body, {
      headers: this.getAuthHeaders()
    });
  }

  getUserByUsername(username: string): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get<any>(`${environment.apiUrl}/api/v1/users/username/${username}`, { headers });
}
  

  getProfileById(profileId: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.get<any>(`${environment.apiUrl}/api/v1/profiles/${profileId}`, { headers });
}




}
