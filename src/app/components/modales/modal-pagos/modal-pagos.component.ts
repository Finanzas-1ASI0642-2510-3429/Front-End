import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';


@Component({
  selector: 'app-modal-pagos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-pagos.component.html',
  styleUrls: ['./modal-pagos.component.scss']
})
export class ModalPagosComponent {

  @Input() bono: any;
  @Input() visible: boolean = false;
  @Output() cerrar = new EventEmitter<void>();

  indicadores: any = null;


  constructor(private usuarioService: UsuarioService) {}


  ngOnChanges(): void {
    if (this.visible && this.bono?.id) {
      this.usuarioService.obtenerIndicadoresFinancieros(this.bono.id).subscribe({
        next: (data) => this.indicadores = data,
        error: (err) => console.error('Error al obtener indicadores:', err)
      });
    }
  }

  cerrarModal() {
    this.cerrar.emit(); 
  }
}