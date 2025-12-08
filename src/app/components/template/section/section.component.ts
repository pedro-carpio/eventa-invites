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
    <section class="section-container" [attr.data-section]="config().title.toLowerCase()">
      <div class="section-header">
        @if (config().icon) {
          <span class="material-symbols-rounded section-icon">{{ config().icon }}</span>
        }
        <div class="section-title-group">
          <h2 class="section-title">{{ config().title }}</h2>
          @if (config().subtitle) {
            <h3 class="section-subtitle">{{ config().subtitle }}</h3>
          }
        </div>
      </div>

      @if (config().description) {
        <p class="section-description">{{ config().description }}</p>
      }

      <div class="section-content">
        <ng-content />
      </div>

      @if (config().link || config().actionButton) {
        <div class="section-action">
          @if (config().link) {
            <a
              [href]="config().link"
              target="_blank"
              rel="noopener noreferrer"
              class="section-link"
            >
              {{ config().linkTag || 'Ver más' }}
            </a>
          }
          @if (config().actionButton) {
            <button class="section-action-button" (click)="onActionClick()" type="button">
              {{ config().actionButton!.label }}
            </button>
          }
        </div>
      }
    </section>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .section-container {
      border-radius: 0.5rem;
      padding: 1.5rem;
      background-color: var(--color-section-bg, #f9fafb);
      border: 1px solid var(--color-section-border, #e5e7eb);
      margin: 1rem 0;
    }

    .section-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .section-icon {
      flex-shrink: 0;
      font-size: 1.75rem;
      color: var(--color-primary, #3b82f6);
      margin-top: 0.25rem;
    }

    .section-title-group {
      flex: 1;
    }

    .section-title {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--color-text-primary, #1f2937);
    }

    .section-subtitle {
      margin: 0.5rem 0 0;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary, #6b7280);
    }

    .section-description {
      margin: 0 0 1.5rem;
      color: var(--color-text-secondary, #6b7280);
      line-height: 1.6;
    }

    .section-content {
      margin: 1.5rem 0;
    }

    .section-action {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
      flex-wrap: wrap;
    }

    .section-link,
    .section-action-button {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      border: none;
      background-color: var(--color-primary, #3b82f6);
      color: white;
      cursor: pointer;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: var(--color-primary-dark, #2563eb);
      }

      &:focus {
        outline: 2px solid var(--color-focus, #3b82f6);
        outline-offset: 2px;
      }
    }

    .section-action-button {
      padding: 0.5rem 1rem;
    }

    /* Responsive */
    @media (max-width: 640px) {
      .section-container {
        padding: 1rem;
        margin: 0.75rem 0;
      }

      .section-header {
        gap: 0.75rem;
      }

      .section-title {
        font-size: 1.25rem;
      }

      .section-icon {
        font-size: 1.5rem;
      }
    }
  `,
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
