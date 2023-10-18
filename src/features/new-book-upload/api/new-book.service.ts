import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, share } from 'rxjs';
import { BookData } from 'src/entities/fb2';

@Injectable({
  providedIn: 'root',
})
export class NewBookService {
  private bookData$: BehaviorSubject<BookData | null> =
    new BehaviorSubject<BookData | null>(null);

  update(value: BookData | null): void {
    this.bookData$.next(value);
  }

  getCurrentValue(): BookData | null {
    return this.bookData$.value;
  }

  getNewBookSubscription(): Observable<BookData | null> {
    return this.bookData$.pipe(share());
  }
}
