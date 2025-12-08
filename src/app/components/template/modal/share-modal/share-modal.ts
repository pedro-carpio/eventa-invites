import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import * as QRCode from 'qrcode';

export interface ShareData {
  meta: {
    title: string;
    description: string;
    imageUrl?: string;
  };
  template?: string;
}

@Component({
  selector: 'app-share-modal',
  imports: [],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold">{{ shareData()?.meta?.title || 'Compartir Evento' }}</h2>
        <button (click)="onClose()" class="text-gray-500 hover:text-gray-700">
          <span class="material-symbols-rounded">close</span>
        </button>
      </div>

      <p class="text-gray-600">
        {{ shareData()?.meta?.description || 'Comparte este evento con tus amigos y familiares' }}
      </p>

      <div class="flex flex-col gap-2">
        <button class="btn btn-primary" (click)="shareOnFacebook()">Publicar por Facebook</button>
        <button class="btn btn-secondary" (click)="shareOnInstagram()">
          Publicar por Instagram
        </button>
        <button class="btn btn-outline" (click)="copyLink()">Copiar enlace</button>
      </div>

      <div class="flex flex-col items-center gap-2">
        <p class="text-sm text-gray-500">Escanea para acceder al evento:</p>
        @if (qrCodeDataUrl()) {
          <img [src]="qrCodeDataUrl()" alt="QR Code del evento" class="w-32 h-32 border rounded" />
        } @else {
          <div class="w-32 h-32 bg-gray-200 flex items-center justify-center rounded">
            <span class="text-gray-500 text-xs">Generando QR...</span>
          </div>
        }
        <button class="btn btn-sm" (click)="copyQRCode()">Descargar código QR</button>
      </div>

      <div class="text-xs text-gray-400 break-all">URL: {{ currentUrl() }}</div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareModal implements OnInit {
  shareData = input<ShareData>();
  close = output<void>();

  qrCodeDataUrl = signal<string>('');
  currentUrl = computed(() => window.location.href);

  async ngOnInit() {
    await this.generateQRCode();
  }

  async generateQRCode() {
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
      console.error('Error generando QR code:', error);
    }
  }

  async copyLink() {
    try {
      await navigator.clipboard.writeText(this.currentUrl());
      // TODO: Mostrar notificación de éxito
    } catch (error) {
      console.error('Error copiando enlace:', error);
    }
  }

  async copyQRCode() {
    const qrUrl = this.qrCodeDataUrl();
    if (qrUrl) {
      // Crear un enlace temporal para descargar
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = `${this.shareData()?.meta?.title || 'evento'}-qr.png`;
      link.click();
    }
  }

  shareOnFacebook() {
    const url = encodeURIComponent(this.currentUrl());
    const title = encodeURIComponent(this.shareData()?.meta?.title || 'Evento');
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}&title=${title}&amp;src=sdkpreparse`,
      '_blank',
    );
  }

  shareOnInstagram() {
    // Instagram no permite compartir enlaces directamente, pero podemos copiar el enlace
    this.copyLink();
    // TODO: Mostrar mensaje indicando que el enlace se copió para Instagram
  }

  onClose() {
    this.close.emit();
  }
}
