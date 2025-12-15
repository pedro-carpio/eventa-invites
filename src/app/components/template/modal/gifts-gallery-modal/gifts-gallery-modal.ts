import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Estructura de un elemento de regalo
 */
export type GiftIdea = {
  imgUrl: string;
  title: string;
  link: string;
};

/**
 * Modal de Galería de Regalos
 *
 * Características:
 * - Galería horizontal rotativa
 * - Navegación con botones anterior/siguiente
 * - Indicadores de posición (puntos)
 * - Auto-rotación cada 5 segundos (opcional)
 * - Botón para abrir link del regalo en nueva ventana
 *
 * @example
 * ```html
 * @if (isGiftsModalOpen()) {
 *   <app-shared-modal-wrapper (close)="closeGiftsModal()" [isOpen]="isGiftsModalOpen()">
 *     <app-gifts-gallery-modal
 *       [giftIdeas]="eventData()?.sections.gift?.ideas || []"
 *       [title]="'Ideas de regalos'"
 *       [description]="'Aquí hay algunas ideas que nos encantarían...'"
 *       (close)="closeGiftsModal()"
 *     ></app-gifts-gallery-modal>
 *   </app-shared-modal-wrapper>
 * }
 * ```
 */
@Component({
  selector: 'app-gifts-gallery-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-container">
      <!-- Encabezado -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="typography-h2">{{ title() }}</h2>
          @if (description()) {
            <p class="typography-3 mt-2">{{ description() }}</p>
          }
        </div>
        <button
          (click)="onClose()"
          type="button"
          aria-label="Cerrar modal"
          class="btn-accent text-sm px-3 py-1 flex-shrink-0"
        >
          ✕
        </button>
      </div>

      <!-- Galería Horizontal -->
      @if (giftIdeas().length > 0) {
        <div class="space-y-4">
          <!-- Carrusel -->
          <div class="relative bg-gray-100 rounded-lg overflow-hidden h-64 md:h-80">
            <!-- Imagen actual -->
            <img
              [src]="currentGift().imgUrl"
              [alt]="currentGift().title"
              class="w-full h-full object-cover"
            />

            <!-- Overlay con información -->
            <div
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
            >
              <p class="typography-2 text-white font-bold">{{ currentGift().title }}</p>
            </div>

            <!-- Botón Anterior -->
            @if (giftIdeas().length > 1) {
              <button
                (click)="previousGift()"
                type="button"
                aria-label="Regalo anterior"
                class="absolute left-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition-all z-10"
              >
                <span class="text-xl">‹</span>
              </button>

              <!-- Botón Siguiente -->
              <button
                (click)="nextGift()"
                type="button"
                aria-label="Siguiente regalo"
                class="absolute right-3 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full p-2 transition-all z-10"
              >
                <span class="text-xl">›</span>
              </button>
            }
          </div>

          <!-- Indicadores (puntos) -->
          @if (giftIdeas().length > 1) {
            <div class="flex justify-center gap-2">
              @for (idea of giftIdeas(); track $index) {
                <button
                  (click)="goToGift($index)"
                  type="button"
                  [class.bg-accent]="currentIndex() === $index"
                  [class.bg-gray-300]="currentIndex() !== $index"
                  class="w-2 h-2 rounded-full transition-colors"
                  [attr.aria-label]="'Ir al regalo ' + ($index + 1)"
                ></button>
              }
            </div>
          }

          <!-- Información y Botón -->
          <div class="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div>
              <p class="typography-2 font-bold mb-2">{{ currentGift().title }}</p>
              <p class="typography-3 text-gray-600">
                {{ currentIndex() + 1 }} de {{ giftIdeas().length }} ideas
              </p>
            </div>

            <a
              [href]="currentGift().link"
              target="_blank"
              rel="noopener noreferrer"
              class="link-accent block text-center py-2"
            >
              Ver en tienda →
            </a>
          </div>
        </div>
      } @else {
        <p class="typography-3 text-gray-500">No hay ideas de regalos disponibles</p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        --accent-color: #7fc29b;
      }

      .bg-accent {
        background-color: var(--accent-color);
      }

      .link-accent {
        color: var(--accent-color);
        font-weight: 500;
      }

      .link-accent:hover {
        text-decoration: underline;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GiftsGalleryModal {
  // ===== INPUTS =====
  /** Lista de ideas de regalos */
  giftIdeas = input<GiftIdea[]>([]);

  /** Título del modal */
  title = input<string>('Ideas de Regalos');

  /** Descripción opcional */
  description = input<string>();

  /** Habilitación de auto-rotación */
  autoRotate = input<boolean>(false);

  /** Intervalo de auto-rotación en milisegundos */
  autoRotateInterval = input<number>(5000);

  // ===== OUTPUTS =====
  /** Emitido cuando se cierra el modal */
  close = output<void>();

  // ===== SIGNALS =====
  /** Índice del regalo actual (internal, no exponible directamente) */
  private readonly currentIndexInternal = signal<number>(0);

  /** Timestamp para trigger de auto-rotación */
  private readonly autoRotateTime = signal<number>(Date.now());

  // ===== COMPUTED SIGNALS =====
  /**
   * Expone el índice actual para el template
   */
  readonly currentIndex = computed(() => this.currentIndexInternal());

  /**
   * Obtiene el regalo actual basado en el índice
   */
  readonly currentGift = computed(() => {
    const ideas = this.giftIdeas();
    const index = this.currentIndex();
    return ideas[index] || ideas[0];
  });

  constructor() {
    // Configurar auto-rotación si está habilitada
    this.setupAutoRotation();
  }

  /**
   * Configura la auto-rotación del carrusel
   */
  private setupAutoRotation(): void {
    effect(() => {
      const autoRotate = this.autoRotate();
      if (!autoRotate || this.giftIdeas().length <= 1) return;

      const interval = setInterval(() => {
        this.autoRotateTime.set(Date.now());
        this.nextGift();
      }, this.autoRotateInterval());

      return () => clearInterval(interval);
    });
  }

  /**
   * Va al siguiente regalo
   */
  nextGift(): void {
    const ideas = this.giftIdeas();
    if (ideas.length === 0) return;

    const nextIndex = (this.currentIndexInternal() + 1) % ideas.length;
    this.currentIndexInternal.set(nextIndex);
  }

  /**
   * Va al regalo anterior
   */
  previousGift(): void {
    const ideas = this.giftIdeas();
    if (ideas.length === 0) return;

    const prevIndex = (this.currentIndexInternal() - 1 + ideas.length) % ideas.length;
    this.currentIndexInternal.set(prevIndex);
  }

  /**
   * Va a un regalo específico
   * @param index Índice del regalo
   */
  goToGift(index: number): void {
    const ideas = this.giftIdeas();
    if (index >= 0 && index < ideas.length) {
      this.currentIndexInternal.set(index);
    }
  }

  /**
   * Cierra el modal
   */
  onClose(): void {
    this.close.emit();
  }
}
