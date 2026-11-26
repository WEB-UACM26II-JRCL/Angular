import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Mi cuenta consulta al servidor al iniciar, por lo que solo se renderiza en el navegador
  {
    path: 'micuenta',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
