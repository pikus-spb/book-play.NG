import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  firstValueFrom,
  fromEvent,
  Observable,
  shareReplay,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService implements OnDestroy {
  private destroyed$: Subject<void> = new Subject<void>();
  private audio!: HTMLAudioElement;
  private _paused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  public paused$: Observable<boolean> = this._paused$.pipe(shareReplay(1));

  constructor() {
    this.createAudioElement();
  }

  private createAudioElement(): void {
    this.audio = document.createElement('audio');
    this.audio.setAttribute('hidden', 'true');
    document.body.appendChild(this.audio);

    this.attachAudioEvents();
  }

  private attachAudioEvents(): void {
    fromEvent(this.audio, 'paused').pipe(
      takeUntil(this.destroyed$),
      tap(() => this._paused$.next(true))
    );
    fromEvent(this.audio, 'play').pipe(
      takeUntil(this.destroyed$),
      tap(() => this._paused$.next(false))
    );
    fromEvent(this.audio, 'ended').pipe(
      takeUntil(this.destroyed$),
      tap(() => this._paused$.next(true))
    );
  }

  public setAudio(base64Data: string): void {
    if (!this.audio.paused) {
      this.audio.pause();
    }
    this.audio.src = base64Data;
    this.audio.load();
  }

  public async play(): Promise<void> {
    const ended$ = fromEvent(this.audio, 'ended');
    await this.audio.play();
    await firstValueFrom(ended$);
  }

  public pause(): void {
    this.audio.pause();
  }

  ngOnDestroy() {
    if (this.audio) {
      document.removeChild(this.audio);
    }
    this.destroyed$.next();
  }
}
