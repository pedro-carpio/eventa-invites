import { Component, input } from '@angular/core';

@Component({
  selector: 'app-notes',
  imports: [],
  template: `
    <h2>{{ title() }}</h2>
    @for (note of content(); track note) {
      <i class="material-symbols-rounded">{{ note.icon }}</i>
      <p>{{ note.text }}</p>
    }
  `,
  styles: ``,
})
export class Notes {
  title = input<string>('Notas');
  content = input<Array<{ icon: string; text: string }>>([]);
}
