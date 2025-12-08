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
    <div class="location-modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ venue().name || 'Ubicación' }}</h2>
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
        <div class="venue-info">
          <div class="info-section">
            <h3 class="info-label">📍 Lugar</h3>
            <p class="info-value">{{ venue().name }}</p>
          </div>

          <div class="info-section">
            <h3 class="info-label">🏠 Dirección</h3>
            <p class="info-value">{{ venue().address }}</p>
            <p class="info-value">
              {{ venue().city }}
              @if (venue().state) {
                , {{ venue().state }}
              }
            </p>
            <p class="info-value">{{ venue().country }}</p>
          </div>

          @if (venue().instructions) {
            <div class="info-section">
              <h3 class="info-label">🚗 Cómo llegar</h3>
              <p class="info-value instructions">{{ venue().instructions }}</p>
            </div>
          }

          @if (coordinates(); as coords) {
            <div class="info-section">
              <h3 class="info-label">📐 Coordenadas</h3>
              <p class="info-value coordinates">
                {{ coords.latitude.toFixed(4) }}, {{ coords.longitude.toFixed(4) }}
              </p>
            </div>
          }
        </div>

        <div class="modal-preview">
          <img
            src="https://via.placeholder.com/400x300?text=Ubicación"
            alt="Mapa preview"
            class="map-preview-image"
          />
        </div>
      </div>

      <div class="modal-actions">
        <a
          [href]="mapUrl()"
          target="_blank"
          rel="noopener noreferrer"
          class="action-button primary"
        >
          🗺️ Ver en Google Maps
        </a>
        <button (click)="onClose()" type="button" class="action-button secondary">Cerrar</button>
      </div>
    </div>
  `,
  styles: `
    .location-modal-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border, #e5e7eb);
    }

    .modal-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-text-primary, #1f2937);
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
      color: var(--color-text-secondary, #6b7280);
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: var(--color-hover-bg, #f3f4f6);
      }

      &:focus {
        outline: 2px solid var(--color-focus, #3b82f6);
        outline-offset: 2px;
      }
    }

    .modal-content {
      display: flex;
      gap: 1.5rem;
      flex-direction: column;

      @media (min-width: 640px) {
        flex-direction: row;
      }
    }

    .venue-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .info-label {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-primary, #3b82f6);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-value {
      margin: 0;
      color: var(--color-text-secondary, #6b7280);
      line-height: 1.6;

      &.instructions {
        font-style: italic;
        color: var(--color-text-tertiary, #9ca3af);
      }

      &.coordinates {
        font-family: monospace;
        font-size: 0.875rem;
        background-color: var(--color-code-bg, #f3f4f6);
        padding: 0.5rem;
        border-radius: 0.25rem;
      }
    }

    .modal-preview {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 0.5rem;
      background-color: var(--color-preview-bg, #f9fafb);
      min-height: 200px;
    }

    .map-preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.5rem;
    }

    .modal-actions {
      display: flex;
      gap: 0.75rem;
      padding-top: 1rem;
      border-top: 1px solid var(--color-border, #e5e7eb);
      flex-wrap: wrap;
    }

    .action-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
      text-decoration: none;
      flex: 1;
      min-height: 2.5rem;

      &.primary {
        background-color: var(--color-primary, #3b82f6);
        color: white;

        &:hover {
          background-color: var(--color-primary-dark, #2563eb);
        }

        &:focus {
          outline: 2px solid var(--color-focus, #3b82f6);
          outline-offset: 2px;
        }
      }

      &.secondary {
        background-color: var(--color-secondary-bg, #f3f4f6);
        color: var(--color-text-primary, #1f2937);
        border: 1px solid var(--color-secondary-border, #d1d5db);

        &:hover {
          background-color: var(--color-secondary-hover, #e5e7eb);
        }

        &:focus {
          outline: 2px solid var(--color-focus, #3b82f6);
          outline-offset: 2px;
        }
      }
    }

    @media (max-width: 640px) {
      .location-modal-container {
        gap: 1rem;
      }

      .action-button {
        flex-direction: column;
      }
    }
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
