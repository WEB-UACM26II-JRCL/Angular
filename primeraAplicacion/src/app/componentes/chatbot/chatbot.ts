import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { WebsocketService } from '../../services/websocket';

@Component({
  selector: 'app-chatbot',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css',
})
export class Chatbot implements OnInit, OnDestroy {
  private router = inject(Router);
  chat = inject(WebsocketService);
  texto = new FormControl('', { nonNullable: true });

  ngOnInit() {
    this.chat.conectar();
  }

  // Al salir de la pantalla se cierra la conexion
  ngOnDestroy() {
    this.chat.desconectar();
  }

  enviar() {
    const contenido = this.texto.value.trim();
    if (!contenido) {
      return;
    }
    this.chat.enviar(contenido);
    this.texto.setValue('');
  }

  reconectar() {
    this.chat.conectar();
  }

  regresar() {
    this.router.navigate(['/principal']);
  }
}
