import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-collective-qr-payment',
  imports: [],
  template: `
    <div class="modal-container">
      <div class="flex justify-between items-start mb-4">
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

      <p class="typography-2 mb-4">{{ description() }}</p>

      @if (qrCodeUrl()) {
        <div class="space-y-4">
          <img
            [src]="qrCodeUrl()"
            alt="Código QR para pago colectivo"
            class="w-full max-w-xs mx-auto"
          />

          @if (paymentInstructions()) {
            <p class="typography-3">{{ paymentInstructions() }}</p>
          }

          <div class="flex gap-2 flex-wrap justify-center">
            <button (click)="copyQRCode()" type="button" class="btn-accent">Descargar QR</button>
            <button (click)="shareQR()" type="button" class="btn-accent">Compartir</button>
          </div>
        </div>
      } @else if (contactWhatsapp()) {
        <div>
          <p class="typography-3">Puedes contactarme para participar en el regalo colectivo.</p>
        </div>
      } @else {
        <p class="typography-3">No hay información de pago disponible</p>
      }

      <div class="mt-4 text-center">
        <a [href]="whatsappUrl()" target="_blank" rel="noopener noreferrer" class="link-accent">
          Escribir a WhatsApp
        </a>
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
