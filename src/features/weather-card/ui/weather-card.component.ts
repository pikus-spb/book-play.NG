import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, tap } from 'rxjs';

import { WeatherCodeDescriptionPipe } from 'src/shared/pipes';
import { MaterialModule } from 'src/shared/ui';

import { WeatherService } from '../api/weather.service';
import { WeatherUI } from '../model/weather';

@Component({
  selector: 'weather-card',
  templateUrl: './weather-card.component.html',
  imports: [MaterialModule, CommonModule, WeatherCodeDescriptionPipe],
  standalone: true,
})
export class WeatherCardComponent {
  temperature: Subject<number> = new Subject<number>();
  weatherCode: Subject<number> = new Subject<number>();

  constructor(api: WeatherService) {
    api
      .get()
      .pipe(
        takeUntilDestroyed(),
        tap((data: WeatherUI) => {
          this.temperature.next(data.temperature);
          this.weatherCode.next(data.code);
        })
      )
      .subscribe();
  }
}
