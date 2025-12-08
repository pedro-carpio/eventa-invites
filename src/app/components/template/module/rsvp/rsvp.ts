import { Component } from '@angular/core';

@Component({
  selector: 'app-rsvp',
  imports: [],
  template: `
    <button (click)="openAsist()">Asistiré</button>
    <button (click)="openNoAsist()">No podré :(</button>
    <button (click)="openTMaybe()">Tal vez</button>
    <button>Añadir a mi calendario</button>
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
