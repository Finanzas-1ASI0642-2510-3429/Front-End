import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-actualizar-bono-modal',
  imports: [CommonModule, FormsModule, NzIconModule],
  templateUrl: './actualizar-bono-modal.component.html',
  styleUrl: './actualizar-bono-modal.component.scss'
})
export class ActualizarBonoModalComponent implements OnInit {

  @Input() bono: any = null;
  @Output() cerrar = new EventEmitter<void>();
  @Output() actualizar = new EventEmitter<any>();

  isClosing: boolean = false;
  frecuenciaMap: Record<string, number> = {
    'anual': 1,
    'semestral': 2,
    'trimestral': 4,
    'mensual': 12
  };

  emitirActualizacion() {
    const campos = [
      { campo: this.bono.nombre, nombre: 'Nombre del bono' },
      { campo: this.bono.montoNominal, nombre: 'Monto nominal' },
      { campo: this.bono.plazoAnios, nombre: 'Plazo (años)' },
      { campo: this.bono.frecuenciaPago, nombre: 'Frecuencia de pago' },
      { campo: this.bono.tasaBase, nombre: 'Tasa base' },
      { campo: this.bono.tipoGracia, nombre: 'Tipo de gracia' },
      { campo: this.bono.tipoTasaBase, nombre: 'Tipo de tasa base' }
    ];

    const vacios = campos.filter(c => !c.campo && c.campo !== 0);
    if (vacios.length > 0) {
      const lista = vacios.map(c => `• ${c.nombre}`).join('<br>');
      Swal.fire({
        icon: 'warning',
        html: `Por favor completa los siguientes campos:<br><br>${lista}`,
        confirmButtonText: 'Entendido'
      });
      return;
    }
    if (this.mostrarPeriodoGracia()) {
      const frecuenciaMap: Record<string, number> = {
        'anual': 1,
        'semestral': 2,
        'trimestral': 4,
        'mensual': 12
      };

      const factor = frecuenciaMap[this.bono.frecuenciaPago];
      const totalCuotas = this.bono.plazoAnios * factor;
      const periodoGracia = Number(this.bono.periodoGracia);

      if (isNaN(periodoGracia) || periodoGracia < 0 || periodoGracia >= totalCuotas) {
        Swal.fire({
          icon: 'error',
          title: 'Periodo de gracia inválido',
          html: `Para un plazo de <b>${this.bono.plazoAnios} año(s)</b> con pagos <b>${this.bono.frecuenciaPago}</b>, solo puedes asignar hasta <b>${totalCuotas - 1}</b> periodo(s) de gracia.`,
          confirmButtonText: 'Corregir'
        });
        return;
      }
    }
    this.actualizar.emit(this.bono);
  }

  cerrarConAnimacion() {
    this.isClosing = true;
    setTimeout(() => {
      this.cerrar.emit();
      this.isClosing = false;
    }, 180);
  }

  ngOnInit(): void {
    this.validarTasaYCapitalizacion();
  }

  validarTasaYCapitalizacion() {
    const tasa = this.bono.tipoTasaBase;

    if (['TEA', 'TES', 'TEM'].includes(tasa)) {
      this.bono.tipoTasa = 'efectiva';
    } else if (['TNA', 'TNM', 'TNS'].includes(tasa)) {
      this.bono.tipoTasa = 'nominal';
    }

    if (this.bono.tipoTasa === 'efectiva') {
      this.bono.capitalizacion = null;
    }
  }

  onCambioTipoTasaBase() {
    this.validarTasaYCapitalizacion();
  }

  mostrarCapitalizacion(): boolean {
    return this.bono.tipoTasa === 'nominal';
  }

  mostrarPeriodoGracia(): boolean {
    return this.bono.tipoGracia !== 'sin gracia';
  }

}
