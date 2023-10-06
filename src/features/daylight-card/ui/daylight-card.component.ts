import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, tap } from 'rxjs';

import { HoursPipe, MinutesPipe } from 'src/shared/pipes';
import { MaterialModule } from 'src/shared/ui';

import { DaylightService } from '../api/daylight.service';
import { Daylight } from '../model/daylight';

@Component({
  selector: 'daylight-card',
  templateUrl: './daylight-card.component.html',
  styleUrls: ['./daylight-card.component.less'],
  imports: [CommonModule, MaterialModule, HoursPipe, MinutesPipe],
  standalone: true,
})
export class DaylightCardComponent {
  longitude: Subject<string> = new Subject();
  sunrise: Subject<string> = new Subject();
  sunset: Subject<string> = new Subject();

  constructor(api: DaylightService) {
    api
      .get()
      .pipe(
        takeUntilDestroyed(),
        tap((data: Daylight) => {
          this.longitude.next(data.longitude);
          this.sunrise.next(data.sunrise);
          this.sunset.next(data.sunset);
        })
      )
      .subscribe();
  }
}
