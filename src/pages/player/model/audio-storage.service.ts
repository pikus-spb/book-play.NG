import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { OpenedBookService } from 'src/features/opened-book';

@Injectable({
  providedIn: 'root',
})
export class AudioStorageService {
  private storage: Map<number, string> = new Map<number, string>();

  constructor(private bookService: OpenedBookService) {
    this.bookService.book$
      .pipe(
        tap(() => {
          this.clear();
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  clear(): void {
    this.storage.clear();
  }

  set(index: number, data: string): void {
    this.storage.set(index, data);
  }

  get(index: number): string {
    return this.storage.get(index) ?? '';
  }
}
