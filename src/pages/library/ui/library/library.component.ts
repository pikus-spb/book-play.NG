import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { map, Observable, tap } from 'rxjs';

import { BooksApiService } from 'src/entities/books/';
import { Events, EventsStateService } from 'src/shared/ui';

import { BookDescription } from '../../model/books-model';

@Component({
  selector: 'library',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.less'],
})
export class LibraryComponent {
  constructor(
    public api: BooksApiService,
    private eventStates: EventsStateService
  ) {}

  public getAllBooks(): Observable<BookDescription[]> {
    this.eventStates.add(Events.loading, true);
    return this.api.getAll().pipe(
      map((books: BookDescription[]) => {
        return books
          .filter(
            book => book.authorFirstName && book.authorLastName && book.title
          )
          .sort((a, b) => {
            return a.authorLastName.localeCompare(b.authorLastName);
          });
      }),
      tap(() => {
        this.eventStates.add(Events.loading, false);
      })
    );
  }
}
