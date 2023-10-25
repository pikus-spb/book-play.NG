import { BehaviorSubject, Observable, share } from 'rxjs';

export class CursorPositionStoreService {
  private storageName = '';
  private position$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

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
    this.position$.next(n);
  }

  get position(): number {
    return this.position$.value;
  }

  getPositionSubscription(): Observable<number> {
    return this.position$.pipe(share());
  }
}
