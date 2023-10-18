import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NewBookNavigatorService } from 'src/processes/new-book';

@Component({
  selector: 'root',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent implements OnInit {
  constructor(private newBook: NewBookNavigatorService) {}

  ngOnInit() {
    this.newBook.handle();
  }
}
