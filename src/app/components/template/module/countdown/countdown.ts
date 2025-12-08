import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-countdown',
  imports: [],
  template: `
    <h2>Faltan</h2>
    @if (!hasPassed) {
      <span>{{ timeLeft.days }} días</span>
      <span>{{ timeLeft.hours }} horas</span>
      <span>{{ timeLeft.minutes }} minutos</span>
      <span>{{ timeLeft.seconds }} segundos</span>
    } @else {
      <span>El evento ya ha pasado.</span>
    }
  `,
  styles: ``,
})
export class Countdown {
  @Input() eventDateTime!: Date;

  get hasPassed(): boolean {
    const now = new Date();
    return now.getTime() > this.eventDateTime.getTime();
  }

  get timeLeft(): TimeLeft {
    const now = new Date();
    const difference = this.eventDateTime.getTime() - now.getTime();

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
