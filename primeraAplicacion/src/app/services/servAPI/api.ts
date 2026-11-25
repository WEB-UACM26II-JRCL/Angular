import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = '/api';
  private tokenKey = 'auth_access_token';
  private refreshTokenKey = 'auth_refresh_token';

  private esNavegador(): boolean {
    return typeof window !== 'undefined';
  }

  login(credenciales: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credenciales).pipe(
      tap((response: any) => {
        if (response.accessToken && response.refreshToken) {
          this.guardarTokens(response.accessToken, response.refreshToken);
        }
      })
    );
  }

  private guardarTokens(token: string, refreshToken: string): void {
    if (this.esNavegador()) {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.refreshTokenKey, refreshToken);
    }
  }

  registrarUsuario(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, datos).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  refrescarToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('El refresh token no está disponible'));
    }

    return this.http
      .post(`${this.apiUrl}/users/refresh`, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap((response: any) => {
          this.guardarTokens(response.accessToken, response.refreshToken);
        }),
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  public getToken(): string | null {
    return this.esNavegador() ? localStorage.getItem(this.tokenKey) : null;
  }

  public getRefreshToken(): string | null {
    return this.esNavegador() ? localStorage.getItem(this.refreshTokenKey) : null;
  }

  public limpiarTokens(): void {
    if (this.esNavegador()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
    }
  }
}
