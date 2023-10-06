export interface WeatherUI {
  temperature: number;
  code: number;
}

export interface WeatherRequest {
  current_weather: {
    temperature: string;
    weathercode: string;
  };
}
