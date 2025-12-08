import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-guests',
  imports: [],
  template: `
    <h2>Invitadxs</h2>
    @if (max_plus_ones && max_plus_ones > 0) {
      <p>
        Cada invitadx puede llevar hasta {{ max_plus_ones }}
        @if (max_plus_ones > 1) {
          acompañantes
        } @else {
          acompañante
        }
      </p>
    }
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
  @Input() max_plus_ones?: number;
}
