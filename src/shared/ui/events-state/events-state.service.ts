import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export enum Events {
  loading = 'loading',
  contentLoading = 'contentLoading',
  scrollingIntoView = 'scrollingIntoView',
  runUploadFile = 'runUploadFile',
}

@Injectable({
  providedIn: 'root',
})
export class EventsStateService implements OnDestroy {
  private _events$: Record<string, BehaviorSubject<boolean>> = {};
  private _events: Record<string, number> = {};
  private _destroyed$: Subject<void> = new Subject<void>();

  constructor() {
    for (const event in Events) {
      this._events$[event] = new BehaviorSubject(false);
      this._events[event] = 0;
    }
  }

  public add(name: Events) {
    this._events[name]++;
    this._events$[name].next(this._events[name] > 0);
  }

  public remove(name: Events, force = false) {
    if (force) {
      this._events[name] = 0;
    } else {
      this._events[name]--;
    }
    this._events$[name].next(this._events[name] > 0);
  }

  public get$(name: Events): Observable<boolean> {
    return this._events$[name];
  }

  ngOnDestroy() {
    this._destroyed$.next();
  }
}
