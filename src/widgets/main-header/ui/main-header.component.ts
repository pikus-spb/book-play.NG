import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { BehaviorSubject, merge, Subject, tap } from 'rxjs';
import { PlayerButtonComponent } from 'src/features/audio-player';
import { OpenedBookService } from 'src/features/opened-book';
import { MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MaterialModule, PlayerButtonComponent],
})
export class MainHeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
  public showPlayerButton$: Subject<boolean> = new BehaviorSubject(false);

  constructor(
    private openedBookService: OpenedBookService,
    private router: Router
  ) {
    merge(this.openedBookService.book$, this.router.events)
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.showPlayerButton$.next(
            openedBookService.book !== null &&
              router.url.indexOf('/player') !== -1
          );
        })
      )
      .subscribe();
  }
}
