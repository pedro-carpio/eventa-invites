import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface Include {
  icon: string;
  title: string;
  content: string;
}

@Component({
  selector: 'app-includes',
  imports: [],
  template: `
    <h2>¿Qué incluyen?</h2>
    <ul>
      @for (item of items(); track item.title) {
        <li>
          <span class="material-symbols-rounded">{{ item.icon }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.content }}</p>
        </li>
      }
    </ul>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Includes {
  items = input<Include[]>([]);
}
