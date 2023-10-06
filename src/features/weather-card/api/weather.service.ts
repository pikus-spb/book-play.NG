import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
  ROSCHINO_LATITUDE,
  ROSCHINO_LONGITUDE,
} from 'src/entities/geo-location';

import { WeatherRequest, WeatherUI } from '../model/weather';
import { WeatherMapperService } from './mappers/weather-mapper.service';

const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${ROSCHINO_LATITUDE}&longitude=${ROSCHINO_LONGITUDE}&current_weather=true`;

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(
    private http: HttpClient,
    private mapper: WeatherMapperService
  ) {}

  get(): Observable<WeatherUI> {
    return this.http
      .get<WeatherRequest>(API_URL)
      .pipe(map((data: WeatherRequest) => this.mapper.toUI(data)));
  }
}
