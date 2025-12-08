import { Directive, OnInit, OnDestroy, signal, Signal } from '@angular/core';
import { Subject } from 'rxjs';
import { Event, isValidEvent } from '../../types/event/event.types';
import { InviteService } from '../../services/invite.service';
import { ShareService } from '../../services/share.service';
import { GoogleMapsService } from '../../services/maps.service';

/**
 * Clase base abstracta para componentes de plantillas de eventos
 *
 * Proporciona:
 * - Gestión de datos del evento (carga, validación)
 * - Acceso a servicios comunes (invitaciones, compartir, mapas)
 * - Ciclo de vida completo con cleanup automático
 * - Manejo de modales y navegación
 *
 * @template T Tipo de evento (ej: BabyShower, Wedding)
 *
 * @example
 * ```typescript
 * @Component({
 *   selector: 'app-wedding',
 *   standalone: true,
 *   imports: [CommonModule],
 * })
 * export class WeddingComponent extends TemplateBase<Wedding> implements OnInit {
 *   protected override loadEventData(): void {
 *     this.eventData.set(this.inviteService.getDemoData());
 *   }
 * }
 * ```
 */
@Directive()
export abstract class TemplateBase<T extends Event> implements OnInit, OnDestroy {
  /**
   * Señal que contiene los datos del evento
   */
  protected eventData = signal<T | null>(null);

  /**
   * Señal para estado de carga
   */
  protected isLoading = signal(false);

  /**
   * Señal para mensajes de error
   */
  protected errorMessage = signal<string | null>(null);

  /**
   * Sujeto para gestionar observables y cleanup
   */
  protected readonly destroy$ = new Subject<void>();

  /**
   * Constructor con inyección de servicios
   */
  constructor(
    protected readonly inviteService: InviteService,
    protected readonly shareService: ShareService,
    protected readonly mapsService: GoogleMapsService,
  ) {}

  /**
   * Ciclo de vida: inicializa la carga de datos
   */
  ngOnInit(): void {
    this.loadEventData();
  }

  /**
   * Ciclo de vida: limpia observables y recursos
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga los datos del evento
   * Método abstracto que debe implementarse en subclases
   */
  protected abstract loadEventData(): void;

  /**
   * Obtiene los datos actuales del evento
   */
  public getEventData(): Signal<T | null> {
    return this.eventData;
  }

  /**
   * Valida que los datos del evento sean válidos
   */
  protected isEventValid(): boolean {
    const current = this.eventData();
    return current !== null && isValidEvent(current);
  }

  /**
   * Formatea una fecha para visualización
   *
   * @param date Objeto Date a formatear
   * @returns Objeto con día, mes y año
   *
   * @example
   * ```typescript
   * const formatted = this.formatDate(new Date());
   * // { day: 15, month: 'Enero', year: 2024 }
   * ```
   */
  protected formatDate(date: Date): { day: number; month: string; year: number } {
    return this.inviteService.formatDate(date);
  }

  /**
   * Calcula una fecha futura basada en días
   *
   * @param daysFromNow Número de días en el futuro
   * @returns Objeto Date con la fecha futura
   *
   * @example
   * ```typescript
   * const futureDate = this.getDateFromNow(30);
   * // Fecha 30 días en el futuro
   * ```
   */
  protected getDateFromNow(daysFromNow: number): Date {
    return this.inviteService.getDateFromNow(daysFromNow);
  }

  /**
   * Abre un mapa con las coordenadas del evento
   *
   * @example
   * ```typescript
   * this.openEventLocation();
   * // Abre Google Maps en nueva ventana con las coordenadas
   * ```
   */
  protected openEventLocation(): void {
    const event = this.eventData();
    if (!event || event.venue.latitude === undefined || event.venue.longitude === undefined) {
      console.warn('Coordenadas del evento no disponibles');
      return;
    }

    const { latitude, longitude } = event.venue;
    this.mapsService.openMap(latitude, longitude, 17);
  }

  /**
   * Obtiene la URL de Google Maps para las coordenadas del evento
   *
   * @returns URL para Google Maps o null si no hay coordenadas
   */
  protected getLocationUrl(): string | null {
    const event = this.eventData();
    if (!event || event.venue.latitude === undefined || event.venue.longitude === undefined) {
      return null;
    }

    const { latitude, longitude } = event.venue;
    return this.mapsService.getMapUrl(latitude, longitude, 17);
  }

  /**
   * Comparte el evento usando el API de compartir del navegador
   *
   * @param title Título del evento
   * @param description Descripción del evento
   *
   * @example
   * ```typescript
   * this.shareEvent('Bautizo de Sofía', 'Te invitamos a la bautizo');
   * ```
   */
  protected async shareEvent(title: string, description: string): Promise<void> {
    const url = this.shareService.getCurrentUrl();
    const success = await this.shareService.shareViaWeb({
      title,
      text: description,
      url,
    });

    if (!success) {
      console.log('Compartir no está disponible en este navegador');
    }
  }

  /**
   * Copia la URL del evento al portapapeles
   *
   * @example
   * ```typescript
   * await this.copyEventUrl();
   * // URL copiada al portapapeles
   * ```
   */
  protected async copyEventUrl(): Promise<void> {
    const url = this.shareService.getCurrentUrl();
    const success = await this.shareService.copyToClipboard(url);

    if (success) {
      console.log('URL copiada al portapapeles');
    }
  }

  /**
   * Obtiene la URL de WhatsApp para compartir el evento
   *
   * @param message Mensaje personalizado para WhatsApp
   * @param phoneNumber Número de teléfono destino (opcional)
   * @returns URL de WhatsApp
   *
   * @example
   * ```typescript
   * const whatsappUrl = this.getWhatsAppShareUrl(
   *   'Te invito a la bautizo de Sofía'
   * );
   * // Abre WhatsApp al hacer clic en el enlace
   * ```
   */
  protected getWhatsAppShareUrl(message: string, phoneNumber?: string): string {
    return this.shareService.getWhatsAppShareUrl(message, phoneNumber);
  }

  /**
   * Obtiene la URL de Facebook para compartir el evento
   *
   * @returns URL de Facebook Share
   */
  protected getFacebookShareUrl(): string {
    const url = this.shareService.getCurrentUrl();
    return this.shareService.getFacebookShareUrl(url);
  }

  /**
   * Obtiene la URL de Instagram para hashtag del evento
   *
   * @param hashtag Hashtag del evento (sin #)
   * @returns URL de Instagram
   *
   * @example
   * ```typescript
   * const instagramUrl = this.getInstagramShareUrl('bautizo2024');
   * ```
   */
  protected getInstagramShareUrl(hashtag: string): string {
    return this.shareService.getInstagramShareUrl(hashtag);
  }

  /**
   * Manejo de errores en la carga de datos
   */
  protected handleError(error: Error): void {
    console.error('Error en componente de plantilla:', error);
    this.errorMessage.set(
      'No se pudieron cargar los datos del evento. Por favor, intenta de nuevo.',
    );
  }

  /**
   * Utilidad: clona un evento para evitar mutaciones
   *
   * @param event Evento a clonar
   * @returns Copia profunda del evento
   */
  protected cloneEventData(event: T): T {
    return this.inviteService.cloneEvent(event) as T;
  }

  /**
   * Utilidad: verifica si el evento es válido
   *
   * @param event Evento a validar
   * @returns true si el evento es válido
   */
  protected validateEvent(event: unknown): boolean {
    return isValidEvent(event);
  }
}
