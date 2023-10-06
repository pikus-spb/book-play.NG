import { Injectable } from '@angular/core';
import { CurrencyRequest, CurrencyUI } from '../../model/currency';

@Injectable({
  providedIn: 'root',
})
export class CurrencyMapper {
  public toUI(data: CurrencyRequest): CurrencyUI {
    return {
      eur: (1 / data.rates.EUR).toFixed(2),
      usd: (1 / data.rates.USD).toFixed(2),
    } as CurrencyUI;
  }
}
