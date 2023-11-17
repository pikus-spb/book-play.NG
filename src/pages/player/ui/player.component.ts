import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { BookCanvasComponent } from 'src/widgets/book-canvas';
import { OpenedBookService } from 'src/features/opened-book';
import { BookData } from 'src/entities/fb2';
import { MaterialModule } from 'src/shared/ui';
import { AutoPlayService } from '../api/auto-play.service';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, BookCanvasComponent],
  standalone: true,
})
export class PlayerComponent implements OnInit, OnDestroy {
  book$?: Observable<BookData | null>;

  constructor(
    private openedBookService: OpenedBookService,
    private autoPlayService: AutoPlayService
  ) {}

  public playParagraph(index: number): void {
    this.autoPlayService.autoPlay(index);
  }

  ngOnInit() {
    this.book$ = this.openedBookService.book$;
  }

  ngOnDestroy() {
    this.autoPlayService.ngOnDestroy();
  }
}
