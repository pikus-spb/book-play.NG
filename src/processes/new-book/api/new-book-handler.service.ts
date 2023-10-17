import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NewBookEventService } from 'src/features/new-book-upload';
import { BookData } from '../../../entities/fb2';

@Injectable({
  providedIn: 'root',
})
export class NewBookHandlerService {
  constructor(
    private newBookEvent: NewBookEventService,
    private router: Router
  ) {
    this.newBookEvent.getEvent().subscribe((bookData: BookData | null) => {
      if (bookData !== null) {
        this.router.navigateByUrl('/player');
      }
    });
  }
}
