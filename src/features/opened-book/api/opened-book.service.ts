import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { BookData, BookHelperService } from 'src/entities/fb2';
import { IndexedDbBookManagerService } from './indexed-db-book-manager.service';
import { IndexedDbStorageService } from './indexed-db-storage.service';

@Injectable({
  providedIn: 'root',
})
export class OpenedBookService {
  private indexedDBBookManager: IndexedDbBookManagerService;
  private bookData$: BehaviorSubject<BookData | null> =
    new BehaviorSubject<BookData | null>(null);

  public readonly book$: Observable<BookData | null> = this.bookData$.pipe(
    shareReplay(1)
  );

  constructor(
    private cursorService: CursorPositionStoreService,
    private bookHelper: BookHelperService
  ) {
    this.indexedDBBookManager = new IndexedDbBookManagerService(
      inject(IndexedDbStorageService),
      this
    );
    this.indexedDBBookManager.watchOpenedBook();
  }

  update(value: BookData | null): void {
    this.bookData$.next(value);

    if (value !== null) {
      this.cursorService.setCursorName(this.bookHelper.getBookHashKey(value));
    }
  }

  get book(): BookData | null {
    return this.bookData$.value;
  }
}
