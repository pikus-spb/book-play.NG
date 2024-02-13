import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, first, map, Observable, Subject, takeUntil, tap } from 'rxjs';

import { BookCanvasComponent } from 'src/widgets/book-canvas';
import { OpenedBookService } from 'src/features/opened-book';
import { BooksApiService, BookUtilsService } from 'src/entities/books/';
import { BookData, Fb2ReaderService } from 'src/entities/fb2';
import { DocumentTitleService } from 'src/entities/title';
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
    private eventStates: EventsStateService,
    private documentTitle: DocumentTitleService,
    private bookUtils: BookUtilsService
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
          if (this.route.snapshot.paramMap.get('id')) {
            this.loadBookFromLibrary();
          } else {
            this.domHelper.showActiveParagraph();
          }
        })
      )
      .subscribe();

    this.book$ = this.openedBookService.book$;
  }

  private loadBookFromLibrary() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventStates.add(Events.loading);
      this.openedBookService.update(null);

      this.booksApi
        .getById(id)
        .pipe(
          first(),
          map(book => this.fb2Reader.readBookFromString(book.content)),
          tap(bookData => {
            this.openedBookService.update(bookData);
            this.eventStates.remove(Events.loading);
          })
        )
        .subscribe();
    }
  }

  public playParagraph(index: number): void {
    this.autoPlay.stop();
    this.autoPlay.start(index);
  }

  ngOnInit() {
    this.book$ = this.openedBookService.book$;
    this.loadBookFromLibrary();
    this.book$
      .pipe(
        takeUntil(this._destroyed$),
        tap(book => {
          if (book) {
            this.documentTitle.setContextTitle(
              this.bookUtils.getBookFullDisplayName(book)
            );
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this._destroyed$.next();
  }
}
