import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public loading$: Observable<boolean> = this._loading$.pipe(shareReplay(1));

  set loading(loading: boolean) {
    this._loading$.next(loading);
  }

  get loading(): boolean {
    return this._loading$.value;
  }
}
