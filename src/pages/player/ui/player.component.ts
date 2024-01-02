import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  filter,
  first,
  firstValueFrom,
  Observable,
  Subject,
  tap,
  timer,
} from 'rxjs';

import { BookCanvasComponent } from 'src/widgets/book-canvas';
import { OpenedBookService } from 'src/features/opened-book';
import { BooksApiService } from 'src/entities/books/';
import { BookData, Fb2ReaderService } from 'src/entities/fb2';
import { EventsStateService, Events, MaterialModule } from 'src/shared/ui';

import { AutoPlayService } from '../api/auto-play.service';
import { DomHelperService } from '../api/dom-helper.service';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, BookCanvasComponent],
  standalone: true,
})
export class PlayerComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<void> = new Subject<void>();
  public book$?: Observable<BookData | null>;

  constructor(
    private openedBookService: OpenedBookService,
    private autoPlay: AutoPlayService,
    private router: Router,
    private route: ActivatedRoute,
    private domHelper: DomHelperService,
    private booksApi: BooksApiService,
    private fb2Reader: Fb2ReaderService,
    private eventStates: EventsStateService
  ) {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(event => {
          return (
            event instanceof NavigationEnd &&
            this.router.url.match('/player') !== null
          );
        }),
        tap(async () => {
          this.loadBookFromLibrary();
        })
      )
      .subscribe();

    this.book$ = this.openedBookService.book$;
  }

  private async loadBookFromLibrary() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.autoPlay.stop();
      this.eventStates.add(Events.loading, true);
      this.openedBookService.update(null);

      const observable = this.booksApi.getById(id).pipe(first());
      observable.subscribe(book => {
        const bookData = this.fb2Reader.readBookFromString(book.content);
        this.openedBookService.update(bookData);
      });

      await firstValueFrom(observable);
      await firstValueFrom(timer(1));

      this.domHelper.showActiveParagraph();

      this.eventStates.add(Events.loading, false);
    }
  }

  public playParagraph(index: number): void {
    this.autoPlay.start(index);
  }

  async ngOnInit() {
    this.book$ = this.openedBookService.book$;
    await this.loadBookFromLibrary();
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this.autoPlay.ngOnDestroy();
  }
}
