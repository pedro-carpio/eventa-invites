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
                  <img [src]="idea.imgUrl" [alt]="idea.title" />
                  <div>
                    <p>{{ idea.title }}</p>
                  </div>
                </a>
              </div>
            }
          </div>

          @if (wishlistLink() && wishlistTag()) {
            <div>
              <a [href]="wishlistLink()" target="_blank" rel="noopener noreferrer">
                <span class="material-symbols-rounded">list_alt</span>
                {{ wishlistTag() }}
              </a>
            </div>
          }

          @if (collectiveGift()) {
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

          @if (additionalInfo()) {
            <div>
              <p>{{ additionalInfo() }}</p>
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
            [qrCodeUrl]="paymentQrCodeUrl()"
            [paymentInstructions]="paymentQrCodeInstructions()"
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
  ideas = input<Array<{ imgUrl: string; title: string; link: string }>>([]);
  title = input<string>('Regalos');
  subtitle = input<string>('Si deseas hacerme un regalo, aquí tienes algunas ideas:');
  wishlistLink = input<string>('');
  wishlistTag = input<string>('Ver lista de regalos');
  collectiveGift = input<boolean>(false);
  paymentQrCodeUrl = input<string>('');
  paymentQrCodeInstructions = input<string>('');
  contactWhatsapp = input<number>();
  additionalInfo = input<string>('');

  isCollectiveModalOpen = signal<boolean>(false);

  openCollectiveGiftModal() {
    this.isCollectiveModalOpen.set(true);
  }

  closeCollectiveModal() {
    this.isCollectiveModalOpen.set(false);
  }
}
