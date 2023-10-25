import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, fromEvent, Observable, share, tap } from 'rxjs';

@Directive({
  selector: '[audioPlayer]',
  standalone: true,
  exportAs: 'audioPlayerContext',
})
export class AudioPlayerDirective implements AfterViewInit, OnDestroy {
  private audio: HTMLAudioElement | null = null;
  private pause$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public paused$: Observable<boolean> = this.pause$.pipe(share());

  @Output() playFinished: EventEmitter<void> = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  private attachAudioEvents(audio: HTMLAudioElement): void {
    fromEvent(audio, 'play')
      .pipe(
        tap(() => {
          this.pause$.next(false);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
    fromEvent(audio, 'pause')
      .pipe(
        tap(() => {
          this.pause$.next(true);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
    fromEvent(audio, 'ended')
      .pipe(
        tap(() => {
          this.pause$.next(true);
          this.playFinished.emit();
        }),
        takeUntilDestroyed()
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
  }
}
