import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CollectiveQrPayment } from '../../modal/collective-qr-payment/collective-qr-payment';

@Component({
  selector: 'app-gifts',
  imports: [CollectiveQrPayment],
  template: `
    <section class="space-y-6">
      <h2>{{ title() }}</h2>

      @if (ideas().length > 0) {
        <div>
          <h3>{{ subtitle() }}</h3>

          <div>
            @for (idea of ideas(); track idea.title) {
              <div>
                <a [href]="idea.link" target="_blank" rel="noopener noreferrer">
                  <img [src]="idea.img_url" [alt]="idea.title" />
                  <div>
                    <p>{{ idea.title }}</p>
                  </div>
                </a>
              </div>
            }
          </div>

          @if (wishlist_link() && wishlist_tag()) {
            <div>
              <a [href]="wishlist_link()" target="_blank" rel="noopener noreferrer">
                <span class="material-symbols-rounded">list_alt</span>
                {{ wishlist_tag() }}
              </a>
            </div>
          }

          @if (collective_gift()) {
            <div class="">
              <span class="material-symbols-rounded">redeem</span>
              <div>
                <h4>Regalo Colectivo</h4>
                <p>Puedes contribuir a un regalo colectivo con algo de dinero.</p>
              </div>
              <button (click)="openCollectiveGiftModal()">
                <span class="material-symbols-rounded">payments</span>
                Unirme al regalo colectivo
              </button>
            </div>
          }

          @if (aditional_info()) {
            <div>
              <p>{{ aditional_info() }}</p>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-8">
          <span class="material-symbols-rounded text-gray-400 text-4xl mb-2 block"
            >card_giftcard</span
          >
          <p class="text-gray-500">No hay ideas de regalos disponibles</p>
        </div>
      }
    </section>

    <!-- Collective Payment Modal -->
    @if (isCollectiveModalOpen()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        (click)="closeCollectiveModal()"
      >
        <div
          class="bg-white rounded-lg p-6 m-4 max-w-md w-full shadow-xl"
          (click)="$event.stopPropagation()"
        >
          <app-collective-qr-payment
            title="Regalo Colectivo"
            description="Gracias por tu contribución! Cada aporte cuenta."
            [qrCodeUrl]="payment_QR_code_url()"
            [paymentInstructions]="payment_QR_code_instructions()"
            [contactWhatsapp]="contactWhatsapp()"
            (close)="closeCollectiveModal()"
          ></app-collective-qr-payment>
        </div>
      </div>
    }
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  contactWhatsapp = input<number>();
  aditional_info = input<string>('');

  isCollectiveModalOpen = signal<boolean>(false);

  openCollectiveGiftModal() {
    this.isCollectiveModalOpen.set(true);
  }

  closeCollectiveModal() {
    this.isCollectiveModalOpen.set(false);
  }
}
