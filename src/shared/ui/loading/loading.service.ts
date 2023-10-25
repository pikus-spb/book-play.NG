import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, share, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  public loading$: Observable<boolean> = this._loading$.pipe(share());

  set loading(loading: boolean) {
    this._loading$.next(loading);
  }

  get loading(): boolean {
    return this._loading$.value;
  }
}
