import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { map, Observable, reduce, tap } from 'rxjs';

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

  public getAllBookLetters(): Observable<Record<string, BookDescription[]>> {
    this.eventStates.add(Events.loading, true);

    return this.api.getAll().pipe(
      map((books: BookDescription[]) => {
        return books.sort((a, b) => {
          return a.authorLastName.localeCompare(b.authorLastName);
        });
      }),
      map((books: BookDescription[]) => {
        return books.reduce(
          (memo: Record<string, BookDescription[]>, item: BookDescription) => {
            memo[item.authorLastName[0]] = memo[item.authorLastName[0]] || [];
            memo[item.authorLastName[0]].push(item);
            return memo;
          },
          {} as Record<string, BookDescription[]>
        );
      }),
      tap(() => {
        this.eventStates.add(Events.loading, false);
      })
    );
  }
}
