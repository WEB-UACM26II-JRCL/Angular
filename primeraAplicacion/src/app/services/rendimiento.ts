import { Injectable, signal } from '@angular/core';

export interface Medicion {
  prueba: string;
  ms: number;
}

@Injectable({
  providedIn: 'root',
})
export class RendimientoService {
  mediciones = signal<Medicion[]>([]);
  private inicios = new Map<string, number>();

  iniciar(prueba: string) {
    this.inicios.set(prueba, performance.now());
  }

  finalizar(prueba: string) {
    const inicio = this.inicios.get(prueba);
    if (inicio === undefined) {
      return;
    }
    this.inicios.delete(prueba);
    this.registrar(prueba, performance.now() - inicio);
  }

  // Registra una duracion ya calculada, por ejemplo la latencia de un evento del servidor
  registrar(prueba: string, duracion: number) {
    const ms = Math.round(duracion * 10) / 10;
    this.mediciones.update((lista) => [...lista, { prueba, ms }]);
    console.log(`[rendimiento] ${prueba}: ${ms} ms`);
  }
}
