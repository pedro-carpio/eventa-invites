import { Injectable } from '@angular/core';

/**
 * ShareService maneja la lógica de compartición de eventos
 * - Copia de enlaces al portapapeles
 * - Integración con APIs de compartición nativa
 * - Generación de URLs compartibles
 */
@Injectable({
  providedIn: 'root',
})
export class ShareService {
  /**
   * Copia un texto al portapapeles
   */
  copyToClipboard(text: string): Promise<boolean> {
    return navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Abre el diálogo de compartición nativo del navegador
   */
  async shareViaWeb(shareData: { title?: string; text?: string; url?: string }): Promise<boolean> {
    if (!navigator.share) {
      console.warn('Web Share API no está disponible');
      return false;
    }

    try {
      await navigator.share(shareData);
      return true;
    } catch (error: any) {
      // El usuario puede cancelar el diálogo
      if (error.name !== 'AbortError') {
        console.error('Error al compartir:', error);
      }
      return false;
    }
  }

  /**
   * Genera URL para compartir en WhatsApp
   */
  getWhatsAppShareUrl(message: string, phoneNumber?: string): string {
    const encodedMessage = encodeURIComponent(message);
    const baseUrl = 'https://wa.me/';
    return phoneNumber ? `${baseUrl}${phoneNumber}?text=${encodedMessage}` : baseUrl;
  }

  /**
   * Genera URL para compartir en Facebook
   */
  getFacebookShareUrl(url: string): string {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  }

  /**
   * Genera URL para compartir en Instagram (nota: Instagram requiere app)
   */
  getInstagramShareUrl(hashtag: string): string {
    return `https://www.instagram.com/explore/tags/${encodeURIComponent(hashtag)}`;
  }

  /**
   * Obtiene la URL actual del evento para compartir
   */
  getCurrentUrl(): string {
    return window.location.href;
  }

  /**
   * Descarga un elemento como archivo
   */
  downloadElement(element: HTMLElement, fileName: string): void {
    const link = document.createElement('a');
    link.href = element.getAttribute('href') || '';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Descarga una imagen desde una URL
   */
  downloadImage(imageUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
