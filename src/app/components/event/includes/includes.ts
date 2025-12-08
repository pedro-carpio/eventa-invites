import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';

export interface Include {
  icon: string | string[];
  title: string;
  content: string;
}

@Component({
  selector: 'app-includes',
  imports: [],
  template: `
    <h2>¿Qué incluyen?</h2>
    <ul>
      @for (item of items(); track item.title; let i = $index) {
        <li>
          <span class="material-symbols-rounded icon-rotate">{{ getCurrentIcon(i) }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.content }}</p>
        </li>
      }
    </ul>
  `,
  styles: `
    .icon-rotate {
      display: inline-block;
      transition:
        transform 0.3s ease-in-out,
        opacity 0.3s ease-in-out;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Includes {
  items = input<Include[]>([]);
  private iconIndices = signal<number[]>([]);

  currentIcons = computed(() => {
    const indices = this.iconIndices();
    return this.items().map((item, i) => {
      if (Array.isArray(item.icon)) {
        const iconIndex = indices[i] ?? 0;
        return item.icon[iconIndex] ?? item.icon[0];
      }
      return item.icon;
    });
  });

  getCurrentIcon(index: number): string {
    return this.currentIcons()[index] ?? '';
  }

  constructor() {
    effect(() => {
      const itemsList = this.items();
      if (itemsList.length === 0) return;

      this.iconIndices.set(new Array(itemsList.length).fill(0));

      const interval = setInterval(() => {
        this.iconIndices.update((indices) =>
          indices.map((currentIndex, i) => {
            const item = itemsList[i];
            if (Array.isArray(item.icon)) {
              return (currentIndex + 1) % item.icon.length;
            }
            return currentIndex;
          }),
        );
      }, 1000);

      return () => clearInterval(interval);
    });
  }
}
