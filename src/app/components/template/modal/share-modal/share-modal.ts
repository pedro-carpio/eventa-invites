import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface ShareData {
  meta: {
    title: string;
    description: string;
    image_url?: string;
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
        <button class="btn btn-primary">Publicar por Facebook</button>
        <button class="btn btn-secondary">Publicar por Instagram</button>
        <button class="btn btn-outline">Copiar enlace</button>
      </div>

      @if (shareData()?.meta?.image_url) {
        <div class="flex flex-col items-center gap-2">
          <img [src]="shareData()!.meta.image_url" alt="QR Code" class="w-32 h-32" />
          <button class="btn btn-sm">Copiar código QR</button>
        </div>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShareModal {
  shareData = input<ShareData>();
  close = output<void>();

  onClose() {
    this.close.emit();
  }
}
