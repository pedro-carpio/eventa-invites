import { ChangeDetectionStrategy, Component, input, OnDestroy, OnInit } from '@angular/core';

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
      @for (item of items(); track $index) {
        <li>
          <span
            class="material-symbols-rounded icon-rotate"
            [style.--icon-content]="getIconContent(item)"
          ></span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.content }}</p>
        </li>
      }
    </ul>
  `,
  styles: `
    .icon-rotate {
      display: inline-block;
      transition: opacity 0.3s ease-in-out;
    }

    .icon-rotate::before {
      content: var(--icon-content);
    }

    .icon-rotate[data-rotating='true'] {
      animation: iconRotation 1s infinite linear;
    }

    @keyframes iconRotation {
      0% {
        opacity: 1;
      }
      25% {
        opacity: 0.7;
      }
      50% {
        opacity: 1;
      }
      75% {
        opacity: 0.7;
      }
      100% {
        opacity: 1;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Includes implements OnInit, OnDestroy {
  items = input<Include[]>([]);
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private currentIconIndex = 0;

  getIconContent(item: Include): string {
    if (Array.isArray(item.icon)) {
      return `"${item.icon[this.currentIconIndex % item.icon.length]}"`;
    }
    return `"${item.icon}"`;
  }

  ngOnInit() {
    this.startIconRotation();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startIconRotation() {
    this.intervalId = setInterval(() => {
      this.currentIconIndex++;
      // Actualizar solo los iconos que rotan usando CSS custom properties
      const rotatingIcons = document.querySelectorAll('.icon-rotate');
      rotatingIcons.forEach((icon, index) => {
        const item = this.items()[index];
        if (Array.isArray(item?.icon)) {
          const newIcon = item.icon[this.currentIconIndex % item.icon.length];
          (icon as HTMLElement).style.setProperty('--icon-content', `"${newIcon}"`);
        }
      });
    }, 1000);
  }
}
