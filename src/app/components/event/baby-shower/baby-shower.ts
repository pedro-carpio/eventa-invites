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
    <app-header />
    <app-templates [templateTitles]="event().templateTitles" />
    <app-includes [items]="event().includes" />
    <app-footer />
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BabyShower {
  event = signal<Event>({
    title: 'Baby Shower',
    templateTitles: ['Dulce Espera', 'Bebé en Camino', 'Lluvia de Amor'],
    includes: [
      {
        icon: 'cake',
        title: 'Invitaciones digitales personalizadas',
        content:
          'Crea invitaciones con los nombres de tus invitados, entregando una invitación única para cada uno.',
      },
      {
        icon: 'send',
        title: 'Envío automático',
        content:
          'Comparte tus invitaciones por WhatsApp, email o redes sociales de forma instantánea.',
      },
      {
        icon: 'confirmation_number',
        title: 'Confirmación de asistencia',
        content:
          'Recibe confirmaciones en tiempo real y gestiona tu lista de invitados fácilmente.',
      },
      {
        icon: 'redeem',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
    ],
  });
}
