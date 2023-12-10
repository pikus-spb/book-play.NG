import { Injectable, OnDestroy } from '@angular/core';
import { filter, map, Observable, shareReplay, Subject } from 'rxjs';

interface EventState {
  name: string;
  state: boolean;
}

export enum Events {
  loading = 'loading',
  scrollingIntoView = 'scrollingIntoView',
}

@Injectable({
  providedIn: 'root',
})
export class EventsStateService implements OnDestroy {
  private _events$: Subject<EventState> = new Subject<EventState>();
  private _destroyed$: Subject<void> = new Subject<void>();

  constructor() {
    // Initial values
    this.add(Events.scrollingIntoView, false);
    this.add(Events.loading, false);
  }

  public add(name: Events, state: boolean) {
    this._events$.next({ name, state });
  }

  public get$(name: Events): Observable<boolean> {
    return this._events$.pipe(
      filter((state: EventState) => state.name === name),
      shareReplay(1),
      map((state: EventState) => state.state)
    );
  }

  ngOnDestroy() {
    this._destroyed$.next();
  }
}
