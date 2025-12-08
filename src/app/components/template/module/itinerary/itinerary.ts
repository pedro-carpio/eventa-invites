import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionComponent, SectionConfig } from '../../section/section.component';

/**
 * Tipo para una actividad en el itinerario
 */
export type Activity = {
  /** Icono Material Symbols (opcional) */
  icon?: string;
  /** Título de la actividad */
  title?: string;
  /** Nombre/descripción de la actividad */
  name: string;
  /** Hora de la actividad (opcional) */
  time?: string;
  /** Función de acción (opcional) */
  action?: () => void;
  /** Etiqueta del botón de acción */
  button?: string;
};

/**
 * Componente Itinerary: Sección de itinerario
 *
 * Muestra una lista de actividades con iconos, títulos, horas y acciones.
 * Soporta embellecimiento visual opcional (flourishes).
 *
 * @example
 * ```typescript
 * <app-itinerary
 *   title="Agenda del evento"
 *   icon="schedule"
 *   [activities]="[
 *     { title: 'Bienvenida', name: 'Registro', time: '14:00' },
 *     { title: 'Ceremonia', name: 'En la capilla', time: '15:00' }
 *   ]"
 * ></app-itinerary>
 * ```
 */
@Component({
  selector: 'app-itinerary',
  standalone: true,
  imports: [CommonModule, SectionComponent],
  template: `
    <app-section [config]="sectionConfig()">
      <div class="activities-list">
        @for (activity of activities(); track activity.name) {
          <div class="activity-item" [class.has-action]="activity.action">
            @if (activity.icon) {
              <span class="activity-icon material-symbols-rounded">
                {{ activity.icon }}
              </span>
            }
            <div class="activity-content">
              @if (activity.title) {
                <strong class="activity-title">{{ activity.title }}</strong>
              }
              <p class="activity-name">{{ activity.name }}</p>
              @if (activity.time) {
                <span class="activity-time">⏰ {{ activity.time }}</span>
              }
            </div>
            @if (activity.action && activity.button) {
              <button class="activity-button" (click)="activity.action!()" type="button">
                {{ activity.button }}
              </button>
            }
          </div>
        }
      </div>
    </app-section>
  `,
  styles: `
    .activities-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem;
      border-radius: 0.375rem;
      background-color: var(--color-activity-bg, #f3f4f6);
      border-left: 4px solid var(--color-primary, #3b82f6);

      &.has-action {
        border-left-color: var(--color-success, #10b981);
      }
    }

    .activity-icon {
      flex-shrink: 0;
      color: var(--color-primary, #3b82f6);
      font-size: 1.5rem;
      margin-top: 0.125rem;
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-title {
      display: block;
      margin: 0 0 0.25rem;
      color: var(--color-text-primary, #1f2937);
      font-weight: 600;
    }

    .activity-name {
      margin: 0;
      color: var(--color-text-secondary, #6b7280);
      line-height: 1.5;
    }

    .activity-time {
      display: block;
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--color-text-tertiary, #9ca3af);
    }

    .activity-button {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      border: none;
      background-color: var(--color-success, #10b981);
      color: white;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.2s ease;
      flex-shrink: 0;
      font-size: 0.875rem;

      &:hover {
        background-color: var(--color-success-dark, #059669);
      }

      &:focus {
        outline: 2px solid var(--color-focus, #10b981);
        outline-offset: 2px;
      }
    }

    @media (max-width: 640px) {
      .activity-item {
        flex-direction: column;
        gap: 0.75rem;
      }

      .activity-button {
        width: 100%;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Itinerary {
  /** Mostrar embellecimiento visual (flourishes) */
  flourishes = input<boolean>(true);

  /** Icono de la sección */
  icon = input<string>('assignment_turned_in');

  /** Título de la sección */
  title = input<string>('Itinerario');

  /** Lista de actividades */
  activities = input<Activity[]>([]);

  /**
   * Computed signal para configuración de sección
   */
  protected sectionConfig = computed<SectionConfig<Activity[]>>(() => ({
    title: this.title(),
    icon: this.icon(),
    description: '',
    content: this.activities(),
  }));
}
