import { ChangeDetectionStrategy, Component, input, signal, computed, inject } from '@angular/core';
import { Contact } from '../../module/contact/contact';
import { Countdown } from '../../module/countdown/countdown';
import { Galery } from '../../module/galery/galery';
import { Guests } from '../../module/guests/guests';
import { Info } from '../../module/info/info';
import { Itinerary } from '../../module/itinerary/itinerary';
import { Rsvp } from '../../module/rsvp/rsvp';
import { ShareModal } from '../../modal/share-modal/share-modal';
import { BabyShower } from '../../../../types/event/baby-shower.types';
import { LocationModal } from '../../modal/location-modal/location-modal';
import { Notes } from '../../module/notes/notes';
import { Gifts } from '../../module/gifts/gifts';
import { TemplateBase } from '../../template.base';
import { InviteService } from '../../../../services/invite.service';
import { ShareService } from '../../../../services/share.service';
import { GoogleMapsService } from '../../../../services/maps.service';
import { LocationService } from '../../../../services/location.service';

/**
 * Componente para plantilla de Bautizo/Baby Shower
 * Extiende TemplateBase para acceso a servicios comunes de eventos
 *
 * Responsabilidades:
 * - Mostrar datos del evento de bautizo
 * - Gestionar modales (ubicación, compartir)
 * - Coordinar datos entre módulos (rsvp, regalos, galería, etc.)
 * - Usar LocationService para lógica de ubicación
 *
 * @example
 * ```html
 * <app-vinculo-natural
 *   [principalPhotoUrl]="photoUrl"
 *   [eventData]="eventData">
 * </app-vinculo-natural>
 * ```
 */
@Component({
  selector: 'app-vinculo-natural',
  imports: [
    Contact,
    Countdown,
    Galery,
    Guests,
    Info,
    Itinerary,
    Rsvp,
    Notes,
    Gifts,
    ShareModal,
    LocationModal,
  ],
  templateUrl: './vinculo-natural.html',
  styleUrls: ['./vinculo-natural.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VinculoNatural extends TemplateBase<BabyShower> {
  private readonly locationService = inject(LocationService);

  // ===== INPUTS =====
  principalPhotoUrl = input<string>('https://placehold.co/600x400');
  eventDataInput = input<BabyShower | undefined>();

  // ===== SIGNALS =====
  isLocationModalOpen = signal<boolean>(false);
  isShareModalOpen = signal<boolean>(false);

  // ===== COMPUTED SIGNALS =====
  /**
   * Calcula la fecha formateada del evento
   */
  readonly currentEventDate = computed(() => {
    const event = this.eventData();
    if (!event) {
      return { day: 1, month: 'ENE', year: 1970 };
    }
    return this.formatDate(event.date);
  });

  /**
   * Calcula los datos de ubicación para el módulo de itinerario
   * Usa LocationService para construir las actividades
   */
  readonly locationData = computed(() => {
    const event = this.eventData();
    if (!event) {
      return [];
    }
    return this.locationService.getLocationActivities(
      event.venue,
      this.openLocationModal.bind(this),
    );
  });

  /**
   * Constructor con inyección de servicios
   */
  constructor(
    inviteService: InviteService,
    shareService: ShareService,
    mapsService: GoogleMapsService,
  ) {
    super(inviteService, shareService, mapsService);
  }

  /**
   * Carga los datos del evento (implementación abstracta)
   * Intenta usar el input, sino carga datos de demo
   */
  protected override loadEventData(): void {
    const inputEvent = this.eventDataInput();

    if (inputEvent && this.isEventValid()) {
      this.eventData.set(inputEvent);
    } else {
      // Carga datos de demostración
      try {
        const demoData = this.inviteService.getDemoData();
        this.eventData.set(demoData);
      } catch (error) {
        this.handleError(error as Error);
      }
    }
  }

  // ===== MODAL MANAGEMENT =====

  /**
   * Abre el modal de ubicación
   */
  openLocationModal(): void {
    this.isLocationModalOpen.set(true);
  }

  /**
   * Cierra el modal de ubicación
   */
  closeLocationModal(): void {
    this.isLocationModalOpen.set(false);
  }

  /**
   * Abre el modal de compartir
   */
  openShareModal(): void {
    this.isShareModalOpen.set(true);
  }

  /**
   * Cierra el modal de compartir
   */
  closeShareModal(): void {
    this.isShareModalOpen.set(false);
  }
}
