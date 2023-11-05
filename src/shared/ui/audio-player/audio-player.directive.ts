import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  BehaviorSubject,
  fromEvent,
  Observable,
  share,
  shareReplay,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';

@Directive({
  selector: '[audioPlayer]',
  standalone: true,
  exportAs: 'audioPlayerContext',
})
export class AudioPlayerDirective implements AfterViewInit, OnDestroy {
  private audio: HTMLAudioElement | null = null;
  private pause$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private destroyed$: Subject<void> = new Subject<void>();

  public onDestroy$: Observable<void> = this.destroyed$.pipe(share());
  public paused$: Observable<boolean> = this.pause$.pipe(shareReplay(1));

  @Output() playFinished: EventEmitter<void> = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  private attachAudioEvents(audio: HTMLAudioElement): void {
    fromEvent(audio, 'play')
      .pipe(
        tap(() => {
          this.pause$.next(false);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
    fromEvent(audio, 'pause')
      .pipe(
        tap(() => {
          this.pause$.next(true);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
    fromEvent(audio, 'ended')
      .pipe(
        tap(() => {
          this.pause$.next(true);
          this.playFinished.emit();
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  public setAudio(base64Data: string): void {
    this.audio?.setAttribute('src', base64Data);
  }

  public play(): void {
    this.audio?.play();
  }

  public pause(): void {
    this.audio?.pause();
  }

  public toggle(): void {
    if (this.pause$.value) {
      this.play();
    } else {
      this.pause();
    }
  }

  ngAfterViewInit() {
    this.audio = document.createElement('audio');
    this.audio.setAttribute('hidden', 'true');

    this.attachAudioEvents(this.audio);

    this.el.nativeElement.appendChild(this.audio);
  }

  ngOnDestroy() {
    if (this.audio) {
      this.audio.remove();
      this.audio = null;
    }
    this.destroyed$.next();
  }
}
