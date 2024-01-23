import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { BooksGroupComponent } from 'src/widgets/books-group';
import { BookUtilsService } from 'src/entities/books';
import { BookDescription, BooksApiService } from 'src/entities/books/';
import { Events, EventsStateService, MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'library',
  standalone: true,
  imports: [RouterModule, MaterialModule, BooksGroupComponent],
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryComponent {
  private currentLetter = 'а';
  public Events = Events;

  constructor(
    public api: BooksApiService,
    public eventStates: EventsStateService,
    private router: Router,
    private route: ActivatedRoute,
    private bookUtils: BookUtilsService
  ) {
    this.route.params.subscribe(params => {
      const letter = params['letter'];
      if (this.currentLetter !== letter) {
        this.eventStates.add(Events.loading);
      }
    });
  }

  public loadBooks(): Observable<Record<string, BookDescription[]>> {
    return this.api
      .getAuthorsByLetter(
        this.route.snapshot.paramMap.get('letter') ?? this.currentLetter
      )
      .pipe(
        tap(() => {
          this.eventStates.remove(Events.loading, true);
        }),
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
        })
      );
  }

  public loadLetters(): Observable<string[]> {
    return this.api.getAllLetters().pipe(
      map((letters: string[]) => {
        return letters.sort((a, b) => {
          return a.localeCompare(b);
        });
      }),
      tap((letters: string[]) => {
        this.currentLetter = letters[0];
      })
    );
  }

  public isActiveLetter(value: string): Observable<boolean> {
    return this.route.params.pipe(
      map(params => {
        return value === (params['letter'] ?? this.currentLetter);
      })
    );
  }
}
