import { ScrollingModule } from '@angular/cdk/scrolling';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { Component, Input } from '@angular/core';

import { BookParagraphComponent } from 'src/features/book-paragraph';
import { Author } from 'src/entities/fb2';
import { MaterialModule } from 'src/shared/ui';

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
export class BookCanvasComponent {
  @Input() paragraphs: string[] = [];
  @Input() author: Author = {} as Author;
  @Input() bookTitle = '';
  @Input() bookTitlePicture: string | null = '';
}
