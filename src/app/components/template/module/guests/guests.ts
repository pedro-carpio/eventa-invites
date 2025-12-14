import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-guests',
  imports: [],
  template: `
    <div class="w-full max-w-md rounded-2xl p-4 text-center" style="background-color: #F4F1F8">
      <h2 class="text-2xl font-barriecito mb-3" style="color: #222222">Asistencia</h2>
      @if (maxPlusOnes(); as maxPlusOnes) {
        <p class="text-xs mb-3" style="font-family: 'Quicksand', sans-serif; color: #222222">
          Cada invitación incluye {{ maxPlusOnes }}
          @if (maxPlusOnes > 1) {
            acompañantes
          } @else {
            acompañante
          }
        </p>
      }
      <ul class="flex flex-col gap-2">
        @for (guest of guests(); track guest) {
          <li
            class="p-2 rounded-lg"
            style="background-color: #f9f7fc; font-family: 'Quicksand', sans-serif; color: #222222"
          >
            {{ guest }}
          </li>
        }
      </ul>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Guests {
  guests = input<string[]>([]);
  maxPlusOnes = input<number | undefined>();
}
