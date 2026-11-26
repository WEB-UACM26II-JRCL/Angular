import { Injectable, Injector, afterNextRender, inject, signal } from '@angular/core';
import { RendimientoService } from './rendimiento';

export interface Mensaje {
  autor: 'bot' | 'usuario';
  texto: string;
}

export type EstadoChat = 'desconectado' | 'conectando' | 'conectado' | 'error';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private rendimiento = inject(RendimientoService);
  private injector = inject(Injector);
  private esperandoRespuesta = false;

  mensajes = signal<Mensaje[]>([]);
  estado = signal<EstadoChat>('desconectado');

  private socket: WebSocket | null = null;

  conectar() {
    // WebSocket solo existe en el navegador, no durante el renderizado en servidor
    if (typeof WebSocket === 'undefined' || typeof location === 'undefined' || this.socket) {
      return;
    }

    this.estado.set('conectando');
    const protocolo = location.protocol === 'https:' ? 'wss' : 'ws';
    this.socket = new WebSocket(`${protocolo}://${location.host}/ws/chat`);

    this.socket.onopen = () => this.estado.set('conectado');

    this.socket.onmessage = (evento) => {
      this.mensajes.update((lista) => [...lista, { autor: 'bot', texto: evento.data }]);

      // Fin de la Prueba 3B: la respuesta ya se renderizo y se pinto
      if (this.esperandoRespuesta) {
        this.esperandoRespuesta = false;
        afterNextRender(
          () => {
            requestAnimationFrame(() => this.rendimiento.finalizar('Prueba 3B: ida y vuelta WebSocket'));
          },
          { injector: this.injector }
        );
      }
    };

    this.socket.onerror = () => this.estado.set('error');

    // El servidor no puede enviar "adios" a un cliente que ya se fue,
    // por eso el cliente lo escribe al detectar el cierre
    this.socket.onclose = () => {
      this.mensajes.update((lista) => [...lista, { autor: 'bot', texto: 'adios' }]);
      this.socket = null;
      if (this.estado() !== 'error') {
        this.estado.set('desconectado');
      }
    };
  }

  enviar(texto: string) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      return;
    }
    // Inicio de la Prueba 3B: se envia el mensaje al servidor
    this.rendimiento.iniciar('Prueba 3B: ida y vuelta WebSocket');
    this.esperandoRespuesta = true;
    this.socket.send(texto);
    this.mensajes.update((lista) => [...lista, { autor: 'usuario', texto }]);
  }

  desconectar() {
    this.socket?.close();
  }
}
