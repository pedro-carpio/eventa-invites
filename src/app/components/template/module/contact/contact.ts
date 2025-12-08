import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  template: `
    <a href="https://wa.me/{{ phoneNumber }}" target="_blank" rel="noopener noreferrer"
      >Hablame a whatsapp</a
    >
    @if (groupLink) {
      o
      <a href="{{ groupLink }}">Unete al grupo de whatsapp!</a>
    }
  `,
  styles: [],
})
export class Contact {
  @Input() phoneNumber!: number;
  @Input() groupLink?: string;
}
