import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ElementRef } from '@angular/core';
import {
  delay,
  first,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

export let viewportScroller: null | ViewportScrollerService = null;

class ViewportScrollerService {
  private scrollComplete$: Subject<void> = new Subject<void>();
  public scrolled$!: Observable<Event>;

  constructor(
    private el: ElementRef | undefined,
    private viewport: CdkVirtualScrollViewport | undefined,
    private defaultElementTag: string,
    private onDestroy$: Observable<void>
  ) {
    this.onDestroy$
      .pipe(
        first(),
        tap(() => {
          this.el = undefined;
          this.viewport = undefined;
          viewportScroller = null;
        })
      )
      .subscribe();

    if (this.viewport) {
      this.scrolled$ = this.viewport.scrollable.elementScrolled();
    }
  }

  private scrollToLastVisibleElement() {
    const paragraph = this.el?.nativeElement.querySelector(
      `${this.defaultElementTag}:last-of-type`
    );
    if (paragraph) {
      paragraph.scrollIntoView();
    }
  }
  private scrollToFoundElement(index: number) {
    const paragraph = this.el?.nativeElement.querySelector(
      `${this.defaultElementTag}:nth-of-type(${index})`
    );
    if (paragraph) {
      paragraph.scrollIntoView({ block: 'center' });
    }
  }

  private _scrollToIndex(index: number) {
    const range = this.viewport?.getRenderedRange();
    if (range) {
      if (index >= range.start && index <= range.end) {
        this.scrollToFoundElement(index - range.start);
        this.scrollComplete$.next();
      } else {
        this.scrollToLastVisibleElement();
      }
    }
  }

  public scrollToIndex(index: number) {
    this.viewport?.scrollToOffset(0);

    setTimeout(() => {
      this.viewport?.scrollable
        .elementScrolled()
        .pipe(
          takeUntil(this.scrollComplete$),
          delay(1),
          tap(() => this._scrollToIndex(index))
        )
        .subscribe();

      this._scrollToIndex(index);
    });

    return this.scrollComplete$.pipe(shareReplay(1));
  }
}

export function createViewportScrollerService(
  el: ElementRef | undefined,
  viewport: CdkVirtualScrollViewport | undefined,
  defaultElementTag: string,
  destroy$: Observable<void>
) {
  if (viewportScroller != null) {
    throw new Error('Multiple viewport scroller creation!');
  }
  viewportScroller = new ViewportScrollerService(
    el,
    viewport,
    defaultElementTag,
    destroy$
  );
}
