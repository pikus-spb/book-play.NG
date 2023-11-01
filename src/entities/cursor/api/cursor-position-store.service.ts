import { BehaviorSubject, Observable, shareReplay } from 'rxjs';

export class CursorPositionStoreService {
  private storageName = '';
  private _position$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public position$: Observable<number> = this.position$.pipe(shareReplay(1));

  constructor(cursorName = '') {
    this.setCursorName(cursorName);
  }

  private readPosition() {
    this.position = parseInt(localStorage.getItem(this.storageName)) || 0;
  }

  setCursorName(name: string): void {
    this.storageName = `${name}-cursor`;
    this.readPosition();
  }

  set position(n: number) {
    localStorage.setItem(this.storageName, n.toString());
    this._position$.next(n);
  }

  get position(): number {
    return this._position$.value;
  }
}
