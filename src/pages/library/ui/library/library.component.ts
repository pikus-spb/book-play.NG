import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';

import { BooksApiService } from 'src/entities/books/';

import { BookDescription } from '../../model/books-model';

@Component({
  selector: 'library',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.less'],
})
export class LibraryComponent {
  constructor(public api: BooksApiService) {}

  public getAllBooks(): Observable<BookDescription[]> {
    return this.api.getAll().pipe(
      map((books: BookDescription[]) => {
        return books
          .filter(
            book => book.authorFirstName && book.authorLastName && book.title
          )
          .sort((a, b) => {
            return a.authorLastName.localeCompare(b.authorLastName);
          });
      })
    );
  }
}
