import { Component, OnInit } from '@angular/core';
import { NewBookHandlerService } from 'src/processes/new-book';

@Component({
  selector: 'root',
  template: `<router-outlet></router-outlet>`,
})
export class RootComponent implements OnInit {
  constructor(private newBook: NewBookHandlerService) {}

  ngOnInit() {
    this.newBook.handle();
  }
}
