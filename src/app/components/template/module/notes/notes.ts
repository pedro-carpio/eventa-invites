import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionComponent, SectionConfig } from '../../section/section.component';

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
  imports: [CommonModule, SectionComponent],
  template: `
    <app-section [config]="sectionConfig()">
      <div class="notes-list">
        @for (note of content(); track note.text) {
          <div class="note-item">
            <span class="note-icon material-symbols-rounded">{{ note.icon }}</span>
            <p class="note-text">{{ note.text }}</p>
          </div>
        }
      </div>
    </app-section>
  `,
  styles: `
    .notes-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .note-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .note-icon {
      flex-shrink: 0;
      color: var(--color-primary, #3b82f6);
      font-size: 1.25rem;
      margin-top: 0.125rem;
    }

    .note-text {
      margin: 0;
      color: var(--color-text-secondary, #6b7280);
      line-height: 1.6;
    }

    @media (max-width: 640px) {
      .note-item {
        gap: 0.5rem;
      }

      .note-icon {
        font-size: 1rem;
      }
    }
  `,
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
  protected sectionConfig = computed<SectionConfig<Note[]>>(() => ({
    title: this.title(),
    description: '',
    content: this.content(),
  }));
}
