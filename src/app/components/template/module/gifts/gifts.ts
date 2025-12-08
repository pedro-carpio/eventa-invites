import { Component, input } from '@angular/core';

@Component({
  selector: 'app-gifts',
  imports: [],
  template: `
    <h2>{{ title() }}</h2>
    @if (ideas().length > 0) {
      <h3>{{ subtitle() }}</h3>
      <ul>
        @for (idea of ideas(); track idea) {
          <li>
            <a [href]="idea.link" target="_blank" rel="noopener noreferrer">
              <img [src]="idea.img_url" [alt]="idea.title" />
              <p>{{ idea.title }}</p>
            </a>
          </li>
        }
      </ul>
      @if (wishlist_link() && wishlist_tag()) {
        <a [href]="wishlist_link()" target="_blank" rel="noopener noreferrer">{{
          wishlist_tag()
        }}</a>
      }
      @if (collective_gift()) {
        <span class="material-symbols-rounded">redeem</span>
        <p>Puedes contribuir a un regalo colectivo con algo de dinero.</p>
        <button (click)="joinCollectiveGift()">Unirme al regalo colectivo</button>
      }
      @if (aditional_info()) {
        <p>{{ aditional_info() }}</p>
      }
    }
  `,
  styles: ``,
})
export class Gifts {
  ideas = input<Array<{ img_url: string; title: string; link: string }>>([]);
  title = input<string>('Regalos');
  subtitle = input<string>('Si deseas hacerme un regalo, aquí tienes algunas ideas:');
  wishlist_link = input<string>('');
  wishlist_tag = input<string>('Ver lista de regalos');
  collective_gift = input<boolean>(false);
  payment_QR_code_url = input<string>('');
  payment_QR_code_instructions = input<string>('');
  aditional_info = input<string>('');
  joinCollectiveGift() {
    //TODO: Open modal with payment QR code and instructions
  }
}
