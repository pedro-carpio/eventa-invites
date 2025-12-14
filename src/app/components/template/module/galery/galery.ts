import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-galery',
  imports: [],
  template: `
    <div class="w-full max-w-md rounded-2xl p-4 text-center" style="background-color: #F4F1F8">
      <h2 class="text-2xl font-barriecito mb-2" style="color: #222222">
        {{ title }}
      </h2>
      <p class="text-xs mb-4" style="font-family: 'Quicksand', sans-serif; color: #222222">
        {{ description }}
      </p>
      <span class="material-symbols-rounded block text-2xl mb-4" style="color: #7fc29b">
        photo_camera
      </span>
      <div class="grid grid-cols-2 gap-3">
        @for (image of images; track $index) {
          <img [src]="image.src" [alt]="image.alt" class="w-full rounded-lg object-cover" />
        }
      </div>
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
