import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as QRCode from 'qrcode';
import { ShareService } from '../../../../services/share.service';

/**
 * Datos compartibles del evento
 */
export interface ShareData {
  meta: {
    title: string;
    description: string;
    imageUrl?: string;
  };
  template?: string;
}

/**
 * Modal de compartición mejorado
 *
 * Responsabilidades:
 * - Mostrar opciones de compartición (redes sociales)
 * - Generar y mostrar código QR
 * - Copiar enlace al portapapeles
 * - Descargar código QR
 *
 * Delega toda la lógica a ShareService.
 *
 * @example
 * ```html
 * @if (isShareModalOpen()) {
 *   <app-share-modal
 *     [shareData]="{ meta: { title: 'Mi evento' } }"
 *     (close)="closeShareModal()"
 *   ></app-share-modal>
 * }
 * ```
 */
@Component({
  selector: 'app-share-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h2>{{ shareData()?.meta?.title || 'Compartir Evento' }}</h2>
      <button (click)="onClose()" type="button" aria-label="Cerrar modal">Cerrar</button>

      <p>
        {{ shareData()?.meta?.description || 'Comparte este evento con tus amigos y familiares' }}
      </p>

      <h3>Opciones de compartición</h3>
      <button (click)="shareOnFacebook()" type="button">Facebook</button>
      <button (click)="shareOnWhatsApp()" type="button">WhatsApp</button>
      <button (click)="copyLink()" type="button">Copiar enlace</button>

      <h3>Código QR</h3>
      <p>Escanea para acceder al evento</p>
      @if (qrCodeDataUrl(); as qrUrl) {
        <img [src]="qrUrl" alt="Código QR del evento" />
        <button (click)="downloadQRCode()" type="button">Descargar QR</button>
      } @else {
        <p>Generando código QR...</p>
      }

      <h3>Enlace del evento</h3>
      <p>{{ currentUrl() }}</p>
      <button (click)="copyLink()" type="button">Copiar URL</button>
    </div>
  `,
})
export class ShareModal implements OnInit {
  private readonly shareService = inject(ShareService);

  /** Datos compartibles del evento */
  shareData = input<ShareData>();

  /** Emitido cuando el usuario cierra el modal */
  close = output<void>();

  /** URL del código QR generado */
  qrCodeDataUrl = signal<string>('');

  /** URL actual del evento */
  currentUrl = computed(() => this.shareService.getCurrentUrl());

  /**
   * Genera el código QR al inicializar el componente
   */
  async ngOnInit(): Promise<void> {
    await this.generateQRCode();
  }

  /**
   * Genera el código QR para el evento
   */
  private async generateQRCode(): Promise<void> {
    try {
      const url = this.currentUrl();
      const dataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'M',
        width: 128,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      this.qrCodeDataUrl.set(dataUrl);
    } catch (error) {
      console.error('Error generando código QR:', error);
    }
  }

  /**
   * Copia el enlace al portapapeles
   */
  async copyLink(): Promise<void> {
    const success = await this.shareService.copyToClipboard(this.currentUrl());
    if (success) {
      console.log('Enlace copiado al portapapeles');
      // TODO: Mostrar notificación de éxito
    }
  }

  /**
   * Descarga el código QR como imagen
   */
  downloadQRCode(): void {
    const qrUrl = this.qrCodeDataUrl();
    const title = this.shareData()?.meta?.title || 'evento';
    if (qrUrl) {
      this.shareService.downloadImage(qrUrl, `${title}-qr.png`);
    }
  }

  /**
   * Abre la ventana de compartición de Facebook
   */
  shareOnFacebook(): void {
    const url = this.currentUrl();
    const facebookUrl = this.shareService.getFacebookShareUrl(url);
    window.open(facebookUrl, '_blank', 'width=600,height=400');
  }

  /**
   * Abre la ventana de compartición de WhatsApp
   */
  shareOnWhatsApp(): void {
    const title = this.shareData()?.meta?.title || 'Evento';
    const message = `${title}\n${this.currentUrl()}`;
    const whatsappUrl = this.shareService.getWhatsAppShareUrl(message);
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Cierra el modal
   */
  onClose(): void {
    this.close.emit();
  }
}
