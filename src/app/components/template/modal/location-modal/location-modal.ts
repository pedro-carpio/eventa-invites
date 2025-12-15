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
    <div class="modal-container md:flex md:gap-6 md:items-stretch">
      <!-- Encabezado (full width en móvil, arriba en md+) -->
      <div class="md:hidden flex justify-between items-start mb-4 w-full">
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

      <!-- Mapa a la izquierda (50% en md+) -->
      <div
        class="md:w-1/2 md:h-auto md:min-h-80 lg:min-h-96 4xl:min-h-[28rem] flex items-center justify-center bg-gray-200 rounded-lg mb-4 md:mb-0"
      >
        <div class="text-center p-4">
          <p class="typography-3 text-gray-600 mb-2">{{ venue().name }}</p>
          <a
            [href]="mapUrl()"
            target="_blank"
            rel="noopener noreferrer"
            class="link-accent inline-block py-2 px-4 bg-white hover:bg-green-50 rounded-lg font-semibold transition-all hover:scale-105"
          >
            Abrir en Google Maps →
          </a>
        </div>
      </div>

      <!-- Información a la derecha (50% en md+) -->
      <div
        class="space-y-4 md:space-y-5 md:w-1/2 md:flex md:flex-col md:justify-between bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div>
          <!-- Encabezado para desktop -->
          <div class="hidden md:flex justify-between items-start mb-4">
            <h2 class="typography-h2">{{ venue().name || 'Ubicación' }}</h2>
            <button
              (click)="onClose()"
              type="button"
              aria-label="Cerrar modal"
              class="btn-accent text-sm px-3 py-1 md:px-4 md:py-2 flex-shrink-0 hover:scale-110 transition-transform"
            >
              ✕
            </button>
          </div>

          <div>
            <p class="typography-2 font-bold mb-2">Lugar</p>
            <p class="typography-3">{{ venue().name }}</p>
          </div>

          <div class="mt-4">
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
            <div class="mt-4">
              <p class="typography-2 font-bold mb-2">Detalles</p>
              <p class="typography-3">{{ venue().instructions }}</p>
            </div>
          }
        </div>

        <!-- Botón WhatsApp en móvil -->
        <div class="md:hidden text-center pt-2">
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
