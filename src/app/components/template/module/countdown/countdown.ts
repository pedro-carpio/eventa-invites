import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-countdown',
  imports: [],
  template: `
    <div class="w-full max-w-md rounded-2xl p-4 text-center" style="background-color: #F4F1F8">
      <h2 class="text-2xl font-barriecito mb-3" style="color: #222222">Faltan</h2>
      @if (!hasPassed) {
        <div class="flex justify-around gap-2">
          <div>
            <p class="text-2xl font-barriecito" style="color: #7fc29b">
              {{ timeLeft.days }}
            </p>
            <p class="text-xs" style="font-family: 'Quicksand', sans-serif; color: #222222">días</p>
          </div>
          <div>
            <p class="text-2xl font-barriecito" style="color: #7fc29b">
              {{ timeLeft.hours }}
            </p>
            <p class="text-xs" style="font-family: 'Quicksand', sans-serif; color: #222222">
              horas
            </p>
          </div>
          <div>
            <p class="text-2xl font-barriecito" style="color: #7fc29b">
              {{ timeLeft.minutes }}
            </p>
            <p class="text-xs" style="font-family: 'Quicksand', sans-serif; color: #222222">
              minutos
            </p>
          </div>
          <div>
            <p class="text-2xl font-barriecito" style="color: #7fc29b">
              {{ timeLeft.seconds }}
            </p>
            <p class="text-xs" style="font-family: 'Quicksand', sans-serif; color: #222222">
              segundos
            </p>
          </div>
        </div>
      } @else {
        <p class="text-sm" style="font-family: 'Quicksand', sans-serif; color: #222222">
          El evento ya ha pasado.
        </p>
      }
    </div>
  `,
  styles: [],
})
export class Countdown {
  @Input() eventDate!: Date;

  get hasPassed(): boolean {
    const now = new Date();
    return now.getTime() > this.eventDate.getTime();
  }

  get timeLeft(): TimeLeft {
    const now = new Date();
    const difference = this.eventDate.getTime() - now.getTime();

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    return { days, hours, minutes, seconds };
  }
}

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};
