import { Component } from '@angular/core';
import { NewBookHandlerService } from 'src/processes/new-book';

@Component({
  selector: 'root',
  template: `<router-outlet></router-outlet>`,
})
export class RootComponent {
  constructor(private newBookHandler: NewBookHandlerService) {}
}
