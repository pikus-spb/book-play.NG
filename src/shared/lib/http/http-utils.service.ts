import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';

const DEFAULT_RETRY_NUM = 3;
const DEFAULT_RETRY_DELAY = 500;

@Injectable({
  providedIn: 'root',
})
export class HttpUtilsService {
  public retry(
    observable$: Observable<any>,
    times: number = DEFAULT_RETRY_NUM,
    delay: number = DEFAULT_RETRY_DELAY
  ) {
    return observable$.pipe(
      retry({
        count: times,
        delay: delay,
      })
    );
  }

  public createQueryParameters(options: object) {
    return Object.keys(options)
      .map((key: string) => `${key}=${options[key]}`)
      .join('&');
  }
}
