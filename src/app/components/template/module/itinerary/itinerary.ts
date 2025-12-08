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
  styles: [],
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
