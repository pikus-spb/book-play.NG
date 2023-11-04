import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NewBookService } from 'src/features/new-book-upload';
import { BookData } from 'src/entities/fb2';

@Injectable({
  providedIn: 'root',
})
export class NewBookNavigatorService {
  constructor(
    private newBookEvent: NewBookService,
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
