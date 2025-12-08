import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Configuración de una sección reutilizable
 *
 * @template T Tipo del contenido de la sección
 */
export type SectionConfig<T = any> = {
  /** Título de la sección */
  title: string;
  /** Subtítulo opcional */
  subtitle?: string;
  /** Descripción opcional */
  description?: string;
  /** Icono Material Symbols (opcional) */
  icon?: string;
  /** Contenido principal */
  content: T;
  /** Enlace de acción opcional */
  link?: string;
  /** Etiqueta del enlace de acción */
  linkTag?: string;
  /** Botón de acción (si no hay enlace) */
  actionButton?: { label: string; action: () => void };
};

/**
 * Componente base reutilizable para secciones
 *
 * Usado por:
 * - Info (información general)
 * - Itinerary (actividades)
 * - Notes (notas)
 * - FoodDetails (detalles de comida)
 * - DressCode (código de vestimenta)
 *
 * Reduce duplicación de código proporcionando:
 * - Renderizado consistente de títulos y descripciones
 * - Manejo de iconos
 * - Manejo de enlaces y botones
 * - Consistent styling
 *
 * @example
 * ```typescript
 * // Uso en componente padre
 * @Component({
 *   imports: [SectionComponent]
 * })
 * export class FoodDetailsComponent {
 *   sectionConfig = input<SectionConfig>({
 *     title: 'Detalles de comida',
 *     icon: 'restaurant',
 *     description: 'Información sobre el menú',
 *     content: { items: [...] }
 *   });
 * }
 *
 * // En template:
 * <app-section [config]="sectionConfig()"></app-section>
 * ```
 *
 * @generic T Tipo del contenido (puede ser string, object, array, etc.)
 */
@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <div>
        @if (config().icon) {
          <span class="material-symbols-rounded">{{ config().icon }}</span>
        }
        <div>
          <h2>{{ config().title }}</h2>
          @if (config().subtitle) {
            <h3>{{ config().subtitle }}</h3>
          }
        </div>
      </div>

      @if (config().description) {
        <p>{{ config().description }}</p>
      }

      <div>
        <ng-content />
      </div>

      @if (config().link || config().actionButton) {
        <div>
          @if (config().link) {
            <a [href]="config().link" target="_blank" rel="noopener noreferrer">
              {{ config().linkTag || 'Ver más' }}
            </a>
          }
          @if (config().actionButton) {
            <button (click)="onActionClick()" type="button">
              {{ config().actionButton!.label }}
            </button>
          }
        </div>
      }
    </section>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionComponent<T = any> {
  /**
   * Configuración de la sección
   */
  config = input.required<SectionConfig<T>>();

  /**
   * Emitido cuando se hace clic en el botón de acción
   */
  actionClicked = output<void>();

  /**
   * Maneja el clic del botón de acción
   */
  onActionClick(): void {
    const action = this.config().actionButton?.action;
    if (action) {
      action();
      this.actionClicked.emit();
    }
  }
}
