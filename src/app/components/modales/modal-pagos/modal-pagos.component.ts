import { Component, EventEmitter, Input, Output, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';


@Component({
  selector: 'app-modal-pagos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-pagos.component.html',
  styleUrls: ['./modal-pagos.component.scss']
})
export class ModalPagosComponent implements OnChanges{

  @Input() bono: any;
  @Input() visible: boolean = false;
  @Output() cerrar = new EventEmitter<void>();

  indicadores: any = null;


  constructor(private usuarioService: UsuarioService) {}


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible && this.bono?.id) {

      console.log("bono id para indicador:", this.bono.id)
      this.usuarioService.obtenerIndicadoresFinancieros(this.bono.id).subscribe({
        next: (data) => {
          this.indicadores = data;
          console.log('Indicadores cargados:', data); 
        },
        error: (err) => {
          console.error('Error al obtener indicadores financieros:', err);
        }
      });
    }
  }
  cerrarModal() {
    this.cerrar.emit(); 
  }
}
