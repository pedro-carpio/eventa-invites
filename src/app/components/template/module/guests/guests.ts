import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-guests',
  imports: [],
  template: `
    <h2>Invitados</h2>
    <ul>
      @for (guest of guests; track guest) {
        <li>{{ guest }}</li>
      }
    </ul>
  `,
  styles: ``,
})
export class Guests {
  @Input() guests!: string[];
}
