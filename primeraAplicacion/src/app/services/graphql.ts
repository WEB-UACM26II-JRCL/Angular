import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';

export interface Perfil {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  private http = inject(HttpClient);
  private url = '/graphql';
  private perfilEnCache: Perfil | null = null;

  // Consulta del perfil del usuario
  obtenerPerfil(): Observable<Perfil> {
    if (this.perfilEnCache) {
      return of(this.perfilEnCache);
    }

    const consulta = '{ perfil { id nombre email telefono } }';
    return this.http
      .post<{ data: { perfil: Perfil } }>(this.url, { query: consulta })
      .pipe(
        map((respuesta) => respuesta.data.perfil),
        tap((perfil) => (this.perfilEnCache = perfil))
      );
  }

  // Mutacion para actualizar el telefono
  actualizarTelefono(telefono: string): Observable<Perfil> {
    const mutacion = `mutation ($telefono: String!) {
      actualizarTelefono(telefono: $telefono) { id nombre email telefono }
    }`;
    return this.http
      .post<{ data: { actualizarTelefono: Perfil } }>(this.url, {
        query: mutacion,
        variables: { telefono },
      })
      .pipe(
        map((respuesta) => respuesta.data.actualizarTelefono),
        tap((perfil) => (this.perfilEnCache = perfil))
      );
  }
}
