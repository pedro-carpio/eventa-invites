import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente contenedor reutilizable para modales
 * Proporciona overlay, animación y estructura base
 */
@Component({
  selector: 'app-shared-modal-wrapper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-10 backdrop-blur-sm"
      (click)="onBackdropClick()"
      *ngIf="isOpen()"
    >
      <div
        class="bg-white rounded-lg m-4 max-w-4xl w-full shadow-xl max-h-[95vh] overflow-y-auto"
        (click)="$event.stopPropagation()"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedModalWrapperComponent {
  /** Control de visibilidad del modal */
  isOpen = input<boolean>(false);

  /** Emite cuando se cierra el modal */
  close = output<void>();

  /**
   * Maneja clic en backdrop (área oscura)
   */
  onBackdropClick(): void {
    this.close.emit();
  }
}
