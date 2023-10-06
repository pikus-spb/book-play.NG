import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CurrencyRequest, CurrencyUI } from '../model/currency';
import { CurrencyMapper } from './mappers/currency-mapper.service';

const API_URL = 'https://www.cbr-xml-daily.ru/latest.js';

@Injectable({
  providedIn: 'root',
})
export class CurrencyRatesService {
  constructor(
    private http: HttpClient,
    private mapper: CurrencyMapper
  ) {}

  get(): Observable<CurrencyUI> {
    return this.http
      .get<CurrencyRequest>(API_URL)
      .pipe(map((data: CurrencyRequest) => this.mapper.toUI(data)));
  }
}
