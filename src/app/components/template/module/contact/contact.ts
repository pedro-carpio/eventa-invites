import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  template: `
    <a href="https://wa.me/{{ phoneNumber }}">Hablame a whatsapp</a>
    @if (groupLink) {
      o
      <a href="{{ groupLink }}">Unete al grupo de whatsapp!</a>
    }
  `,
  styles: ``,
})
export class Contact {
  @Input() phoneNumber!: string;
  @Input() groupLink?: string;
}
