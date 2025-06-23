import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-nuevo-bono',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nuevo-bono.component.html',
  styleUrl: './nuevo-bono.component.scss'
})
export class NuevoBonoComponent implements OnInit {
  bono = {
    nombre: '',
    montoNominal: 0,
    plazoAnios: 0,
    frecuenciaPago: 'anual',
    tipoTasa: 'efectiva',
    capitalizacion: 'anual', 
    tipoTasaBase: 'efectiva',
    tasaBase: 0,
    tipoMoneda: 'PEN',
    periodoGracia: 0,
    tipoGracia: 'ninguna'
  };

  resultados: any = null;
  tablaAmortizacion: any[] = [];

  constructor(private bonoService: UsuarioService, private http: HttpClient) {

  }

  ngOnInit(): void {
    this.verificarConexionBackend();
    this.obtenerBonos();

  }

  onSubmit() {
  console.log('📤 Enviando bono al backend:', this.bono);

  this.bonoService.registrarBono(this.bono).subscribe({
    next: (respuesta) => {
      console.log('Bono registrado:', respuesta);
      
      this.obtenerBonos();

      this.bono = {
        nombre: '',
        montoNominal: 0,
        plazoAnios: 0,
        frecuenciaPago: 'anual',
        tipoTasa: 'efectiva',
        capitalizacion: 'anual',
        tipoTasaBase: 'efectiva',
        tasaBase: 0,
        tipoMoneda: 'PEN',
        periodoGracia: 0,
        tipoGracia: 'ninguna'
      };
    },
    error: (err) => {
      console.error('Error al registrar el bono:', err);
      if (err.error) {
        console.error('error del backend:', err.error);
      }
    }
  });
}

  listaBonos: any[] = [];

  obtenerBonos() {
    this.bonoService.listarBonos().subscribe({
      next: (bonos) => {
        console.log('lista bonos :', bonos);
        this.listaBonos = bonos;

      },
      error: (err) => {
        console.error('Error al obtener los bonos:', err);
      }
    });
  }


  verificarConexionBackend() {
    this.http.get(`${environment.apiUrl}/api/bonos/ping`, { responseType: 'text' }).subscribe({
      next: (res) => console.log(' Backend conectado:', res),
      error: (err) => console.error(' No se pudo conectar al backend:', err)
    });
  }

}
