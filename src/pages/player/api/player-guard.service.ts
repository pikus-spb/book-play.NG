import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment } from '@angular/router';
import { NewBookService } from 'src/features/new-book-upload';

@Injectable({
  providedIn: 'root',
})
export class PlayerGuardService implements CanMatch {
  constructor(private newBook: NewBookService) {}

  canMatch(route: Route, segments: UrlSegment[]): boolean {
    return this.newBook.getCurrentValue() !== null;
  }
}
