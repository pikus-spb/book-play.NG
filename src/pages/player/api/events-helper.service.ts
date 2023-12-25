import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  debounceTime,
  fromEvent,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

import { viewportScroller } from 'src/features/viewport-scroller';
import { CursorPositionStoreService } from 'src/entities/cursor';

import { AudioPreloadingService } from './audio-preloading.service';
import { DomHelperService } from './dom-helper.service';

@Injectable({
  providedIn: 'root',
})
export class EventsHelperService implements OnDestroy {
  private destroyed$: Subject<void> = new Subject();

  public scrolled$?: Observable<Event>;

  constructor(
    private cursorService: CursorPositionStoreService,
    private domHelper: DomHelperService,
    private preloadHelper: AudioPreloadingService
  ) {}

  public attachEvents() {
    this.cursorService.position$
      .pipe(
        takeUntilDestroyed(),
        debounceTime(100),
        tap(async () => {
          this.domHelper.showActiveParagraph();
          this.preloadHelper.preloadParagraph(this.cursorService.position);
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
