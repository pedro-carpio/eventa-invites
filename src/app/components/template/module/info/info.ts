import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SectionComponent, SectionConfig } from '../../section/section.component';

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
  imports: [SectionComponent],
  template: `
    <app-section [config]="sectionConfig()" (actionClicked)="onActionClick()"></app-section>
  `,
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
  protected sectionConfig = computed<SectionConfig>(() => {
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
