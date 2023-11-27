import { tap } from 'rxjs';
import { BookData } from 'src/entities/fb2';
import {
  DBBookData,
  IndexedDbStorageService,
} from './indexed-db-storage.service';
import { OpenedBookService } from './opened-book.service';

export class IndexedDbBookManagerService {
  constructor(
    private indexedDbStorage: IndexedDbStorageService,
    private openedBook: OpenedBookService
  ) {}

  public watchOpenedBook() {
    this.updateLoadedBook();
    this.watchNewBookOpened();
  }

  private updateLoadedBook() {
    this.indexedDbStorage.get().then((data: DBBookData) => {
      if (data && data.content.length > 0) {
        const bookData = JSON.parse(data.content);
        this.openedBook.update(bookData);
      }
    });
  }

  private watchNewBookOpened() {
    this.openedBook.book$
      .pipe(
        tap((book: BookData | null) => {
          if (book) {
            this.indexedDbStorage.set(JSON.stringify(book));
          }
        })
      )
      .subscribe();
  }
}
