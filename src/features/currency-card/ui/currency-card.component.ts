import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, tap } from 'rxjs';

import { MaterialModule } from 'src/shared/ui';

import { CurrencyRatesService } from '../api/currency-rates.service';
import { CurrencyUI } from '../model/currency';

@Component({
  selector: 'currency-card',
  templateUrl: './currency-card.component.html',
  styleUrls: ['./currency-card.component.less'],
  imports: [CommonModule, MaterialModule],
  standalone: true,
})
export class CurrencyCardComponent {
  eurRate: Subject<string> = new Subject();
  usdRate: Subject<string> = new Subject();

  constructor(api: CurrencyRatesService) {
    api
      .get()
      .pipe(
        takeUntilDestroyed(),
        tap((data: CurrencyUI) => {
          this.eurRate.next(data.eur);
          this.usdRate.next(data.usd);
        })
      )
      .subscribe();
  }
}
