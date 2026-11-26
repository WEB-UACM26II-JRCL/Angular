import { Injectable, Injector, afterNextRender, computed, inject, signal } from '@angular/core';
import { RendimientoService } from './rendimiento';

export interface Notificacion {
  id: number;
  mensaje: string;
  hora: string;
  emitida: number;
}

export type EstadoConexion = 'desconectado' | 'conectando' | 'conectado' | 'error';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private rendimiento = inject(RendimientoService);
  private injector = inject(Injector);

  notificaciones = signal<Notificacion[]>([]);
  total = computed(() => this.notificaciones().length);
  estado = signal<EstadoConexion>('desconectado');

  private fuente: EventSource | null = null;

  conectar() {
    // EventSource solo existe en el navegador, no durante el renderizado en servidor
    if (typeof EventSource === 'undefined' || this.fuente) {
      return;
    }

    this.estado.set('conectando');
    this.fuente = new EventSource('/notificaciones/eventos');

    this.fuente.onopen = () => this.estado.set('conectado');

    this.fuente.addEventListener('notificacion', (evento) => {
      const notificacion: Notificacion = JSON.parse((evento as MessageEvent).data);
      // La lista conserva todas las notificaciones de la sesion, la mas reciente primero
      this.notificaciones.update((lista) => [notificacion, ...lista]);

      // Fin de la Prueba 3A: el aviso y el contador ya se renderizaron y se pintaron
      afterNextRender(
        () => {
          requestAnimationFrame(() =>
            this.rendimiento.registrar('Prueba 3A: notificacion SSE', Date.now() - notificacion.emitida)
          );
        },
        { injector: this.injector }
      );
    });

    // Ante un error el navegador reintenta solo; al reconectar se dispara onopen
    this.fuente.onerror = () => this.estado.set('error');
  }

  desconectar() {
    this.fuente?.close();
    this.fuente = null;
    this.estado.set('desconectado');
  }
}
