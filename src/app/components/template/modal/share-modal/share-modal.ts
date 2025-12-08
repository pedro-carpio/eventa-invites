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
    <div class="share-modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ shareData()?.meta?.title || 'Compartir Evento' }}</h2>
        <button
          class="modal-close-button"
          (click)="onClose()"
          type="button"
          aria-label="Cerrar modal"
        >
          ×
        </button>
      </div>

      <div class="modal-content">
        <p class="description">
          {{ shareData()?.meta?.description || 'Comparte este evento con tus amigos y familiares' }}
        </p>

        <div class="share-options">
          <button
            class="share-button facebook"
            (click)="shareOnFacebook()"
            title="Compartir en Facebook"
          >
            <span class="share-icon">f</span>
            <span class="share-label">Facebook</span>
          </button>

          <button
            class="share-button whatsapp"
            (click)="shareOnWhatsApp()"
            title="Compartir en WhatsApp"
          >
            <span class="share-icon">W</span>
            <span class="share-label">WhatsApp</span>
          </button>

          <button class="share-button copy" (click)="copyLink()" title="Copiar enlace">
            <span class="share-icon">🔗</span>
            <span class="share-label">Copiar enlace</span>
          </button>
        </div>

        <div class="qr-section">
          <h3 class="section-title">📱 Código QR</h3>
          <p class="section-description">Escanea para acceder al evento</p>

          @if (qrCodeDataUrl(); as qrUrl) {
            <img [src]="qrUrl" alt="Código QR del evento" class="qr-image" />
            <button class="download-button" (click)="downloadQRCode()" type="button">
              ⬇️ Descargar QR
            </button>
          } @else {
            <div class="qr-loading">
              <div class="spinner"></div>
              <p>Generando código QR...</p>
            </div>
          }
        </div>

        <div class="url-section">
          <label class="url-label">Enlace del evento:</label>
          <div class="url-display">
            <p class="url-text">{{ currentUrl() }}</p>
            <button class="copy-url-button" (click)="copyLink()" type="button" title="Copiar URL">
              Copiar
            </button>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button (click)="onClose()" type="button" class="action-button secondary">Cerrar</button>
      </div>
    </div>
  `,
  styles: `
    .share-modal-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .modal-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }
    .modal-close-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      padding: 0;
      border: none;
      border-radius: 0.375rem;
      background-color: transparent;
      color: #6b7280;
      cursor: pointer;
      transition: background-color 0.2s ease;
      font-size: 1.5rem;
    }
    .modal-close-button:hover {
      background-color: #f3f4f6;
    }
    .modal-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .description {
      margin: 0;
      color: #6b7280;
      line-height: 1.6;
    }
    .share-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
      gap: 0.75rem;
    }
    .share-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      border: 2px solid #e5e7eb;
      border-radius: 0.5rem;
      background-color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .share-button:hover {
      border-color: #3b82f6;
      background-color: #f3f4f6;
    }
    .share-icon {
      font-size: 1.5rem;
      font-weight: bold;
      color: #6b7280;
    }
    .qr-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background-color: #f9fafb;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }
    .section-title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }
    .section-description {
      margin: 0;
      font-size: 0.875rem;
      color: #6b7280;
    }
    .qr-image {
      width: 150px;
      height: 150px;
      border: 2px solid #e5e7eb;
      border-radius: 0.375rem;
      background-color: white;
      padding: 0.5rem;
    }
    .qr-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }
    .qr-loading p {
      margin: 0;
      color: #6b7280;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e5e7eb;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .download-button {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      background-color: #3b82f6;
      color: white;
      cursor: pointer;
      font-weight: 500;
    }
    .download-button:hover {
      background-color: #2563eb;
    }
    .url-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem;
      background-color: #f3f4f6;
      border-radius: 0.375rem;
      border: 1px solid #e5e7eb;
    }
    .url-label {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
    }
    .url-display {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .url-text {
      margin: 0;
      font-family: monospace;
      font-size: 0.75rem;
      color: #6b7280;
      word-break: break-all;
      flex: 1;
    }
    .copy-url-button {
      padding: 0.5rem 1rem;
      border: 1px solid #3b82f6;
      border-radius: 0.25rem;
      background-color: white;
      color: #3b82f6;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 500;
      white-space: nowrap;
    }
    .copy-url-button:hover {
      background-color: #3b82f6;
      color: white;
    }
    .modal-actions {
      display: flex;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }
    .action-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.25rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      background-color: #f3f4f6;
      color: #1f2937;
      cursor: pointer;
      font-weight: 500;
      flex: 1;
    }
    .action-button:hover {
      background-color: #e5e7eb;
    }
    @media (max-width: 640px) {
      .share-options {
        grid-template-columns: repeat(3, 1fr);
      }
      .url-display {
        flex-direction: column;
      }
    }
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
