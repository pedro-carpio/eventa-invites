import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Event } from '../event';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { Templates } from '../templates/templates';
import { Includes } from '../includes/includes';

@Component({
  selector: 'app-baby-shower',
  imports: [Header, Footer, Templates, Includes],
  template: `
    <app-header [title]="event().title" />
    <app-templates [templates]="event().templates" [event]="event().type" />
    <app-includes [items]="event().includes" />
    <app-footer />
  `,
  styles: `
    h1 {
      color: red;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BabyShower {
  event = signal<Event>({
    title: 'Baby Shower',
    type: 'baby-shower',
    templates: [
      { title: 'Vinculo Natural', id: 'vinculo-natural' },
      { title: 'Bebé en Camino', id: 'bebe-en-camino' },
      { title: 'Lluvia de Amor', id: 'lluvia-de-amor' },
    ],
    includes: [
      {
        icon: ['face', 'face_2', 'face_3', 'face_4', 'face_5', 'face_6'],
        title: 'Invitaciones digitales personalizadas',
        content:
          'Crea invitaciones con los nombres de tus invitados, entregando una invitación única para cada uno.',
      },
    ],
  });
}
