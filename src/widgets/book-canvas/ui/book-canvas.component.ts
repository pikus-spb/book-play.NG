import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

import { first, Observable, Subject, takeUntil, tap } from 'rxjs';
import { BookParagraphComponent } from 'src/features/book-paragraph';
import { ViewportScrollerService } from 'src/features/viewport-scroller';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { BookData } from 'src/entities/fb2';
import { BookHelperService } from 'src/entities/fb2/';
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
  @Output() paragraphClick: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('scrollViewport') viewport!: CdkVirtualScrollViewport;

  private viewportScroller?: ViewportScrollerService;
  private destroyed$: Subject<void> = new Subject<void>();

  constructor(
    private el: ElementRef,
    private bookHelper: BookHelperService,
    private cursorService: CursorPositionStoreService,
    public loadingService: LoadingService
  ) {}

  private scrollToIndex(cursorIndex: number): void {
    this.loadingService.loading = true;
    this.viewportScroller
      ?.scrollToIndex(cursorIndex)
      .pipe(
        first(),
        tap(() => {
          this.loadingService.loading = false;
        })
      )
      .subscribe();
  }

  onParagraphClick(index: number): void {
    this.paragraphClick.emit(index);
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
            this.scrollToIndex(this.cursorService.position);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
