import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-collective-qr-payment',
  imports: [],
  template: `
    <div>
      <h2>{{ title() }}</h2>
      <button (click)="onClose()" type="button">Cerrar</button>

      <p>{{ description() }}</p>

      @if (qrCodeUrl()) {
        <div>
          <img [src]="qrCodeUrl()" alt="Código QR para pago colectivo" />

          @if (paymentInstructions()) {
            <p>{{ paymentInstructions() }}</p>
          }

          <button (click)="copyQRCode()" type="button">Descargar QR</button>
          <button (click)="shareQR()" type="button">Compartir</button>
        </div>
      } @else if (contactWhatsapp()) {
        <div>
          <p>Contacta por WhatsApp para participar en el regalo colectivo</p>

          <a [href]="whatsappUrl()" target="_blank" rel="noopener noreferrer">
            Escribir por WhatsApp
          </a>
        </div>
      } @else {
        <p>No hay información de pago disponible</p>
      }

      <button (click)="onClose()" type="button">Cerrar</button>
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
