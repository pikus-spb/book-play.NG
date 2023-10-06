import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { filter, tap } from 'rxjs';
import { MainHeaderComponent } from 'src/widgets/main-header';
import { MainMenuComponent } from 'src/widgets/main-menu';
import { CopyrightComponent } from 'src/entities/copyright';
import { MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.less'],
  imports: [
    MaterialModule,
    MainHeaderComponent,
    MainMenuComponent,
    RouterModule,
    CopyrightComponent,
  ],
  standalone: true,
})
export class MainComponent {
  loading = false;

  constructor(private router: Router) {
    this._subscribeToRouteChange();
  }

  private _subscribeToRouteChange() {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(event => event instanceof NavigationStart),
        tap(() => {
          this.loading = true;
        })
      )
      .subscribe();
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(event => event instanceof NavigationEnd),
        tap(() => {
          this.loading = false;
        })
      )
      .subscribe();
  }
}
