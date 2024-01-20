import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { BookCardComponent } from 'src/features/book-card';
import { BookDescription, BookUtilsService } from 'src/entities/books';

@Component({
  selector: 'books-group',
  standalone: true,
  imports: [BookCardComponent, CommonModule],
  templateUrl: './books-group.component.html',
  styleUrls: ['./books-group.component.less'],
})
export class BooksGroupComponent {
  @Input() books!: BookDescription[];

  constructor(public bookUtils: BookUtilsService) {}
}
