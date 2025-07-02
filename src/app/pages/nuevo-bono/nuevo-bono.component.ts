import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { NzIconModule } from 'ng-zorro-antd/icon';
import Swal from 'sweetalert2';
import { ThemeService } from '../../services/theme.service';
import { ActualizarBonoModalComponent } from '../../components/modales/actualizar-bono-modal/actualizar-bono-modal.component';
import { ModalPagosComponent } from '../../components/modales/modal-pagos/modal-pagos.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-nuevo-bono',
  standalone: true,
  imports: [FormsModule, CommonModule, NzIconModule, ActualizarBonoModalComponent, ModalPagosComponent],
  templateUrl: './nuevo-bono.component.html',
  styleUrl: './nuevo-bono.component.scss'
})
export class NuevoBonoComponent implements OnInit {
  bono = {
    nombre: '',
    montoNominal: '',
    plazoAnios: '',
    frecuenciaPago: '',
    tipoTasa: '',
    capitalizacion: '',
    tipoTasaBase: '',
    tasaBase: '',
    tipoMoneda: 'PEN',
    periodoGracia: '',
    tipoGracia: ''
  };

  resultados: any = null;
  username: string = '';
  listaBonosFiltrados: any[] = [];
  nuevaFilaAnimada = false;
  bonoAgregadoId: string | null = null;
  paginaActual = 1;
  tamanoPagina = 11;
  listaBonos: any[] = [];
  modalVisible: boolean = false;
  bonoSeleccionado: any = null;
  terminoBusqueda: string = '';
  ordenActual: 'asc' | 'desc' = 'asc';
  bloquearTipoTasa = false;


  constructor(private bonoService: UsuarioService,
    private http: HttpClient,
    private themeService: ThemeService) {

  }

  ngOnInit(): void {
    this.username = this.obtenerUsuario();

    if (this.username && this.username.trim() !== '') {
      this.obtenerBonos();
    }
  }

  get isDark(): boolean {
    return this.themeService.isDarkMode;
  }


  obtenerUsuario(): string {
    const userData = localStorage.getItem('user');

    try {
      if (userData) {
        if (userData.startsWith('{')) {
          const parsedUser = JSON.parse(userData);
          return parsedUser.username || '';
        } else {
          return userData;
        }
      }
    } catch (e) {
      console.error('Error al parsear el usuario desde localStorage:', e);
    }

    return '';
  }

