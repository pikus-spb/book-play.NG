import { BehaviorSubject, Observable, share } from 'rxjs';

export class CursorPositionMemoryService {
  private key = '';
  private $position: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor(key = '') {
    this.setKey(key);
  }

  private readPosition() {
    this.position = parseInt(localStorage.getItem(this.key)) || 0;
  }

  setKey(key: string): void {
    this.key = `${key}-cursor`;
    this.readPosition();
  }

  set position(n: number) {
    localStorage.setItem(this.key, n.toString());
    this.$position.next(n);
  }

  get position(): number {
    return this.$position.value;
  }

  getPositionObservable(): Observable<number> {
    return this.$position.pipe(share());
  }
}
