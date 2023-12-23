import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable, tap } from 'rxjs';

import { BookCanvasComponent } from 'src/widgets/book-canvas';
import { OpenedBookService } from 'src/features/opened-book';
import { BookData } from 'src/entities/fb2';
import { MaterialModule } from 'src/shared/ui';

import { AutoPlayService } from '../api/auto-play.service';
import { DomHelperService } from '../api/dom-helper.service';

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
    private autoPlay: AutoPlayService,
    private router: Router,
    private domHelper: DomHelperService
  ) {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(event => {
          return (
            event instanceof NavigationEnd && this.router.url === '/player'
          );
        }),
        tap(() => {
          this.domHelper.showActiveParagraph();
        })
      )
      .subscribe();
  }

  public playParagraph(index: number): void {
    this.autoPlay.start(index);
  }

  ngOnInit() {
    this.book$ = this.openedBookService.book$;
  }

  ngOnDestroy() {
    this.autoPlay.ngOnDestroy();
  }
}
