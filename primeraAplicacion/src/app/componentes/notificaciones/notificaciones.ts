import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { SseService } from '../../services/sse';

@Component({
  selector: 'app-notificaciones',
  imports: [TranslatePipe],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.css',
})
export class Notificaciones implements OnInit, OnDestroy {
  private router = inject(Router);
  sse = inject(SseService);

  ngOnInit() {
    this.sse.conectar();
  }

  // Al salir de la pantalla se cierra la conexion para no dejarla abierta
  ngOnDestroy() {
    this.sse.desconectar();
  }

  alternar() {
    if (this.sse.estado() === 'desconectado') {
      this.sse.conectar();
    } else {
      this.sse.desconectar();
    }
  }

  regresar() {
    this.router.navigate(['/principal']);
  }
}
