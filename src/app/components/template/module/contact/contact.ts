import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  template: `
    <div class="w-full max-w-md rounded-2xl p-4 text-center" style="background-color: #F4F1F8">
      <h2 class="text-2xl font-barriecito mb-3" style="color: #222222">¿Tienes alguna duda?</h2>
      <a
        href="https://wa.me/{{ phoneNumber }}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block px-4 py-2 rounded-lg text-white font-quicksand"
        style="background-color: #7fc29b"
      >
        Hablame
      </a>
      @if (groupLink) {
        o
        <a
          href="{{ groupLink }}"
          class="inline-block px-4 py-2 rounded-lg text-white font-quicksand"
          style="background-color: #7fc29b"
        >
          Unete al grupo de whatsapp!
        </a>
      }
    </div>
  `,
  styles: [],
})
export class Contact {
  @Input() phoneNumber!: number;
  @Input() groupLink?: string;
}
