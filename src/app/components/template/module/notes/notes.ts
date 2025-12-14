import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Tipo para una nota individual
 */
export type Note = {
  /** Icono Material Symbols para la nota */
  icon: string;
  /** Texto de la nota */
  text: string;
};

/**
 * Componente Notes: Sección de notas con iconos
 *
 * Muestra una lista de notas, cada una con un icono y texto.
 * Usa SectionComponent para consistencia visual.
 *
 * @example
 * ```typescript
 * <app-notes
 *   title="Notas importantes"
 *   [content]="[
 *     { icon: 'info', text: 'La entrada es gratuita' },
 *     { icon: 'parking', text: 'Hay estacionamiento disponible' }
 *   ]"
 * ></app-notes>
 * ```
 */
@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [],
  template: `
    <div class="w-full max-w-md rounded-2xl p-4 text-center" style="background-color: #F4F1F8">
      <h2 class="text-2xl font-barriecito mb-4" style="color: #222222">
        {{ title() }}
      </h2>
      <div class="flex flex-col gap-3">
        @for (note of content(); track note.text) {
          <div
            class="flex flex-col items-center gap-2 p-3 rounded-lg"
            style="background-color: #f9f7fc"
          >
            <span class="material-symbols-rounded text-lg" style="color: #7fc29b">
              {{ note.icon }}
            </span>
            <p class="text-xs" style="font-family: 'Quicksand', sans-serif; color: #222222">
              {{ note.text }}
            </p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notes {
  /** Título de la sección de notas */
  title = input<string>('Notas');

  /** Contenido: array de notas */
  content = input<Note[]>([]);

  /**
   * Computed signal para configuración de sección
   */
  protected readonly sectionConfig = computed<{
    title: string;
    description: string;
    content: Note[];
  }>(() => ({
    title: this.title(),
    description: '',
    content: this.content(),
  }));
}
