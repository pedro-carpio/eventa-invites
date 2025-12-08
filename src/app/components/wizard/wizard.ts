import { Component } from '@angular/core';
import { SharedHeader } from '../shared/header/header';
import { SharedFooter } from '../shared/footer/footer';

@Component({
  selector: 'app-wizard',
  imports: [SharedHeader, SharedFooter],
  template: `
    <app-shared-header></app-shared-header>
    <h1>Genera tu invitacion personalizada en pocos pasos</h1>
    <app-shared-footer></app-shared-footer>
  `,
  styles: ``,
})
export class Wizard {}
