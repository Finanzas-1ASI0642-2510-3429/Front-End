import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-configuracion',
    standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.scss'
})
export class ConfiguracionComponent {
 config = {
    moneda: 'PEN',
    tipoTasa: 'efectiva',
    capitalizacion: 'mensual'
  };

  guardarConfiguracion() {
    console.log('Configuración guardada:', this.config);
    // Aquí podrías guardar en localStorage, backend, etc.
  }
}

