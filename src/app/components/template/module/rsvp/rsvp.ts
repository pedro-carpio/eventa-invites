import { Component } from '@angular/core';

@Component({
  selector: 'app-rsvp',
  imports: [],
  template: `
    <div class="w-full max-w-md rounded-2xl p-4 text-center" style="background-color: #F4F1F8">
      <h2 class="text-2xl font-barriecito mb-4" style="color: #222222">Confirma tu asistencia</h2>
      <div class="flex flex-col gap-3">
        <button
          (click)="openAsist()"
          class="w-full px-4 py-2 rounded-lg text-white font-quicksand"
          style="background-color: #7fc29b"
        >
          Asistiré
        </button>
        <button
          (click)="openNoAsist()"
          class="w-full px-4 py-2 rounded-lg text-white font-quicksand"
          style="background-color: #7fc29b"
        >
          No podré :(
        </button>
        <button
          (click)="openTMaybe()"
          class="w-full px-4 py-2 rounded-lg text-white font-quicksand"
          style="background-color: #7fc29b"
        >
          Tal vez
        </button>
        <button
          class="w-full px-4 py-2 rounded-lg text-white font-quicksand"
          style="background-color: #7fc29b"
        >
          Añadir a mi calendario
        </button>
      </div>
    </div>
  `,
  styles: [],
})
export class Rsvp {
  openAsist() {
    throw new Error('Method not implemented.');
  }
  openNoAsist() {
    throw new Error('Method not implemented.');
  }
  openTMaybe() {
    throw new Error('Method not implemented.');
  }
}
