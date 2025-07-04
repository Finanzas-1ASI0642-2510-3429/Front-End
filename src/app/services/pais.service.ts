import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaisService {
  constructor(private http: HttpClient) {}

  obtenerPaises(): Observable<any[]> {
    return this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name,flags');
  }
}
