import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-shared-header',
  imports: [],
  templateUrl: './header.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedHeader {
  title = input<string>('Invitaciones digitales');
}
