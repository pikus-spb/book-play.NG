import { Injectable, OnDestroy } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';

interface EventState {
  name: string;
  state: boolean;
}

export enum Events {
  loading = 'loading',
  scrolling = 'scrolling',
}

@Injectable({
  providedIn: 'root',
})
export class EventsStateService implements OnDestroy {
  private _events$: Subject<EventState> = new Subject<EventState>();
  private _destroyed$: Subject<void> = new Subject<void>();

  public add(name: Events, state: boolean) {
    this._events$.next({ name, state });
  }

  public get$(name: Events): Observable<boolean> {
    return this._events$.pipe(
      filter((state: EventState) => state.name === name),
      map((state: EventState) => state.state)
    );
  }

  ngOnDestroy() {
    this._destroyed$.next();
  }
}
