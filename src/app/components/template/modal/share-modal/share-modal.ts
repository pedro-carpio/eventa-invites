import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-share-modal',
  imports: [],
  template: `
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <button>Publicar por Facebook</button>
    <button>Publicar por Instagram</button>
    <span> link </span>
    <button>Copiar enlace</button>
    <img src="https://placehold.co/150" alt="QR Code" />
    <button>Copiar código QR</button>
    <button>Cerrar</button>
  `,
  styles: ``,
})
export class ShareModal {
  @Input() title: string = 'Compartir Evento';
  @Input() description: string = 'Comparte este evento con tus amigos y familiares';
  @Input() eventUrl!: string;
}
