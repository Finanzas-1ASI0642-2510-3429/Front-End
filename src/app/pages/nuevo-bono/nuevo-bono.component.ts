import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nuevo-bono',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nuevo-bono.component.html',
  styleUrl: './nuevo-bono.component.scss'
})
export class NuevoBonoComponent {
  bono = {
    nombreBono: '',
    montoNominal: 0,
    plazo: 0,
    frecuenciaPago: 'anual',
    tasaInteres: 0,
    tasaInteresTipo: 'efectiva',  // 'efectiva' o 'nominal'
    capitalizacion: 0,
    fechaEmision: '',
    plazosGracia: 'parcial',
  };

  resultados: any = null;
  tablaAmortizacion: any[] = [];
  constructor() { }
  onSubmit() {
    // Aquí calculas los valores y la tabla de amortización
    this.calcularResultados();
  }

  calcularResultados() {
    // Simulación de resultados
    this.resultados = {
      tcea: 8.5,
      trea: 7.2,
      convexidad: 5.3,
      duracion: 4.1,
      duracionModificada: 3.6,
      precioMaximo: 950
    };

    // Simulación de tabla de amortización
    this.tablaAmortizacion = this.generarTablaAmortizacion();
  }

  generarTablaAmortizacion() {
    // Genera una tabla de amortización ficticia para demostración
    let tabla: any[] = [];
    let saldo = this.bono.montoNominal;
    let interes: number, amortizacion: number, pago: number;

    for (let i = 1; i <= this.bono.plazo; i++) {
      interes = saldo * 0.05; // Suponiendo un 5% de interés anual
      amortizacion = (this.bono.montoNominal / this.bono.plazo);
      pago = interes + amortizacion;
      saldo -= amortizacion;

      tabla.push({
        periodo: i,
        pago: pago.toFixed(2),
        interes: interes.toFixed(2),
        amortizacion: amortizacion.toFixed(2),
        saldo: saldo.toFixed(2)
      });
    }

    return tabla;
  }
}
