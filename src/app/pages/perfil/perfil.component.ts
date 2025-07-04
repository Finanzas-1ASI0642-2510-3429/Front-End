
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  standalone: true,
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit{
  user: any = {};
  perfil: any = {};
  nombreCompleto = '';
  inicialUsuario = '';
  cantidadBonos = 0;
  cantidadInversiones = 0;
  paises: { nombre: string, bandera: string }[] = [];


  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    const username = this.obtenerUsuario();
  
    if (username) {
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
          console.log(bonos)
          this.cantidadBonos = bonos.length;
        });
  
        this.usuarioService.listarBonos().subscribe(bonos => {
          this.cantidadInversiones = bonos.filter(b => b.usuarioInversor === username).length;
        });
      });
    }
  }
  

  obtenerUsuario(): string {
    const userData = localStorage.getItem('user');
    try {
      return userData?.startsWith('{') ? JSON.parse(userData).username : userData || '';
    } catch {
      return '';
    }
  }
}

