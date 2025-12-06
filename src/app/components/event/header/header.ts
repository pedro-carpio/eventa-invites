import { Component } from '@angular/core';
import { SharedHeader } from '../../shared/header/header';

@Component({
  selector: 'app-header',
  imports: [SharedHeader],
  template: `
    <app-shared-header></app-shared-header>
    <p>This is the header for event components</p>
  `,
  styles: ``,
})
export class Header {}
