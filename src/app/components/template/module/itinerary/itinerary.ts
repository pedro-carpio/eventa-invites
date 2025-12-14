import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

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
  imports: [],
  template: `
    <div class="w-full max-w-md rounded-2xl p-4 text-center" style="background-color: #F4F1F8">
      <h2 class="text-2xl font-barriecito mb-4" style="color: #222222">
        {{ title() }}
      </h2>
      <div class="flex flex-col gap-3">
        @for (activity of activities(); track activity.name) {
          <div class="p-3 rounded-lg" style="background-color: #f9f7fc">
            @if (activity.icon) {
              <span class="material-symbols-rounded block text-lg mb-1" style="color: #7fc29b">
                {{ activity.icon }}
              </span>
            }
            @if (activity.title) {
              <p
                class="text-sm font-bold mb-1"
                style="font-family: 'Quicksand', sans-serif; color: #222222"
              >
                {{ activity.title }}
              </p>
            }
            <p class="text-xs mb-1" style="font-family: 'Quicksand', sans-serif; color: #222222">
              {{ activity.name }}
            </p>
            @if (activity.time) {
              <p class="text-xs" style="font-family: 'Quicksand', sans-serif; color: #7fc29b">
                ⏰ {{ activity.time }}
              </p>
            }
            @if (activity.action && activity.button) {
              <button
                (click)="activity.action!()"
                class="w-full mt-2 px-4 py-2 rounded-lg text-white font-quicksand text-xs"
                style="background-color: #7fc29b"
              >
                {{ activity.button }}
              </button>
            }
          </div>
        }
      </div>
    </div>
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
  protected readonly sectionConfig = computed<{
    title: string;
    icon?: string;
    description: string;
    content: Activity[];
  }>(() => ({
    title: this.title(),
    icon: this.icon(),
    description: '',
    content: this.activities(),
  }));
}
