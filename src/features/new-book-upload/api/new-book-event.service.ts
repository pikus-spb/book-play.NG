import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, share, Subject } from 'rxjs';
import { BookData } from 'src/entities/fb2';

@Injectable({
  providedIn: 'root',
})
export class NewBookEventService {
  private bookData$: Subject<BookData | null> =
    new BehaviorSubject<BookData | null>(null);

  next(value: BookData | null): void {
    this.bookData$.next(value);
  }

  getEvent(): Observable<BookData | null> {
    return this.bookData$.pipe(share());
  }
}
