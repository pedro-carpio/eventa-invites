import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-itinerary',
  imports: [],
  template: `
    <span class="material-symbols-rounded">{{ icon }}</span>
    <h2 [class.flourished]="flourishes">{{ title }}</h2>
    <ul>
      @for (activity of activities; track activity.name) {
        <li>
          <span class="material-symbols-rounded">{{ activity.icon }}</span
          >{{ activity.name }}
          @if (activity.time) {
            - {{ activity.time }}
          }
        </li>
      }
    </ul>
  `,
  styles: ``,
})
export class Itinerary {
  @Input() flourishes: boolean = true;
  @Input() icon: string = 'assignment_turned_in';
  @Input() title: string = 'Itinerario';
  @Input() activities: Activity[] = [];
}

export type Activity = {
  icon: string;
  name: string;
  time?: string;
};
