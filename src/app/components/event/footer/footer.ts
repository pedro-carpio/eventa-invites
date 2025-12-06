import { Component } from '@angular/core';
import { SharedFooter } from '../../shared/footer/footer';
import { SharedPrices } from '../../shared/prices/prices';

@Component({
  selector: 'app-footer',
  imports: [SharedFooter, SharedPrices],
  template: `
    <p>This is the footer for event components</p>
    <app-shared-prices></app-shared-prices>
    <app-shared-footer></app-shared-footer>
  `,
  styles: ``,
})
export class Footer {}
