import { ChangeDetectionStrategy, Component, input } from '@angular/core';

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
      @for (template of templateTitles(); track template) {
        <li>
          <h3>{{ template }}</h3>
          <div>
            <img [src]="'templates/' + template + '.webp'" [alt]="'Plantilla ' + template" />
          </div>
          <button>ver ejemplo</button>
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
  templateTitles = input<string[]>([]);
}
