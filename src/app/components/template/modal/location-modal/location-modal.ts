import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venue } from '../../../../types/common/common.types';
import { LocationService } from '../../../../services/location.service';

/**
 * Modal de ubicación mejorado
 *
 * Muestra:
 * - Nombre y dirección del venue
 * - Instrucciones de cómo llegar (si disponible)
 * - Botón para abrir en Google Maps
 * - Información del país/estado
 *
 * Usa LocationService para toda la lógica de ubicación.
 *
 * @example
 * ```html
 * @if (isLocationModalOpen()) {
 *   <app-location-modal
 *     [venue]="eventData()?.venue!"
 *     (close)="closeLocationModal()"
 *   ></app-location-modal>
 * }
 * ```
 */
@Component({
  selector: 'app-location-modal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-container">
      <div class="flex justify-between items-start mb-4">
        <h2 class="typography-h2">{{ venue().name || 'Ubicación' }}</h2>
        <button
          (click)="onClose()"
          type="button"
          aria-label="Cerrar modal"
          class="btn-accent text-sm px-3 py-1"
        >
          ✕
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <p class="typography-2 font-bold mb-2">Lugar</p>
          <p class="typography-3">{{ venue().name }}</p>
        </div>

        <div>
          <p class="typography-2 font-bold mb-2">Dirección</p>
          <p class="typography-3">{{ venue().address }}</p>
          <p class="typography-3">
            {{ venue().city }}
            @if (venue().state) {
              , {{ venue().state }}
            }
          </p>
          <p class="typography-3">{{ venue().country }}</p>
        </div>

        @if (venue().instructions) {
          <div>
            <p class="typography-2 font-bold mb-2">Detalles</p>
            <p class="typography-3">{{ venue().instructions }}</p>
          </div>
        }

        <div class="text-center pt-2">
          <a [href]="mapUrl()" target="_blank" rel="noopener noreferrer" class="link-accent">
            Ver en Google Maps
          </a>
        </div>
      </div>
    </div>
  `,
})
export class LocationModal {
  private readonly locationService = inject(LocationService);

  /** Datos del venue a mostrar */
  venue = input.required<Venue>();

  /** Emitido cuando usuario cierra el modal */
  close = output<void>();

  /**
   * Coordenadas del venue si están disponibles
   */
  readonly coordinates = computed(() => this.locationService.getCoordinates(this.venue()));

  /**
   * URL del mapa para el venue
   */
  readonly mapUrl = computed(() => this.locationService.getMapUrl(this.venue()));

  /**
   * Cierra el modal
   */
  onClose(): void {
    this.close.emit();
  }
}
