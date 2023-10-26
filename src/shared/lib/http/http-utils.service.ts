import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { repeat, take } from 'rxjs/operators';

const DEFAULT_RETRY_DELAY = 500;

@Injectable({
  providedIn: 'root',
})
export class HttpUtilsService {
  retryUntilSuccess<T>(source$: Observable<T>): Observable<T> {
    return source$.pipe(
      repeat({ delay: DEFAULT_RETRY_DELAY }),
      filter(res => res.status === 'completed'),
      take(1)
    );
  }

  public createQueryParameters(options: object) {
    return Object.keys(options)
      .map((key: string) => `${key}=${options[key]}`)
      .join('&');
  }
}
