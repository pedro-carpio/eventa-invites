import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Componente Info: Sección informativa genérica
 *
 * Proporciona una forma consistente de mostrar información
 * con soporte para icono, título, descripción, enlaces y acciones.
 *
 * Usa SectionComponent internamente para consistencia visual.
 *
 * @example
 * ```typescript
 * @Component({
 *   template: `
 *     <app-info
 *       title="Dress Code"
 *       icon="checkroom"
 *       description="Se solicita ropa formal"
 *       actionTag="Ver guía de vestuario"
 *       link="https://example.com/dress-code"
 *     ></app-info>
 *   `
 * })
 * ```
 */
@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  template: `
    <div class="w-full max-w-md rounded-2xl p-4 text-center" style="background-color: #F4F1F8">
      @if (icon()) {
        <span class="material-symbols-rounded block text-2xl mb-2" style="color: #7fc29b">
          {{ icon() }}
        </span>
      }
      <h2 class="text-2xl font-barriecito mb-3" style="color: #222222">
        {{ title() }}
      </h2>
      <p class="text-xs mb-4" style="font-family: 'Quicksand', sans-serif; color: #222222">
        {{ description() }}
      </p>
      @if (link() && (linkTag() || actionTag())) {
        <a
          [href]="link()"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block px-4 py-2 rounded-lg text-white font-quicksand"
          style="background-color: #7fc29b"
        >
          {{ linkTag() || actionTag() }}
        </a>
      } @else if (action()) {
        <button
          (click)="onActionClick()"
          class="px-4 py-2 rounded-lg text-white font-quicksand"
          style="background-color: #7fc29b"
        >
          {{ linkTag() || actionTag() || 'Accionar' }}
        </button>
      }
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Info {
  /** Título de la sección */
  title = input.required<string>();

  /** Icono Material Symbols (opcional) */
  icon = input<string>();

  /** Descripción de la sección */
  description = input.required<string>();

  /** Enlace de acción (opcional) */
  link = input<string>();

  /** Etiqueta del enlace o botón */
  linkTag = input<string>();

  /** Alias para linkTag (compatibilidad hacia atrás) */
  actionTag = input<string>();

  /** Función de acción (opcional, alternativa a link) */
  action = input<(() => void) | undefined>();

  /**
   * Computed signal para configuración de sección
   */
  protected readonly sectionConfig = computed<{
    title: string;
    icon?: string;
    description: string;
    link?: string;
    linkTag?: string;
    actionButton?: { label: string; action: () => void };
    content: null;
  }>(() => {
    const tag = this.linkTag() || this.actionTag();
    return {
      title: this.title(),
      icon: this.icon(),
      description: this.description(),
      link: this.link(),
      linkTag: tag,
      actionButton: this.action()
        ? {
            label: tag || 'Accionar',
            action: this.action()!,
          }
        : undefined,
      content: null,
    };
  });

  /**
   * Maneja el clic de acción
   */
  onActionClick(): void {
    const actionFn = this.action();
    if (actionFn) {
      actionFn();
    }
  }
}
