import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-collective-qr-payment',
  imports: [],
  template: `
    <div class="modal-container md:flex md:gap-6 md:items-stretch">
      <!-- Encabezado (full width en móvil) -->
      <div class="md:hidden flex justify-between items-start mb-4 w-full">
        <h2 class="typography-h2">{{ title() }}</h2>
        <button
          (click)="onClose()"
          type="button"
          aria-label="Cerrar modal"
          class="btn-accent text-sm px-3 py-1"
        >
          ✕
        </button>
      </div>

      <!-- QR a la izquierda (50% en md+) -->
      @if (qrCodeUrl()) {
        <div
          class="md:w-1/2 md:h-auto md:min-h-80 lg:min-h-96 4xl:min-h-[28rem] flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4 md:p-6 mb-4 md:mb-0"
        >
          <img
            [src]="qrCodeUrl()"
            alt="Código QR para pago colectivo"
            class="w-full max-w-xs md:max-w-sm lg:max-w-md 4xl:max-w-lg aspect-square object-contain"
          />

          <div class="flex gap-2 flex-wrap justify-center mt-4 md:mt-6">
            <button
              (click)="copyQRCode()"
              type="button"
              class="btn-accent text-sm md:text-base py-2 md:py-3 px-3 md:px-4 hover:scale-105 transition-transform"
            >
              Descargar
            </button>
            <button
              (click)="shareQR()"
              type="button"
              class="btn-accent text-sm md:text-base py-2 md:py-3 px-3 md:px-4 hover:scale-105 transition-transform"
            >
              Compartir
            </button>
          </div>
        </div>
      } @else {
        <div
          class="md:w-1/2 md:h-auto md:min-h-80 lg:min-h-96 4xl:min-h-[28rem] flex items-center justify-center bg-gray-200 rounded-lg mb-4 md:mb-0"
        >
          <p class="typography-3 text-gray-600">No hay QR disponible</p>
        </div>
      }

      <!-- Información a la derecha (50% en md+) -->
      <div
        class="space-y-4 md:space-y-5 md:w-1/2 md:flex md:flex-col md:justify-between bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div>
          <!-- Encabezado para desktop -->
          <div class="hidden md:flex justify-between items-start mb-4">
            <h2 class="typography-h2">{{ title() }}</h2>
            <button
              (click)="onClose()"
              type="button"
              aria-label="Cerrar modal"
              class="btn-accent text-sm px-3 py-1 md:px-4 md:py-2 flex-shrink-0 hover:scale-110 transition-transform"
            >
              ✕
            </button>
          </div>

          <p class="typography-2 mb-3 md:mb-4">{{ description() }}</p>

          @if (paymentInstructions()) {
            <p class="typography-3 text-gray-700">{{ paymentInstructions() }}</p>
          }
        </div>

        <div class="space-y-3">
          <!-- Botón WhatsApp mejorado -->
          <a
            [href]="whatsappUrl()"
            target="_blank"
            rel="noopener noreferrer"
            class="link-accent block text-center py-3 md:py-4 px-4 md:px-6 bg-white hover:bg-green-50 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
          >
            Escribir a WhatsApp →
          </a>

          <!-- Fallback para cuando no hay QR -->
          @if (!qrCodeUrl() && contactWhatsapp()) {
            <p class="typography-3 text-gray-600 text-center">
              Puedes contactarme para participar en el regalo colectivo.
            </p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectiveQrPayment {
  title = input<string>('Regalo colectivo mediante QR');
  description = input<string>('Gracias! apreciaré mucho tu regalo.');
  qrCodeUrl = input<string>();
  paymentInstructions = input<string>();
  contactWhatsapp = input<number>();
  close = output<void>();

  whatsappUrl() {
    const message = encodeURIComponent('Hola, quería participar en el regalo colectivo!');
    return `https://wa.me/${this.contactWhatsapp()}?text=${message}`;
  }

  async copyQRCode() {
    const qrUrl = this.qrCodeUrl();
    if (qrUrl) {
      try {
        // Crear un enlace temporal para descargar
        const link = document.createElement('a');
        link.href = qrUrl;
        link.download = 'regalo-colectivo-qr.png';
        link.click();
      } catch (error) {
        console.error('Error descargando QR:', error);
      }
    }
  }

  async shareQR() {
    const qrUrl = this.qrCodeUrl();
    const title = this.title();

    if (navigator.share && qrUrl) {
      try {
        // Usar Web Share API si está disponible
        await navigator.share({
          title: title,
          text: this.description(),
          url: qrUrl,
        });
      } catch (error) {
        console.log('Error compartiendo:', error);
        this.fallbackShare();
      }
    } else {
      this.fallbackShare();
    }
  }

  private fallbackShare() {
    // Fallback: copiar al portapapeles
    const text = `${this.title()}\n${this.description()}\n${this.qrCodeUrl()}`;
    navigator.clipboard.writeText(text).catch(console.error);
  }

  onClose() {
    this.close.emit();
  }
}
