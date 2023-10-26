import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { retry } from 'rxjs/operators';

const DEFAULT_RETRY_NUM = 3;
const DEFAULT_RETRY_DELAY = 500;

@Injectable({
  providedIn: 'root',
})
export class HttpUtilsService {
  // TODO: is this useful after all?
  public retry(
    observable$: Observable<any>,
    times: number = DEFAULT_RETRY_NUM,
    delay: number = DEFAULT_RETRY_DELAY
  ) {
    return observable$.pipe(
      retry({
        count: times,
        delay,
      }),
      catchError(error => {
        console.error(`Http service unavailable: ${error.response}`);
        return of({ error: error.response });
      })
    );
  }

  public createQueryParameters(options: object) {
    return Object.keys(options)
      .map((key: string) => `${key}=${options[key]}`)
      .join('&');
  }
}
