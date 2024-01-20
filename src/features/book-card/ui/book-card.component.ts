import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BookDescription } from 'src/entities/books';
import { MaterialModule } from 'src/shared/ui';

const DEFAULT_IMAGE = '/shared/assets/images/no-photo.jpg';

@Component({
  selector: 'book-card',
  standalone: true,
  imports: [MaterialModule, RouterModule],
  templateUrl: './book-card.component.html',
  styleUrls: ['./book-card.component.less'],
})
export class BookCardComponent {
  @Input() book!: BookDescription;

  public getBookLogo(book: BookDescription): string {
    return book.logo || DEFAULT_IMAGE;
  }
}
