import { Component, Input } from '@angular/core';
import { SharedHeader } from '../../shared/header/header';

@Component({
  selector: 'app-header',
  imports: [SharedHeader],
  template: `
    <app-shared-header [title]="title"></app-shared-header>
    <p>This is the header for event components</p>
  `,
  styles: ``,
})
export class Header {
  @Input() title!: string;
}
