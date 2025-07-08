import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-inversiones',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './mis-inversiones.component.html',
  styleUrl: './mis-inversiones.component.scss'
})
export class MisInversionesComponent implements OnInit {
  bonosInvertidos: any[] = [];
  username: string = '';
  bonoActualIndex = 0;
  direccionAnimacion = '';
  diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  diasDelMes: { numero: number, fechaISO: string }[] = [];
  fechasPagoSet: Set<string> = new Set();
  mesActualIndex: number = 0;

  meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  calendarios: {
    anio: number;
    mes: number;
    dias: { numero: number; fechaISO: string }[];
  }[] = [];

  get bonoActual() {
    return this.bonosInvertidos[this.bonoActualIndex];
  }

  constructor(private usuarioService: UsuarioService) { }


  ngOnInit(): void {
    this.username = localStorage.getItem('user') || '';
    console.log('Usuario actual (localStorage):', this.username);

    this.cargarBonosInvertidos();
  }

  siguienteBono() {
    if (this.bonoActualIndex < this.bonosInvertidos.length - 1) {
      this.direccionAnimacion = 'derecha';
      this.bonoActualIndex++;
    }
  }

  anteriorBono() {
    if (this.bonoActualIndex > 0) {
      this.direccionAnimacion = 'izquierda';
      this.bonoActualIndex--;
    }
  }

  cargarBonosInvertidos(): void {
    this.usuarioService.listarBonos().subscribe({
      next: (bonos) => {

        this.bonosInvertidos = bonos.filter(bono =>
          bono.estadoInvertido === true &&
          bono.usuarioInversor &&
          bono.usuarioInversor.trim().toLowerCase() === this.username.trim().toLowerCase()
        );

        console.log(this.bonosInvertidos)
        this.extraerFechasPago();

      },
      error: (err) => {
        console.error('Error al listar bonos:', err);

        Swal.fire({
          icon: 'error',
          title: 'Error al obtener bonos',
          text: 'No se pudo cargar la información de tus inversiones. Inténtalo nuevamente.',
          confirmButtonColor: '#1d436b'
        });
      }

    });
  }

  generarCalendario(fechaReferencia: Date = new Date()) {
    this.diasDelMes = [];

    const año = fechaReferencia.getFullYear();
    const mes = fechaReferencia.getMonth();

    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const primerDiaSemana = primerDia.getDay();

    for (let i = 0; i < primerDiaSemana; i++) {
      this.diasDelMes.push({ numero: 0, fechaISO: '' });
    }

    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      const fecha = new Date(año, mes, d);
      const iso = fecha.toISOString().split('T')[0];
      this.diasDelMes.push({ numero: d, fechaISO: iso });
    }
  }

  mesAnterior(): void {
    if (this.mesActualIndex > 0) {
      this.mesActualIndex--;
    }
  }

  mesSiguiente(): void {
    if (this.mesActualIndex < this.calendarios.length - 1) {
      this.mesActualIndex++;
    }
  }

  extraerFechasPago(): void {
    const fechas: string[] = [];
    const hoy = new Date().toISOString().split('T')[0];
    this.pagosFuturos = [];

    for (const bono of this.bonosInvertidos) {
      if (bono.pagos?.length) {
        for (const pago of bono.pagos) {
          fechas.push(pago.fechaPago);
          if (pago.fechaPago >= hoy) {
            this.pagosFuturos.push({
              ...pago,
              bono 
            });
          }
        }
      }
    }


    this.fechasPagoSet = new Set(fechas);
    this.buscarProximoPago();
    this.generarCalendariosDesdeFechas();
  }

  pagosFuturos: any[] = [];

  pagoActualIndex = 0;
  pagoDireccionAnimacion = '';
  mostrarPagoCard = true;

  get pagoActual() {
    return this.pagosFuturos[this.pagoActualIndex];
  }

  pagoAnterior() {
    if (this.pagoActualIndex > 0) {
      this.pagoDireccionAnimacion = 'izquierda';
      this.reiniciarAnimacionPago(() => {
        this.pagoActualIndex--;
      });
    }
  }

  pagoSiguiente() {
    if (this.pagoActualIndex < this.pagosFuturos.length - 1) {
      this.pagoDireccionAnimacion = 'derecha';
      this.reiniciarAnimacionPago(() => {
        this.pagoActualIndex++;
      });
    }
  }


  reiniciarAnimacionPago(callback: () => void) {
    this.mostrarPagoCard = false;
    setTimeout(() => {
      callback();
      this.mostrarPagoCard = true;
    }, 50);
  }


  generarCalendariosDesdeFechas(): void {
    this.calendarios = [];

    const fechas = Array.from(this.fechasPagoSet).sort();

    if (fechas.length === 0) return;

    const fechasDate = fechas.map(fechaStr => new Date(fechaStr));

    const fechaInicio = new Date(fechasDate[0].getFullYear(), fechasDate[0].getMonth(), 1);
    const fechaFin = new Date(fechasDate[fechasDate.length - 1].getFullYear(), fechasDate[fechasDate.length - 1].getMonth(), 1);

    const calendarios: {
      anio: number;
      mes: number;
      dias: { numero: number; fechaISO: string }[];
    }[] = [];

    let current = new Date(fechaInicio);

    while (current <= fechaFin) {
      const anio = current.getFullYear();
      const mes = current.getMonth();

      const dias: { numero: number; fechaISO: string }[] = [];
      const primerDia = new Date(anio, mes, 1);
      const ultimoDia = new Date(anio, mes + 1, 0);
      const primerDiaSemana = primerDia.getDay();

      for (let i = 0; i < primerDiaSemana; i++) {
        dias.push({ numero: 0, fechaISO: '' });
      }

      for (let d = 1; d <= ultimoDia.getDate(); d++) {
        const fecha = new Date(anio, mes, d);
        const iso = fecha.toISOString().split('T')[0];
        dias.push({ numero: d, fechaISO: iso });
      }

      calendarios.push({ anio, mes, dias });

      current.setMonth(current.getMonth() + 1);
    }

    this.calendarios = calendarios;
    this.mesActualIndex = 0;
  }

  proximoPago: { fechaPago: string; monto: number } | null = null;

  buscarProximoPago(): void {
    const hoy = new Date().toISOString().split('T')[0];

    const pagosFuturos: { fechaPago: string; monto: number }[] = [];

    for (const bono of this.bonosInvertidos) {
      if (bono.pagos?.length) {
        for (const pago of bono.pagos) {
          if (pago.fechaPago >= hoy) {
            pagosFuturos.push({ fechaPago: pago.fechaPago, monto: pago.monto });
          }
        }
      }
    }

    pagosFuturos.sort((a, b) => a.fechaPago.localeCompare(b.fechaPago));
    this.proximoPago = pagosFuturos.length > 0 ? pagosFuturos[0] : null;
  }

}

