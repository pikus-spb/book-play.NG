import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { BookParagraphComponent } from 'src/features/book-paragraph';
import { createViewportScrollerService } from 'src/features/viewport-scroller';
import { BookData } from 'src/entities/fb2';
import { MaterialModule } from 'src/shared/ui';

const PARAGRAPH_TAG = 'book-paragraph';

@Component({
  selector: 'book-canvas',
  templateUrl: './book-canvas.component.html',
  styleUrls: ['./book-canvas.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  private destroyed$: Subject<void> = new Subject<void>();

  constructor(private el: ElementRef) {}

  public onParagraphClick(index: number): void {
    this.paragraphClick.emit(index);
  }

  ngAfterViewInit() {
    createViewportScrollerService(
      this.el,
      this.viewport,
      PARAGRAPH_TAG,
      this.destroyed$
    );
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
