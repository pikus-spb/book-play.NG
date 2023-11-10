import { Injectable } from '@angular/core';
import { CanMatch } from '@angular/router';
import { OpenedBookService } from 'src/features/opened-book';

@Injectable({
  providedIn: 'root',
})
export class PlayerGuardService implements CanMatch {
  constructor(private newBook: OpenedBookService) {}

  canMatch(): boolean {
    return this.newBook.book !== null;
  }
}
