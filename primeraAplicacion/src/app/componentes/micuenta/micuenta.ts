import { Component, Injector, OnInit, afterNextRender, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { GraphqlService, Perfil } from '../../services/graphql';
import { RendimientoService } from '../../services/rendimiento';

@Component({
  selector: 'app-micuenta',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './micuenta.html',
  styleUrl: './micuenta.css',
})
export class Micuenta implements OnInit {
  private graphql = inject(GraphqlService);
  private router = inject(Router);
  private rendimiento = inject(RendimientoService);
  private injector = inject(Injector);

  perfil = signal<Perfil | null>(null);
  mensaje = signal<string | null>(null);
  error = signal<string | null>(null);

  telefono = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern('^[0-9]{10}$')],
  });

  ngOnInit() {
    // Inicio de la Prueba 2: se solicita el perfil mediante GraphQL
    this.rendimiento.iniciar('Prueba 2: consulta GraphQL');
    this.graphql.obtenerPerfil().subscribe({
      next: (perfil) => {
        this.perfil.set(perfil);
        this.telefono.setValue(perfil.telefono);

        // Fin de la Prueba 2: los datos ya se renderizaron y se pintaron
        afterNextRender(
          () => {
            requestAnimationFrame(() => this.rendimiento.finalizar('Prueba 2: consulta GraphQL'));
          },
          { injector: this.injector }
        );
      },
      error: () => this.error.set('No fue posible obtener el perfil'),
    });
  }

  guardar() {
    if (this.telefono.invalid) {
      this.telefono.markAsTouched();
      return;
    }

    this.mensaje.set(null);
    this.error.set(null);

    this.graphql.actualizarTelefono(this.telefono.value).subscribe({
      next: (perfil) => {
        this.perfil.set(perfil);
        this.mensaje.set('Teléfono actualizado correctamente');
      },
      error: () => this.error.set('No fue posible actualizar el teléfono'),
    });
  }

  regresar() {
    this.router.navigate(['/principal']);
  }
}
