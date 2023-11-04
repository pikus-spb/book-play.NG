import { Injectable } from '@angular/core';
const DEFAULT_RETRY_DELAY = 500;

@Injectable({
  providedIn: 'root',
})
export class HttpUtilsService {
  public createQueryParameters(options: Record<string, string>) {
    return Object.keys(options)
      .map((key: string) => `${key}=${options[key]}`)
      .join('&');
  }
}
