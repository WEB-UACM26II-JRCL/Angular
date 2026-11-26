import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RendimientoService } from '../../services/rendimiento';

@Component({
  selector: 'app-principal',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export class Principal {
  tarjetas = [
    {
      icono: '/iconos/Usuario.svg',
      texto: 'MY_ACCOUNT',
      alt: 'MY_ACCOUNT',
      accion: () => this.irAMiCuenta(),
    },
    {
      icono: '/iconos/Registro.svg',
      texto: 'REGISTER',
      alt: 'REGISTER',
      accion: () => this.irARegistro(),
    },
    {
      icono: '/iconos/Notificaciones.svg',
      texto: 'NOTIFICATIONS',
      alt: 'NOTIFICATIONS',
      accion: () => this.irANotificaciones(),
    },
    {
      icono: '/iconos/Pantera.svg',
      texto: 'CHATBOT',
      alt: 'CHATBOT',
      accion: () => this.irAChatbot(),
    },
    {
      icono: '/iconos/AvisoPrivacidad.svg',
      texto: 'PRIVACY_NOTICE',
      alt: 'PRIVACY_NOTICE',
      accion: () => this.irAPrivacidad(),
    },
    {
      icono: '/iconos/Cerrar sesion.svg',
      texto: 'LOGOUT',
      alt: 'LOGOUT',
      accion: () => this.cerrarSesion(),
    },
  ];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private rendimiento: RendimientoService
  ) {}

  irAMiCuenta() {
    this.router.navigate(['/micuenta']);
  }

  // Nota: la ruta '/registro' se habilita en la segunda parte
  irARegistro() {
    // Inicio de la Prueba 1: el usuario selecciona Registro
    this.rendimiento.iniciar('Prueba 1: renderizado de Registro');
    this.router.navigate(['/registro']);
  }

  irANotificaciones() {
    this.router.navigate(['/notificaciones']);
  }

  irAChatbot() {
    this.router.navigate(['/chatbot']);
  }

  irAPrivacidad() {
    this.router.navigate(['/privacidad']);
  }

  cerrarSesion() {
    this.router.navigate(['/bienvenido']);
  }

  cambiarIdioma(lang: string) {
    this.translate.use(lang);
  }
}
