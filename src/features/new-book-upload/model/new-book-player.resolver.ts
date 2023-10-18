import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { BookData } from 'src/entities/fb2';
import { NewBookService } from '../api/new-book.service';

@Injectable({
  providedIn: 'root',
})
export class NewBookPlayerResolver implements Resolve<BookData | null> {
  constructor(private newBook: NewBookService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): BookData | null {
    return this.newBook.getCurrentValue();
  }
}
