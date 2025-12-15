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
      <div class="flex justify-between items-start mb-4 md:mb-6 gap-4">
        <div class="flex-1">
          <h2 class="typography-h2 text-2xl md:text-3xl">{{ title() }}</h2>
          @if (description()) {
            <p class="typography-3 mt-2 md:mt-3 text-sm md:text-base text-gray-700">
              {{ description() }}
            </p>
          }
        </div>
        <button
          (click)="onClose()"
          type="button"
          aria-label="Cerrar modal"
          class="btn-accent text-sm md:text-base px-3 py-1 md:px-4 md:py-2 flex-shrink-0 hover:scale-110 transition-transform"
        >
          ✕
        </button>
      </div>

      <!-- Galería Horizontal -->
      @if (giftIdeas().length > 0) {
        <div class="space-y-4 md:space-y-0 md:flex md:gap-6 md:items-stretch">
          <!-- Carrusel -->
          <div
            class="relative bg-gray-100 rounded-lg overflow-hidden h-48 md:h-auto md:w-1/2 group"
          >
            <!-- Imagen actual -->
            <img
              [src]="currentGift().imgUrl"
              [alt]="currentGift().title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />

            <!-- Overlay con información mejorado (solo en móvil) -->
            <div
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4 md:hidden"
            >
              <p class="typography-2 text-white font-bold drop-shadow-lg" style="color: #eeeeee;">
                {{ currentGift().title }}
              </p>
            </div>

            <!-- Botón Anterior -->
            @if (giftIdeas().length > 1) {
              <button
                (click)="previousGift()"
                type="button"
                aria-label="Regalo anterior"
                class="absolute left-3 md:left-4 lg:left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-green-400 text-black font-bold text-lg md:text-2xl lg:text-3xl rounded-full p-2 md:p-3 lg:p-4 transition-all duration-200 z-10 shadow-lg hover:shadow-xl opacity-70 group-hover:opacity-100 hover:scale-110"
              >
                ‹
              </button>

              <!-- Botón Siguiente -->
              <button
                (click)="nextGift()"
                type="button"
                aria-label="Siguiente regalo"
                class="absolute right-3 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-green-400 text-black font-bold text-lg md:text-2xl lg:text-3xl rounded-full p-2 md:p-3 lg:p-4 transition-all duration-200 z-10 shadow-lg hover:shadow-xl opacity-70 group-hover:opacity-100 hover:scale-110"
              >
                ›
              </button>
            }
          </div>

          <!-- Indicadores (puntos) - Solo en móvil -->
          @if (giftIdeas().length > 1) {
            <div class="flex justify-center gap-2 md:gap-3 md:hidden">
              @for (idea of giftIdeas(); track $index) {
                <button
                  (click)="goToGift($index)"
                  type="button"
                  [class.bg-accent]="currentIndex() === $index"
                  [class.bg-gray-300]="currentIndex() !== $index"
                  class="w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 hover:scale-125"
                  [attr.aria-label]="'Ir al regalo ' + ($index + 1)"
                ></button>
              }
            </div>
          }

          <!-- Información y Botón - A la derecha en md+ -->
          <div
            class="space-y-3 md:space-y-4 bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow md:w-1/2 md:flex md:flex-col md:justify-between"
          >
            <div>
              <p class="typography-2 font-bold mb-2 text-gray-800">{{ currentGift().title }}</p>
              <p class="typography-3 text-gray-600 text-sm md:text-base">
                Regalo {{ currentIndex() + 1 }} de {{ giftIdeas().length }} ideas
              </p>
            </div>

            <div class="space-y-3">
              <!-- Indicadores para desktop -->
              @if (giftIdeas().length > 1) {
                <div class="hidden md:flex justify-center gap-2 md:gap-3">
                  @for (idea of giftIdeas(); track $index) {
                    <button
                      (click)="goToGift($index)"
                      type="button"
                      [class.bg-accent]="currentIndex() === $index"
                      [class.bg-gray-300]="currentIndex() !== $index"
                      class="w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 hover:scale-125"
                      [attr.aria-label]="'Ir al regalo ' + ($index + 1)"
                    ></button>
                  }
                </div>
              }

              <a
                [href]="currentGift().link"
                target="_blank"
                rel="noopener noreferrer"
                class="link-accent block text-center py-3 md:py-4 px-4 md:px-6 bg-white hover:bg-green-50 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
              >
                Ver en tienda →
              </a>
            </div>
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
        color: darken(var(--accent-color), 10%);
        text-decoration: underline;
      }

      /* Mejoras para desktop */
      @media (min-width: 1024px) {
        .group:hover img {
          filter: brightness(1.1);
        }

        .group:hover .opacity-70 {
          opacity: 1 !important;
        }

        button:not(:disabled) {
          cursor: pointer;
        }
      }

      /* Animaciones suaves */
      * {
        transition: all 0.2s ease-out;
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
