import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BookCanvasComponent } from 'src/widgets/book-canvas';
import { NewBookService } from 'src/features/new-book-upload';
import { BookData } from 'src/entities/fb2';
import { MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, BookCanvasComponent],
  standalone: true,
})
export class PlayerComponent implements OnInit {
  book$?: Observable<BookData | null>;

  constructor(private newBook: NewBookService) {}

  ngOnInit() {
    this.book$ = this.newBook.getNewBookSubscription();
  }
}
