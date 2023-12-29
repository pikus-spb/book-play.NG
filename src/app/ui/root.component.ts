import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'root',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {}
