import { Injectable } from '@angular/core';
import { WeatherRequest, WeatherUI } from '../../model/weather';

@Injectable({
  providedIn: 'root',
})
export class WeatherMapperService {
  public toUI(data: WeatherRequest): WeatherUI {
    return {
      temperature: Number(data.current_weather.temperature),
      code: Number(data.current_weather.weathercode),
    } as WeatherUI;
  }
}
