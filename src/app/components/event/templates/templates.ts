import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-templates',
  imports: [],
  template: `
    <h2>Modelos</h2>
    <p>
      Elije el que mejor se acomode a lo que necesites, no te preocupes, después podrás cambiar de
      opinión si lo necesitas
    </p>
    <ul>
      @for (template of templates; track template) {
        <li>
          <h3>{{ template.title }}</h3>
          <a href="/{{ event }}/{{ template.id }}"
            ><div>
              <img
                [src]="'templates/' + template.id + '.webp'"
                [alt]="'Plantilla ' + template.title"
              /></div
          ></a>
          <a href="/{{ event }}/{{ template.id }}">ver ejemplo</a>
          <button>seleccionar</button>
        </li>
      }
    </ul>
    <button>ver más</button>
    <p>¿No encuentras lo que buscas?</p>
    <a href="contact">Contacta una asesora ahora</a>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Templates {
  @Input() templates!: template[];
  @Input() event!: string;
}

export interface template {
  title: string;
  id: string;
}
