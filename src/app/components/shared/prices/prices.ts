import { Component } from '@angular/core';

@Component({
  selector: 'app-shared-prices',
  imports: [],
  template: `
    <p>this is the table of prices:</p>
    <ul>
      <li>Basic: $10</li>
      <li>Standard: $20</li>
      <li>Premium: $30</li>
    </ul>
  `,
  styles: ``,
})
export class SharedPrices {}
