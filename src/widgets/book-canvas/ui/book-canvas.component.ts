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
  ViewChild,
} from '@angular/core';

import { delay, Subject, takeUntil, tap } from 'rxjs';
import { BookParagraphComponent } from 'src/features/book-paragraph';
import { Author } from 'src/entities/fb2';
import { LoadingService, MaterialModule } from 'src/shared/ui';
const INDEX = 4000;

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
export class BookCanvasComponent implements AfterViewInit {
  @Input() paragraphs: string[] = [];
  @Input() author: Author = {} as Author;
  @Input() bookTitle = '';
  @Input() bookTitlePicture: string | null = '';
  @ViewChild('scrollViewport') scrollViewport!: CdkVirtualScrollViewport;

  private scrolledToIndex$ = new Subject<void>();

  constructor(
    private el: ElementRef,
    public loadingService: LoadingService
  ) {}

  private scrollToLastVisibleElement() {
    const paragraph = this.el.nativeElement.querySelector(
      `book-paragraph:last-of-type`
    );
    if (paragraph) {
      paragraph.scrollIntoView();
    }
  }

  private scrollToNthVisibleElement(index: number) {
    const paragraph = this.el.nativeElement.querySelector(
      `book-paragraph:nth-of-type(${index})`
    );
    if (paragraph) {
      paragraph.scrollIntoView({ block: 'center' });
    }
  }

  public scrollToIndex(index: number) {
    const range = this.scrollViewport.getRenderedRange();
    // console.log(range);
    if (index >= range.start && index <= range.end) {
      this.scrollToNthVisibleElement(index - range.start);
      this.scrolledToIndex$.next();
      this.loadingService.loading = false;
    } else {
      this.scrollToLastVisibleElement();
    }
  }

  ngAfterViewInit() {
    console.log(this.paragraphs[INDEX]);

    this.loadingService.loading = true;
    this.scrollViewport.scrollable
      .elementScrolled()
      .pipe(
        delay(1),
        takeUntil(this.scrolledToIndex$),
        tap(() => this.scrollToIndex(INDEX))
      )
      .subscribe();

    setTimeout(() => this.scrollToIndex(INDEX));
  }
}
