import { Injectable, OnDestroy } from '@angular/core';
import { filter, Observable, Subject, takeUntil, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService implements OnDestroy {
  private _loading$: Subject<boolean> = new Subject<boolean>();
  private _destroyed$: Subject<void> = new Subject<void>();

  set loading(loading: boolean) {
    this._loading$.next(loading);
  }

  public loading$: Observable<boolean> = new Observable<boolean>(subscriber => {
    let loadingIterationsCount = 0;

    this._loading$
      .pipe(
        filter((loading: boolean) => loading),
        tap(() => {
          loadingIterationsCount++;
          subscriber.next(true);
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe();
    this._loading$
      .pipe(
        filter((loading: boolean) => !loading),
        tap(() => {
          loadingIterationsCount--;
          if (loadingIterationsCount <= 0) {
            subscriber.next(false);
            loadingIterationsCount = 0;
          }
        }),
        takeUntil(this._destroyed$)
      )
      .subscribe();
  });

  ngOnDestroy() {
    this._destroyed$.next();
  }
}
