import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-privacidad',
  imports: [TranslatePipe],
  templateUrl: './privacidad.html',
  styleUrl: './privacidad.css',
})
export class Privacidad {
  private router = inject(Router);

  // Contenido estatico de ejemplo: sustituir por el texto oficial si se requiere
  secciones = [
    {
      titulo: '1. Responsable',
      texto:
        'La institución responsable de esta aplicación es la encargada del tratamiento de sus datos personales, los cuales serán protegidos conforme a la normativa aplicable en materia de protección de datos personales.',
    },
    {
      titulo: '2. Finalidades',
      texto:
        'Sus datos personales serán utilizados para la creación y gestión de su cuenta, el acceso a los servicios del sistema, la comunicación relacionada con actividades académicas, notificaciones, soporte técnico y fines estadísticos.',
    },
    {
      titulo: '3. Datos que se recaban',
      texto:
        'Los datos personales que se recaban son: nombre, correo electrónico, teléfono, fecha de nacimiento, género, nacionalidad, ocupación y rol dentro del sistema.',
    },
    {
      titulo: '4. Transferencias',
      texto:
        'Sus datos personales no serán transferidos a terceros, salvo en los casos previstos por la ley.',
    },
  ];

  regresar() {
    this.router.navigate(['/principal']);
  }
}
