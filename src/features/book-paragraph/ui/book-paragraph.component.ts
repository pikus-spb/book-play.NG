import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'book-paragraph',
  standalone: true,
  templateUrl: './book-paragraph.component.html',
  styleUrls: ['./book-paragraph.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookParagraphComponent {
  @Input() text = '';
}
