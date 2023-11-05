import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { BookData, BookHelperService } from 'src/entities/fb2';

@Injectable({
  providedIn: 'root',
})
export class OpenedBookService {
  private bookData$: BehaviorSubject<BookData | null> =
    new BehaviorSubject<BookData | null>(null);

  public readonly book$: Observable<BookData | null> = this.bookData$.pipe(
    shareReplay(1)
  );

  constructor(
    private cursorService: CursorPositionStoreService,
    private bookHelper: BookHelperService
  ) {}

  update(value: BookData | null): void {
    if (value !== null) {
      this.cursorService.setCursorName(this.bookHelper.getBookHashKey(value));
    }
    this.bookData$.next(value);
  }

  getBook(): BookData | null {
    return this.bookData$.value;
  }
}
