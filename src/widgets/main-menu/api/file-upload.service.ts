import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { first, tap } from 'rxjs';
import { OpenedBookService } from 'src/features/opened-book';
import { BookData, Fb2ReaderService } from 'src/entities/fb2';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(
    private fb2Service: Fb2ReaderService,
    private newBook: OpenedBookService,
    private router: Router
  ) {}

  public parseNewFile(files?: FileList): void {
    if (files && files.length > 0) {
      this.fb2Service
        .readBook(files[0])
        .pipe(
          first(),
          tap((bookData: BookData) => {
            this.newBook.update(bookData);
            this.router.navigateByUrl('/player');
          })
        )
        .subscribe();
    } else {
      this.newBook.update(null);
    }
  }
}
