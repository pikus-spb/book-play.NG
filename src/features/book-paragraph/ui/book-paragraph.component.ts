import { Component, Input } from '@angular/core';

@Component({
  selector: 'book-paragraph',
  standalone: true,
  imports: [],
  templateUrl: './book-paragraph.component.html',
  styleUrls: ['./book-paragraph.component.less'],
})
export class BookParagraphComponent {
  @Input() text = '';
}