import { Injectable } from '@angular/core';
import { first, tap } from 'rxjs';
import { NewBookEventService } from 'src/features/new-book-upload';
import { BookData, Fb2ReaderService } from 'src/entities/fb2';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(
    private fb2Service: Fb2ReaderService,
    private newBookEvent: NewBookEventService
  ) {}

  public parseNewFile(files?: FileList): void {
    if (files && files.length > 0) {
      this.fb2Service
        .readBook(files[0])
        .pipe(
          first(),
          tap((bookData: BookData) => this.newBookEvent.next(bookData))
        )
        .subscribe();
    } else {
      this.newBookEvent.next(null);
    }
  }
}
