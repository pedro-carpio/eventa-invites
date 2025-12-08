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
    <div>
      <h2>{{ venue().name || 'Ubicación' }}</h2>
      <button (click)="onClose()" type="button" aria-label="Cerrar modal">Cerrar</button>

      <h3>Lugar</h3>
      <p>{{ venue().name }}</p>

      <h3>Dirección</h3>
      <p>{{ venue().address }}</p>
      <p>
        {{ venue().city }}
        @if (venue().state) {
          , {{ venue().state }}
        }
      </p>
      <p>{{ venue().country }}</p>

      @if (venue().instructions) {
        <h3>Cómo llegar</h3>
        <p>{{ venue().instructions }}</p>
      }

      @if (coordinates(); as coords) {
        <h3>Coordenadas</h3>
        <p>{{ coords.latitude.toFixed(4) }}, {{ coords.longitude.toFixed(4) }}</p>
      }

      <a [href]="mapUrl()" target="_blank" rel="noopener noreferrer"> Ver en Google Maps </a>
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
