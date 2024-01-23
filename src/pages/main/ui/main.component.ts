import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MainHeaderComponent } from 'src/widgets/main-header';
import { MainMenuComponent } from 'src/widgets/main-menu';
import { CopyrightComponent } from 'src/entities/copyright';
import { CopyrightOwnerComponent } from 'src/entities/copyright-owner';
import { Events, EventsStateService, MaterialModule } from 'src/shared/ui';

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
  public Events = Events;
  constructor(public eventStatesService: EventsStateService) {}
}
