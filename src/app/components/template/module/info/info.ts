import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-info',
  imports: [],
  template: `
    @if (icon) {
      <span class="material-symbols-rounded">{{ icon }}</span>
    }
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    @if (link) {
      <a [href]="link" target="_blank" rel="noopener noreferrer">{{ linkTag }}</a>
    }
    @if (action) {
      <button (click)="action()">{{ actionTag }}</button>
    }
    @if (link && actionTag && !action) {
      <a href="{{ link }}" target="_blank" rel="noopener noreferrer" class="action-link">{{
        actionTag
      }}</a>
    }
  `,
  styles: ``,
})
export class Info {
  @Input() action?: Function;
  @Input() title!: string;
  @Input() icon?: string;
  @Input() description!: string;
  @Input() link?: string;
  @Input() linkTag?: string;
  @Input() actionTag?: string;
}
