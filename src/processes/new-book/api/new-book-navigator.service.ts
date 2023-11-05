import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OpenedBookService } from 'src/features/opened-book';
import { BookData } from 'src/entities/fb2';

@Injectable({
  providedIn: 'root',
})
export class NewBookNavigatorService {
  constructor(
    private openedBookService: OpenedBookService,
    private router: Router
  ) {}

  public handle(): void {
    this.openedBookService.book$.subscribe((bookData: BookData | null) => {
      if (bookData !== null) {
        this.router.navigateByUrl('/player');
      }
    });
  }
}
