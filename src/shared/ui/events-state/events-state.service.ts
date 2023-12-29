import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export enum Events {
  loading = 'loading',
  scrollingIntoView = 'scrollingIntoView',
  runUploadFile = 'runUploadFile',
}

@Injectable({
  providedIn: 'root',
})
export class EventsStateService implements OnDestroy {
  private _events$: Record<string, BehaviorSubject<boolean>> = {};
  private _destroyed$: Subject<void> = new Subject<void>();

  constructor() {
    for (const event in Events) {
      this._events$[event] = new BehaviorSubject(false);
    }
  }

  public add(name: Events, state: boolean) {
    this._events$[name].next(state);
  }

  public get$(name: Events): Observable<boolean> {
    return this._events$[name];
  }

  ngOnDestroy() {
    this._destroyed$.next();
  }
}
