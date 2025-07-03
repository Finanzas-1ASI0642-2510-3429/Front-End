import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

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


  emitirActualizacion() {
    
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
