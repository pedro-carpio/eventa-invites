import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { CollectiveQrPayment } from '../../modal/collective-qr-payment/collective-qr-payment';

@Component({
  selector: 'app-gifts',
  imports: [CollectiveQrPayment],
  template: `
    <div class="w-full max-w-md rounded-2xl p-4 text-center" style="background-color: #F4F1F8">
      <h2 class="text-2xl font-barriecito mb-3" style="color: #222222">
        {{ title() }}
      </h2>

      @if (ideas().length > 0) {
        <div class="mb-4">
          <h3 class="text-sm mb-3" style="font-family: 'Quicksand', sans-serif; color: #222222">
            {{ subtitle() }}
          </h3>

          <div class="flex flex-col gap-3 mb-4">
            @for (idea of ideas(); track idea.title) {
              <a
                [href]="idea.link"
                target="_blank"
                rel="noopener noreferrer"
                class="block rounded-lg p-3"
                style="background-color: #f9f7fc"
              >
                <img [src]="idea.imgUrl" [alt]="idea.title" class="w-full rounded-lg mb-2" />
                <p class="text-xs" style="font-family: 'Quicksand', sans-serif; color: #222222">
                  {{ idea.title }}
                </p>
              </a>
            }
          </div>

          @if (wishlistLink() && wishlistTag()) {
            <a
              [href]="wishlistLink()"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block px-4 py-2 rounded-lg text-white font-quicksand mb-4"
              style="background-color: #7fc29b"
            >
              <span class="material-symbols-rounded text-sm">list_alt</span>
              {{ wishlistTag() }}
            </a>
          }

          @if (collectiveGift()) {
            <div
              class="p-3 rounded-lg mb-4"
              style="background-color: #f9f7fc; border: 2px solid #7fc29b"
            >
              <span class="material-symbols-rounded block text-2xl mb-2" style="color: #7fc29b">
                redeem
              </span>
              <h4
                class="text-sm font-bold mb-1"
                style="font-family: 'Quicksand', sans-serif; color: #222222"
              >
                {{ collectiveGiftTitle() }}
              </h4>
              <p class="text-xs mb-3" style="font-family: 'Quicksand', sans-serif; color: #222222">
                {{ collectiveGiftDescription() }}
              </p>
              <button
                (click)="openCollectiveGiftModal()"
                class="w-full px-4 py-2 rounded-lg text-white font-quicksand"
                style="background-color: #7fc29b"
              >
                <span class="material-symbols-rounded text-sm">payments</span>
                {{ collectiveGiftButtonTag() }}
              </button>
            </div>
          }

          @if (additionalInfo()) {
            <p class="text-xs" style="font-family: 'Quicksand', sans-serif; color: #222222">
              {{ additionalInfo() }}
            </p>
          }
        </div>
      } @else {
        <div class="text-center py-8">
          <span class="material-symbols-rounded text-4xl mb-2 block" style="color: #7fc29b">
            card_giftcard
          </span>
          <p class="text-xs" style="font-family: 'Quicksand', sans-serif; color: #7fc29b">
            Tu presencia es el regalo más preciado
          </p>
        </div>
      }
    </div>

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
            [title]="collectiveGiftTitle()"
            [description]="collectiveGiftDescription()"
            [qrCodeUrl]="paymentQrCodeUrl()"
            [paymentInstructions]="paymentQrCodeInstructions()"
            [contactWhatsapp]="contactWhatsapp()"
            (close)="closeCollectiveModal()"
          ></app-collective-qr-payment>
        </div>
      </div>
    }
  `,
  styles: [],
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
  collectiveGiftTitle = input<string>('Regalo Colectivo');
  collectiveGiftDescription = input<string>(
    'Puedes contribuir a un regalo colectivo con algo de dinero.',
  );
  collectiveGiftButtonTag = input<string>('Unirme al regalo colectivo');

  isCollectiveModalOpen = signal<boolean>(false);

  openCollectiveGiftModal() {
    this.isCollectiveModalOpen.set(true);
  }

  closeCollectiveModal() {
    this.isCollectiveModalOpen.set(false);
  }
}
