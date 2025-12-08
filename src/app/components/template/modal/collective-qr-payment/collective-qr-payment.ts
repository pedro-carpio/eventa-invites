import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-collective-qr-payment',
  imports: [],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold">{{ title() }}</h2>
        <button (click)="onClose()" class="text-gray-500 hover:text-gray-700">
          <span class="material-symbols-rounded">close</span>
        </button>
      </div>

      <p class="text-gray-600">{{ description() }}</p>

      @if (qrCodeUrl()) {
        <div class="flex flex-col items-center gap-4">
          <div class="bg-white p-4 rounded-lg shadow border">
            <img [src]="qrCodeUrl()" alt="Código QR para pago colectivo" class="w-48 h-48" />
          </div>

          @if (paymentInstructions()) {
            <div class="bg-blue-50 p-3 rounded-lg">
              <p class="text-sm text-blue-800">{{ paymentInstructions() }}</p>
            </div>
          }

          <div class="flex gap-2">
            <button (click)="copyQRCode()" class="btn btn-outline btn-sm">
              <span class="material-symbols-rounded text-sm">download</span>
              Descargar QR
            </button>
            <button (click)="shareQR()" class="btn btn-primary btn-sm">
              <span class="material-symbols-rounded text-sm">share</span>
              Compartir
            </button>
          </div>
        </div>
      } @else if (contactWhatsapp()) {
        <div class="text-center space-y-4">
          <div class="bg-green-50 p-4 rounded-lg">
            <span class="material-symbols-rounded text-green-600 text-2xl mb-2 block">chat</span>
            <p class="text-green-800">
              Contacta por WhatsApp para participar en el regalo colectivo
            </p>
          </div>

          <a
            [href]="whatsappUrl()"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-success w-full"
          >
            <span class="material-symbols-rounded">chat</span>
            Escribir por WhatsApp
          </a>
        </div>
      } @else {
        <div class="text-center py-8">
          <span class="material-symbols-rounded text-gray-400 text-4xl mb-2 block"
            >error_outline</span
          >
          <p class="text-gray-500">No hay información de pago disponible</p>
        </div>
      }

      <button (click)="onClose()" class="btn btn-outline w-full">Cerrar</button>
    </div>
  `,
  styles: ``,
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
