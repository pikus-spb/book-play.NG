import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Observable, Subject, takeUntil, tap } from 'rxjs';
import { OpenedBookService } from 'src/features/opened-book';

import { viewportScroller } from 'src/features/viewport-scroller';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { BookData } from 'src/entities/fb2';

import {
  AudioPreloadingService,
  PRELOAD_EXTRA,
} from './audio-preloading.service';
import { DomHelperService } from './dom-helper.service';

@Injectable({
  providedIn: 'root',
})
export class EventsHelperService implements OnDestroy {
  public scrolled$?: Observable<Event>;
  private destroyed$: Subject<void> = new Subject();

  constructor(
    private cursorService: CursorPositionStoreService,
    private domHelper: DomHelperService,
    private preloadHelper: AudioPreloadingService,
    private openedBook: OpenedBookService
  ) {}

  public attachEvents() {
    this.cursorService.position$
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.domHelper.showActiveParagraph();
          this.preloadHelper.preloadParagraph(this.cursorService.position);
        })
      )
      .subscribe();

    this.openedBook.book$
      .pipe(
        takeUntilDestroyed(),
        tap((book: BookData | null) => {
          if (book) {
            this.domHelper.showActiveParagraph();
            this.preloadHelper.preloadParagraph(
              this.cursorService.position,
              PRELOAD_EXTRA.min
            );
          }
        })
      )
      .subscribe();

    fromEvent(window, 'resize')
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.domHelper.showActiveParagraph();
        })
      )
      .subscribe();
  }

  public attachScrollingEvent() {
    if (viewportScroller && !this.scrolled$) {
      this.scrolled$ = viewportScroller.scrolled$;

      this.scrolled$
        ?.pipe(
          takeUntil(this.destroyed$),
          tap(() => {
            const node = this.domHelper.getParagraphNode(
              this.cursorService.position
            );
            this.domHelper.updateActiveCSSClass(node);
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
