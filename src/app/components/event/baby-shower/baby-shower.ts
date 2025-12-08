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
      {
        icon: 'share',
        title: 'Envío automático',
        content:
          'Comparte tus invitaciones por WhatsApp, email o redes sociales de forma instantánea.',
      },
      {
        icon: 'qr_code',
        title: 'Pago por QR',
        content:
          'Facilita a tus invitados la opción de contribuir con regalos o aportaciones mediante pagos rápidos y seguros por QR.',
      },
      {
        icon: 'featured_seasonal_and_gifts',
        title: 'Pago por QR',
        content:
          'Facilita a tus invitados la opción de contribuir con regalos o aportaciones mediante pagos rápidos y seguros por QR.',
      },
      {
        icon: 'assignment_turned_in',
        title: 'Pago por QR',
        content:
          'Facilita a tus invitados la opción de contribuir con regalos o aportaciones mediante pagos rápidos y seguros por QR.',
      },
      {
        icon: 'share_location',
        title: 'Pago por QR',
        content:
          'Facilita a tus invitados la opción de contribuir con regalos o aportaciones mediante pagos rápidos y seguros por QR.',
      },
      {
        icon: 'event',
        title: 'Confirmación de asistencia',
        content:
          'Recibe confirmaciones en tiempo real y gestiona tu lista de invitados fácilmente.',
      },
      {
        icon: 'diamond_shine',
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
      {
        icon: 'settings',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'add_link',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'timelapse',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'volume_up',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'music_note',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'music_off',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'photo_camera',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'no_photography',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'fork_spoon',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'no_food',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'brunch_dining',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'supervised_user_circle_off',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'flights_and_hotels',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'directions_bus',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'local_taxi',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'not_accessible',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'pets',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'print',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'brand_family',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
      {
        icon: 'event_list',
        title: 'Mesa de regalos',
        content:
          'Incluye enlaces a tus registros de regalos para que tus invitados sepan qué obsequiar.',
      },
    ],
  });
}
