import { ChangeDetectionStrategy, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { filter, Observable, tap } from 'rxjs';
import { MainHeaderComponent } from 'src/widgets/main-header';
import { MainMenuComponent } from 'src/widgets/main-menu';
import { OpenedBookService } from 'src/features/opened-book';
import { CopyrightComponent } from 'src/entities/copyright';
import { CopyrightOwnerComponent } from 'src/entities/copyright-owner';
import { MaterialModule } from 'src/shared/ui';
import { EventsStateService, Events } from 'src/shared/ui';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    MainHeaderComponent,
    MainMenuComponent,
    RouterModule,
    CopyrightComponent,
    CopyrightOwnerComponent,
  ],
  standalone: true,
})
export class MainComponent {
  public loading$: Observable<boolean>;

  constructor(
    private router: Router,
    public eventStatesService: EventsStateService,
    public openedBook: OpenedBookService
  ) {
    this._subscribeToRouteChange();
    this.loading$ = eventStatesService.get$(Events.loading);
  }

  private _subscribeToRouteChange() {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(event => event instanceof NavigationStart),
        tap(() => {
          this.eventStatesService.add(Events.loading, true);
        })
      )
      .subscribe();
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          this.eventStatesService.add(Events.loading, false);
        })
      )
      .subscribe();
  }
}
