import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OpenedBookService } from 'src/features/opened-book';
import { BookData } from 'src/entities/fb2';

@Injectable({
  providedIn: 'root',
})
export class NewBookNavigatorService {
  constructor(
    private newBookEvent: OpenedBookService,
    private router: Router
  ) {}

  public handle(): void {
    this.newBookEvent
      .getNewBookSubscription()
      .subscribe((bookData: BookData | null) => {
        if (bookData !== null) {
          this.router.navigateByUrl('/player');
        }
      });
  }
}
