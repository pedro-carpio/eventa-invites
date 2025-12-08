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
          @if (activity.icon) {
            <span class="material-symbols-rounded">{{ activity.icon }}</span>
          }
          @if (activity.title) {
            <strong>{{ activity.title }}</strong>
          }
          {{ activity.name }}
          @if (activity.time) {
            - {{ activity.time }}
          }
          @if (activity.action && activity.button) {
            <button (click)="activity.action()">{{ activity.button }}</button>
          }
        </li>
      }
    </ul>
  `,
  styles: ``,
})
export class Itinerary {
  @Input() flourishes: boolean = true;
  @Input() icon?: string = 'assignment_turned_in';
  @Input() title: string = 'Itinerario';
  @Input() activities: Activity[] = [];
}

export type Activity = {
  icon?: string;
  title?: string;
  name: string;
  time?: string;
  action?: () => void;
  button?: string;
};
