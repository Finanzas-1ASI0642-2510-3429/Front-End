
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { ChartOptions, ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-perfil',
  imports: [CommonModule, NgChartsModule],
  templateUrl: './perfil.component.html',
  standalone: true,
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  user: any = {};
  perfil: any = {};
  nombreCompleto = '';
  inicialUsuario = '';
  cantidadBonos = 0;
  cantidadInversiones = 0;
  paises: { nombre: string, bandera: string }[] = [];


  constructor(private usuarioService: UsuarioService, private cdr: ChangeDetectorRef) { }

  lineChartLabels: string[] = [];

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Bonos creados por día',
        borderColor: '#1d436b',
        backgroundColor: 'rgba(29,67,107,0.1)',
        pointBackgroundColor: '#1d436b',
        fill: true,
        tension: 0.3
      }
    ]
  };


  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha de creación'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de bonos'
        },
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };


  ngOnInit(): void {
    const username = this.obtenerUsuario();

    this.cargarPerfil(username); 


  }


  cargarGraficoPorFecha(bonos: any[]) {
  const agrupados: { [fecha: string]: number } = {};

  bonos.forEach(b => {
    const fecha = b.fechaCreacion?.split('T')[0];
    agrupados[fecha] = (agrupados[fecha] || 0) + 1;
  });

  const fechasOrdenadas = Object.keys(agrupados).sort();
  const cantidades = fechasOrdenadas.map(fecha => agrupados[fecha]);

  this.lineChartData.labels = fechasOrdenadas;
  this.lineChartData.datasets[0].data = cantidades;

  fechasOrdenadas.forEach(f => {
    console.log(`→ ${f}: ${agrupados[f]} bono(s)`);
  });

  setTimeout(() => {
    window.dispatchEvent(new Event('resize'));
  }, 200);
}




  cargarPerfil(username: string): void {
    this.usuarioService.getUserByUsername(username).subscribe(userData => {
      this.user = userData;
      this.inicialUsuario = userData.username.charAt(0).toUpperCase();

      this.usuarioService.getProfileById(userData.profileId).subscribe(profile => {
        this.perfil = profile;
        this.nombreCompleto = `${profile.firstName} ${profile.lastName}`;

        const pais = profile.country;
        fetch(`https://restcountries.com/v3.1/name/${pais}?fullText=true&fields=flags`)
          .then(res => res.json())
          .then(data => {
            if (data && data[0]?.flags?.png) {
              this.perfil.banderaUrl = data[0].flags.png;
            }
          });
      });

      this.usuarioService.obtenerBonosPorUsuario(username).subscribe(bonos => {
        this.cantidadBonos = bonos.length;
        this.cargarGraficoPorFecha(bonos);
      });

      this.usuarioService.listarBonos().subscribe(bonos => {
        this.cantidadInversiones = bonos.filter(b => b.usuarioInversor === username).length;
      });

    });
    this.cdr.detectChanges();

  }

  obtenerUsuario(): string {
    const userData = localStorage.getItem('user');
    try {
      if (!userData) return '';
      return userData.startsWith('{') ? JSON.parse(userData).username : userData;
    } catch {
      return '';
    }
  }

}