  registrarBono() {
    if (!this.validarCampos()) {
      return;
    }

    const bonoConCliente = {
      ...this.bono,
      nombreCliente: this.username
    };


    if (bonoConCliente.tipoTasa === 'efectiva') {
      delete (bonoConCliente as any).capitalizacion;
    }

    console.log("bono enviado", bonoConCliente)
    this.bonoService.registrarBono(bonoConCliente).subscribe({
      next: (respuesta) => {
        this.bonoAgregadoId = respuesta.id || respuesta.nombre;
        this.obtenerBonos(() => {
          const totalBonosUsuario = this.listaBonosFiltrados.length;
          this.paginaActual = Math.ceil(totalBonosUsuario / this.tamanoPagina);
          setTimeout(() => {
            this.bonoAgregadoId = null;
          }, 800);
        });
        this.reiniciarFormulario();
      },
      error: (err) => {
        console.error('Error al registrar el bono:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al registrarse',
          text: 'Erro al realizar la petición, vuélvalo a intentar.'
        });
      }
    });
  }

  reiniciarFormulario() {
    this.bono = {
      nombre: '',
      montoNominal: '',
      plazoAnios: '',
      frecuenciaPago: '',
      tipoTasa: '',
      capitalizacion: '',
      tipoTasaBase: '',
      tasaBase: '',
      tipoMoneda: '',
      periodoGracia: '',
      tipoGracia: ''
    };
  }

  obtenerBonos(callback?: () => void) {

    this.bonoService.obtenerBonosPorUsuario(this.username).subscribe({
      next: (bonos) => {
        this.listaBonos = bonos;
        this.listaBonosFiltrados = bonos;
        console.log("bonos por usuario", bonos)

        if (callback) callback();
      },
      error: (err) => {
        console.error('Error al obtener los bonos del usuario:', err);
      }
    });
  }

  get listaBonosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.tamanoPagina;
    const fin = inicio + this.tamanoPagina;
    return this.listaBonosFiltrados.slice(inicio, fin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.listaBonos.length / this.tamanoPagina);
  }

  formatearCorrelativo(numero: number): string {
    return numero.toString().padStart(3, '0');
  }


  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  getDarkMode(): boolean {
    return localStorage.getItem('darkMode') === 'true';
  }

  validarCampos(): boolean {


    if (this.bono.tipoTasa === 'efectiva' && this.bono.capitalizacion) {
      this.bono.capitalizacion = '';
    }

    const camposRequeridos = [
      { campo: this.bono.nombre, nombre: 'Nombre del bono' },
      { campo: this.bono.montoNominal, nombre: 'Monto nominal' },
      { campo: this.bono.plazoAnios, nombre: 'Plazo (años)' },
      { campo: this.bono.tasaBase, nombre: 'Tasa base' },
      { campo: this.bono.tipoGracia, nombre: 'Tipo de Gracia' },
      { campo: this.bono.tipoTasaBase, nombre: 'Tipo de Tasa Base' }
    ];

    const camposVacios = camposRequeridos.filter(c => !c.campo || c.campo.toString().trim() === '');

    if (camposVacios.length > 0) {
      const nombres = camposVacios.map(c => `• ${c.nombre}`).join('<br>');


      Swal.fire({
        icon: 'warning',
        html: `Por favor completa los siguientes campos:<br><br>${nombres}`,
        confirmButtonText: 'Entendido',
        customClass: {
          popup: this.isDark ? 'swal-dark-high' : 'swal-high-popup',
          confirmButton: '',
          cancelButton: ''
        },
        buttonsStyling: false
      });

      return false;
    }

    return true;
  }

  abrirModal(bono: any): void {
    this.bonoSeleccionado = { ...bono };
    this.modalVisible = true;
  }

  cerrarModal(): void {
    this.modalVisible = false;
  }

  guardarCambiosBono(actualizado: any): void {
    this.bonoService.actualizarBono(actualizado).subscribe({
      next: () => {
        this.cerrarModal();
        this.obtenerBonos();
        Swal.fire({
          icon: 'success',
          title: 'Bono actualizado',
          text: 'Los datos del bono se guardaron correctamente.',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Error al actualizar el bono:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: 'Ocurrió un problema. Inténtalo nuevamente.',
        });
      }
    });
  }

  eliminarBono(bonoId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el bono permanentemente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#eb1212',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',

    }).then((result) => {
      if (result.isConfirmed) {
        this.bonoService.eliminarBono(bonoId).subscribe({
          next: () => {
            this.listaBonos = this.listaBonos.filter(b => b.id !== bonoId);
            this.listaBonosFiltrados = this.listaBonosFiltrados.filter(b => b.id !== bonoId);
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'El bono ha sido eliminado correctamente.',
              timer: 1600,
              showConfirmButton: false
            });
          },
          error: (err) => {
            console.error('Error al eliminar el bono:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el bono. Intenta nuevamente.',
            });
          }
        });
      }
    });
  }

  onTipoTasaBaseSeleccion(): void {
    const mapa = {
      TEA: { tipoTasa: 'efectiva' },
      TES: { tipoTasa: 'efectiva' },
      TEM: { tipoTasa: 'efectiva' },
      TNA: { tipoTasa: 'nominal' },
      TNS: { tipoTasa: 'nominal' },
      TNM: { tipoTasa: 'nominal' },
    } as const;

    type TipoClave = keyof typeof mapa;

    const seleccionado = this.bono.tipoTasaBase as TipoClave;

    if (mapa[seleccionado]) {
      this.bono.tipoTasa = mapa[seleccionado].tipoTasa;
      this.bloquearTipoTasa = true;
    } else {
      this.bloquearTipoTasa = false;
    }
  }

  esSinGracia(): boolean {
    return this.bono.tipoGracia === 'sin-gracia';
  }

  modalPagosVisible = false;

  abrirModalPagos(bono: any): void {
    this.bonoSeleccionado = bono;
    this.modalPagosVisible = true;
  }

  cerrarModalPagos(): void {
    console.log("Modal de pagos cerrado");
    this.modalPagosVisible = false;
  }

  ordenarPorId(direccion: 'asc' | 'desc'): void {
    this.ordenActual = direccion;
    const mult = direccion === 'asc' ? 1 : -1;
    this.listaBonosFiltrados.sort((a, b) => (a.id - b.id) * mult);
    this.paginaActual = 1;
  }

  filtrarBonos(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    this.listaBonosFiltrados = this.listaBonos.filter(b =>
      b.nombre.toLowerCase().includes(termino)
    );
    this.paginaActual = 1;
  }

  exportarExcel(): void {
    const fechaActual = new Date().toLocaleDateString();
    const username = this.username || 'Usuario desconocido';

    const cabecera = [
      ['Lista de Bonos Registrados'], 
      [`Fecha de descarga: ${fechaActual}`, `Usuario: ${username}`],
      [],
      [
        'ID', 'Nombre', 'Monto', 'Plazo (años)', 'Tipo Tasa',
        'Capitalización', 'Tasa Base (%)', 'Gracia'
      ] 
    ];

    const datos = this.listaBonosFiltrados.map((bono) => [
      this.formatearCorrelativo(bono.id),
      bono.nombre,
      bono.montoNominal,
      bono.plazoAnios,
      bono.tipoTasaBase,
      bono.tipoTasa === 'efectiva' ? 'No aplica' : bono.capitalizacion,
      bono.tasaBase,
      bono.tipoGracia?.toLowerCase() === 'sin-gracia' ? 'Sin gracia' :
        bono.tipoGracia?.toLowerCase() === 'parcial' ? 'Parcial' :
          bono.tipoGracia?.toLowerCase() === 'total' ? 'Total' : '-'
    ]);

    const hojaArray = [...cabecera, ...datos];

    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(hojaArray);

    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } } 
    ];

    worksheet['!cols'] = [
      { wch: 10 }, { wch: 25 }, { wch: 12 }, { wch: 12 },
      { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 15 }
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Bonos': worksheet },
      SheetNames: ['Bonos']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'Lista de Bonos Registrados.xlsx');
  }

  exportarPDF(): void {
    const doc = new jsPDF();

    const username = this.username || 'Usuario desconocido';
    const fechaActual = new Date().toLocaleString();

    const img = new Image();
    img.src = 'assets/logoazuloscuro.png';
    img.onload = () => {
      doc.addImage(img, 'PNG', 160, 10, 30, 15);

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Lista de Bonos Registrados', 105, 25, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha de descarga: ${fechaActual}`, 20, 35);
      doc.text(`Usuario: ${username}`, 20, 43);

      const headers = [
        ['ID', 'Nombre', 'Monto', 'Plazo', 'Tasa', 'Capitalización', 'Tasa Base', 'Gracia']
      ];
      const data = this.listaBonosFiltrados.map(bono => [
        this.formatearCorrelativo(bono.id),
        bono.nombre,
        `${bono.tipoMoneda === 'PEN' ? 'S/' : '$'} ${bono.montoNominal}`,
        bono.plazoAnios,
        bono.tipoTasaBase,
        bono.tipoTasa === 'efectiva' ? 'No aplica' : bono.capitalizacion,
        bono.tasaBase + '%',
        bono.tipoGracia
      ]);

      autoTable(doc, {
        startY: 50,
        head: [['ID', 'Nombre', 'Monto', 'Plazo', 'Tasa', 'Capitalización', 'Tasa Base', 'Gracia']],
        body: this.listaBonosFiltrados.map(bono => [
          this.formatearCorrelativo(bono.id),
          bono.nombre,
          `${bono.tipoMoneda === 'PEN' ? 'S/' : '$'} ${bono.montoNominal}`,
          bono.plazoAnios,
          bono.tipoTasaBase,
          bono.tipoTasa === 'efectiva' ? 'No aplica' : bono.capitalizacion,
          bono.tasaBase + '%',
          bono.tipoGracia
        ]),
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: { top: 3, right: 5, bottom: 3, left: 5 },
          halign: 'center',
          valign: 'middle',
        },
        headStyles: {
          fillColor: [29, 67, 107],
          textColor: 255,
          fontStyle: 'bold',
        },
        bodyStyles: {
          fillColor: [245, 245, 245],
          lineWidth: 0.1,
        },
        alternateRowStyles: {
          fillColor: [255, 255, 255],
        }
      });

      doc.save('Lista de Bonos Registrados.pdf');
    };
  }

}