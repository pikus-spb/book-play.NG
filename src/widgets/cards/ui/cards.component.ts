import { Component } from '@angular/core';
import { CurrencyCardComponent } from 'src/features/currency-card';
import { DaylightCardComponent } from 'src/features/daylight-card';
import { WeatherCardComponent } from 'src/features/weather-card';
import { MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.less'],
  imports: [
    MaterialModule,
    WeatherCardComponent,
    CurrencyCardComponent,
    DaylightCardComponent,
  ],
  standalone: true,
})
export class CardsComponent {}
