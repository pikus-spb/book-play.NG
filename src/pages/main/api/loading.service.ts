import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  loading$: Observable<boolean> = new BehaviorSubject<boolean>(false);

  set loading(loading: boolean) {
    (this.loading$ as Subject<boolean>).next(loading);
  }

  get loading(): boolean {
    return (this.loading$ as BehaviorSubject<boolean>).value;
  }
}
