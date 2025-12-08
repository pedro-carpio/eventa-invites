import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
    <h1>Invitaciones para tu evento</h1>

    <p>Hola! ¿Que fiesta tendrás?</p>

    <a href="/evento/baby-shower"
      ><span class="material-symbols-rounded"> crib </span>Baby shower</a
    >
  `,
  styles: ``,
})
export class Home {}
