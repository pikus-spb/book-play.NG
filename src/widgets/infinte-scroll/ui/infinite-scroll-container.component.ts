import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { Component, Input } from '@angular/core';

import { BookParagraphComponent } from 'src/features/book-paragraph';
import { MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'infinite-scroll-container',
  templateUrl: './infinite-scroll-container.component.html',
  styleUrls: ['./infinite-scroll-container.component.less'],
  standalone: true,
  imports: [
    MaterialModule,
    ScrollingModule,
    ExperimentalScrollingModule,
    BookParagraphComponent,
  ],
})
export class InfiniteScrollContainerComponent {
  @Input() items: string[] = [];
}
