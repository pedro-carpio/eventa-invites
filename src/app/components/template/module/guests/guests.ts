import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-guests',
  imports: [],
  template: `
    <h2>Asistencia</h2>
    @if (maxPlusOnes(); as maxPlusOnes) {
      <p>
        Cada invitación incluye {{ maxPlusOnes }}
        @if (maxPlusOnes > 1) {
          acompañantes
        } @else {
          acompañante
        }
      </p>
    }
    <ul>
      @for (guest of guests(); track guest) {
        <li>{{ guest }}</li>
      }
    </ul>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Guests {
  guests = input<string[]>([]);
  maxPlusOnes = input<number | undefined>();
}
