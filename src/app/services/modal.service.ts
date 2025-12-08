import { Injectable, signal } from '@angular/core';

/**
 * Estado de un modal en el stack
 */
export interface ModalState {
  id: string;
  type: string;
  isOpen: boolean;
  zIndex: number;
}

/**
 * Configuración de un modal
 */
export interface ModalConfig {
  id: string;
  type: string;
  backdrop?: boolean;
  closeOnBackdropClick?: boolean;
}

/**
 * Servicio de gestión centralizada de modales
 *
 * Responsabilidades:
 * - Mantener stack de modales abiertos
 * - Gestionar z-index automáticamente
 * - Controlar backdrop (fondo oscuro)
 * - Prevenir scrolling cuando hay modales
 * - Permitir cerrar múltiples modales
 *
 * @example
 * ```typescript
 * // Abrir modal
 * private readonly modalService = inject(ModalService);
 * this.modalService.open({ id: 'share-modal', type: 'share' });
 *
 * // Cerrar modal
 * this.modalService.close('share-modal');
 *
 * // Verificar si está abierto
 * const isOpen = this.modalService.isOpen('share-modal');
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  /** Stack de modales activos ordenado por z-index */
  private modalStack = signal<ModalState[]>([]);

  /** Z-index base para modales */
  private readonly BASE_Z_INDEX = 1000;

  /** Modales activos (para templates) */
  activeModals = this.modalStack.asReadonly();

  /**
   * Abre un modal y lo añade al stack
   */
  open(config: ModalConfig): void {
    const existingModal = this.modalStack().find((m) => m.id === config.id);

    if (existingModal) {
      // Si ya existe, solo lo marca como abierto
      existingModal.isOpen = true;
      return;
    }

    const newZIndex = this.BASE_Z_INDEX + this.modalStack().length * 10;
    const newModal: ModalState = {
      id: config.id,
      type: config.type,
      isOpen: true,
      zIndex: newZIndex,
    };

    this.modalStack.update((stack) => [...stack, newModal]);
    this.updateBodyScroll();
  }

  /**
   * Cierra un modal específico
   */
  close(modalId: string): void {
    const modal = this.modalStack().find((m) => m.id === modalId);
    if (modal) {
      modal.isOpen = false;
      this.modalStack.update((stack) => stack.filter((m) => m.isOpen));
      this.updateBodyScroll();
    }
  }

  /**
   * Cierra todos los modales
   */
  closeAll(): void {
    this.modalStack.set([]);
    this.updateBodyScroll();
  }

  /**
   * Verifica si un modal está abierto
   */
  isOpen(modalId: string): boolean {
    return this.modalStack().some((m) => m.id === modalId && m.isOpen);
  }

  /**
   * Obtiene el z-index de un modal
   */
  getZIndex(modalId: string): number {
    const modal = this.modalStack().find((m) => m.id === modalId);
    return modal?.zIndex || 0;
  }

  /**
   * Obtiene el modal más arriba en el stack
   */
  getTopModal(): ModalState | null {
    const stack = this.modalStack();
    return stack.length > 0 ? stack[stack.length - 1] : null;
  }

  /**
   * Verifica si algún modal está abierto
   */
  hasOpenModals(): boolean {
    return this.modalStack().length > 0;
  }

  /**
   * Actualiza el scroll del body cuando hay modales
   * @private
   */
  private updateBodyScroll(): void {
    const hasModals = this.hasOpenModals();
    if (typeof document !== 'undefined') {
      document.body.style.overflow = hasModals ? 'hidden' : 'auto';
    }
  }
}
