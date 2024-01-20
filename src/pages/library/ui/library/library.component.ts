import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { firstValueFrom, map, Observable, Subject, tap } from 'rxjs';

import { BooksGroupComponent } from 'src/widgets/books-group';
import { BookUtilsService } from 'src/entities/books';
import { BooksApiService, BookDescription } from 'src/entities/books/';
import { Events, EventsStateService, MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'library',
  standalone: true,
  imports: [RouterModule, MaterialModule, BooksGroupComponent],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.less'],
})
export class LibraryComponent implements OnDestroy {
  private destroyed$: Subject<void> = new Subject<void>();
  private defaultLetter = 'а';

  public letters$?: Observable<string[]>;

  constructor(
    public api: BooksApiService,
    private eventStates: EventsStateService,
    private router: Router,
    private route: ActivatedRoute,
    private bookUtils: BookUtilsService
  ) {
    this.loadAllLetters();
  }

  public loadBooks(): Observable<Record<string, BookDescription[]>> {
    this.eventStates.add(Events.loading, true);

    let letter = this.route.snapshot.paramMap.get('letter');
    if (!letter) {
      letter = this.defaultLetter;
    }

    return this.api.getAuthorsByLetter(letter).pipe(
      map((books: BookDescription[]) => {
        return books.reduce(
          (memo, book) => {
            const name = this.bookUtils.getAuthorDisplayName(book);

            memo[name] = memo[name] || [];
            memo[name].push(book);

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

  public async loadAllLetters() {
    this.eventStates.add(Events.loading, true);

    this.letters$ = this.api.getAllLetters().pipe(
      map((letters: string[]) => {
        return letters.sort((a, b) => {
          return a.localeCompare(b);
        });
      }),
      tap((letters: string[]) => {
        this.defaultLetter = letters[0];
      })
    );

    await firstValueFrom(this.letters$);
    this.eventStates.add(Events.loading, false);
  }

  public isActiveLetter(value: string): boolean {
    const letter = this.route.snapshot.paramMap.get('letter');
    if (letter && letter.length > 0) {
      return letter === value;
    }

    return letter === this.defaultLetter;
  }

  public ngOnDestroy() {
    this.destroyed$.next();
  }
}
