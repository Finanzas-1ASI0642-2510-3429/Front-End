import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-inversiones',
  standalone: true,
  imports: [CommonModule],
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

  constructor(private usuarioService: UsuarioService) { }

  get bonoActual() {
    return this.bonosInvertidos[this.bonoActualIndex];
  }


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

    for (const bono of this.bonosInvertidos) {
      if (bono.pagos?.length) {
        for (const pago of bono.pagos) {
          fechas.push(pago.fechaPago);
        }
      }
    }

    this.fechasPagoSet = new Set(fechas);
    this.generarCalendariosDesdeFechas();
  }

  generarCalendariosDesdeFechas(): void {
    this.calendarios = [];

    const fechas = Array.from(this.fechasPagoSet).sort();

    const mapa = new Map<string, string[]>();

    for (const fechaStr of fechas) {
      const [anio, mes] = fechaStr.split('-');
      const key = `${anio}-${mes}`;
      if (!mapa.has(key)) {
        mapa.set(key, []);
      }
      mapa.get(key)!.push(fechaStr);
    }

    for (const [key, fechasMes] of mapa.entries()) {
      const [anioStr, mesStr] = key.split('-');
      const anio = parseInt(anioStr);
      const mes = parseInt(mesStr) - 1;

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

      this.calendarios.push({ anio, mes, dias });
    }

    this.calendarios.sort((a, b) => {
      if (a.anio !== b.anio) return a.anio - b.anio;
      return a.mes - b.mes;
    });
    this.mesActualIndex = 0;

  }

}

