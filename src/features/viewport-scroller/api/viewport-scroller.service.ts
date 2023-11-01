import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ElementRef } from '@angular/core';
import { delay, shareReplay, Subject, takeUntil, tap } from 'rxjs';

export class ViewportScrollerService {
  private scrollComplete$: Subject<void> = new Subject<void>();

  constructor(
    private el: ElementRef,
    private viewport: CdkVirtualScrollViewport,
    private defaultElementTag: string
  ) {}

  private scrollToLastVisibleElement() {
    const paragraph = this.el.nativeElement.querySelector(
      `${this.defaultElementTag}:last-of-type`
    );
    if (paragraph) {
      paragraph.scrollIntoView();
    }
  }
  private scrollToFoundElement(index: number) {
    const paragraph = this.el.nativeElement.querySelector(
      `${this.defaultElementTag}:nth-of-type(${index})`
    );
    if (paragraph) {
      paragraph.scrollIntoView({ block: 'center' });
    }
  }

  private _scrollToIndex(index: number) {
    const range = this.viewport.getRenderedRange();
    if (index >= range.start && index <= range.end) {
      this.scrollToFoundElement(index - range.start);
      this.scrollComplete$.next();
    } else {
      this.scrollToLastVisibleElement();
    }
  }

  public scrollToIndex(index: number) {
    this.viewport.scrollToOffset(0);

    setTimeout(() => {
      this.viewport.scrollable
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
