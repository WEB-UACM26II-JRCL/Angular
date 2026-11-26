import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'bienvenido', loadComponent: () => import('./componentes/bienvenido/bienvenido').then((m) => m.Bienvenido) },
  { path: 'principal', loadComponent: () => import('./componentes/principal/principal').then((m) => m.Principal) },
  { path: 'registro', loadComponent: () => import('./componentes/registro/registro').then((m) => m.Registro) },
  { path: 'personal', loadComponent: () => import('./componentes/personal/personal').then((m) => m.Personal) },
  { path: 'cuenta', loadComponent: () => import('./componentes/cuenta/cuenta').then((m) => m.Cuenta) },
  { path: 'direccion', loadComponent: () => import('./componentes/direccion/direccion').then((m) => m.Direccion) },
  { path: 'fotografia', loadComponent: () => import('./componentes/fotografia/fotografia').then((m) => m.Fotografia) },
  { path: 'micuenta', loadComponent: () => import('./componentes/micuenta/micuenta').then((m) => m.Micuenta) },
  { path: 'notificaciones', loadComponent: () => import('./componentes/notificaciones/notificaciones').then((m) => m.Notificaciones) },
  { path: 'chatbot', loadComponent: () => import('./componentes/chatbot/chatbot').then((m) => m.Chatbot) },
  { path: 'privacidad', loadComponent: () => import('./componentes/privacidad/privacidad').then((m) => m.Privacidad) },
  { path: '', redirectTo: '/bienvenido', pathMatch: 'full' },
];
