import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-galery',
  imports: [],
  template: `
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <span class="material-symbols-rounded">photo_camera</span>
    <div class="images">
      @for (image of images; track image.src) {
        <img [src]="image.src" [alt]="image.alt" />
      }
    </div>
  `,
  styles: [],
})
export class Galery {
  @Input() title: string = 'Galería';
  @Input() description: string = 'Descripcion del evento';
  @Input() images: Image[] = [];
}

export type Image = {
  src: string;
  alt: string;
};
