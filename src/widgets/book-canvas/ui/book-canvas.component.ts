import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { first, Observable, Subject, takeUntil, tap } from 'rxjs';
import { BookParagraphComponent } from 'src/features/book-paragraph';
import { ViewportScrollerService } from 'src/features/viewport-scroller';
import { BookData } from 'src/entities/fb2';
import { LoadingService, MaterialModule } from 'src/shared/ui';

const PARAGRAPH_TAG = 'book-paragraph';

@Component({
  selector: 'book-canvas',
  templateUrl: './book-canvas.component.html',
  styleUrls: ['./book-canvas.component.less'],
  standalone: true,
  imports: [
    MaterialModule,
    ScrollingModule,
    ExperimentalScrollingModule,
    BookParagraphComponent,
  ],
})
export class BookCanvasComponent implements AfterViewInit, OnDestroy {
  @Input() book$?: Observable<BookData | null>;
  @ViewChild('scrollViewport') viewport!: CdkVirtualScrollViewport;

  private cursorIndex = 2000; // TODO: for testing
  private viewportScroller?: ViewportScrollerService;
  private destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private el: ElementRef,
    public loadingService: LoadingService
  ) {}

  private scrollToCurrentIndex(): void {
    this.loadingService.loading = true;
    this.viewportScroller
      ?.scrollToIndex(this.cursorIndex)
      .pipe(
        first(),
        tap(() => {
          this.loadingService.loading = false;
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.viewportScroller = new ViewportScrollerService(
      this.el,
      this.viewport,
      PARAGRAPH_TAG
    );
    this.book$
      ?.pipe(
        takeUntil(this.destroyed$),
        tap((book: BookData | null) => {
          if (book) {
            console.log(book.paragraphs[this.cursorIndex]);
            this.scrollToCurrentIndex();
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
