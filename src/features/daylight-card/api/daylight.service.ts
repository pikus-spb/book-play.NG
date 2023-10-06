import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ROSCHINO_LATITUDE,
  ROSCHINO_LONGITUDE,
} from 'src/entities/geo-location';

import { Daylight } from '../model/daylight';

const API_URL = `https://api.bf5.ru/sun?lat=${ROSCHINO_LATITUDE}&lon=${ROSCHINO_LONGITUDE}`;

@Injectable({
  providedIn: 'root',
})
export class DaylightService {
  constructor(private http: HttpClient) {}

  get(): Observable<Daylight> {
    return this.http.get<Daylight>(API_URL);
  }
}
