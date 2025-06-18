import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-lista-bonos',
  imports: [CommonModule, NzIconModule],
  standalone: true,
  templateUrl: './lista-bonos.component.html',
  styleUrl: './lista-bonos.component.scss'
})
export class ListaBonosComponent {

   bonos = [
    {
      id: 1,
      nombreBono: 'Bono Corporativo A',
      montoNominal: 10000,
      plazo: 3,
      frecuenciaPago: 'Anual',
      tasaInteres: 7.5,
      fechaEmision: new Date('2023-01-15')
    },
    // Aquí puedes cargar más objetos reales desde un servicio
  ];

    constructor(private router: Router) {}

  verDetalle(bono: any) {
    // Reemplaza con tu lógica para ver detalle
    console.log('Detalle de bono:', bono);
  }

  editarBono(bono: any) {
    this.router.navigate(['/editar-bono', bono.id]);
  }

  eliminarBono(bono: any) {
    const confirmacion = confirm(`¿Seguro que deseas eliminar el bono "${bono.nombreBono}"?`);
    if (confirmacion) {
      this.bonos = this.bonos.filter(b => b.id !== bono.id);
    }
  }

}
