import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, shareReplay, Subject, tap } from 'rxjs';

import { OpenedBookService } from 'src/features/opened-book';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { AudioPlayerService } from 'src/shared/api';

import { AudioStorageService } from '../model/audio-storage.service';
import {
  AudioPreloadingService,
  PRELOAD_EXTRA,
} from './audio-preloading.service';

@Injectable({
  providedIn: 'root',
})
export class AutoPlayService implements OnDestroy {
  private destroyed$: Subject<void> = new Subject();
  private _paused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  public paused$: Observable<boolean> = this._paused$.pipe(shareReplay(1));
  public ready$!: Observable<boolean>; // TODO:

  constructor(
    private openedBook: OpenedBookService,
    private audioPlayer: AudioPlayerService,
    private cursorService: CursorPositionStoreService,
    private audioStorage: AudioStorageService,
    private preloadHelper: AudioPreloadingService
  ) {
    this.cursorService.position$
      .pipe(
        tap((position: number) => {
          this.preloadHelper.preloadParagraph(position);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  private resume(): void {
    this.audioPlayer.play();
    this._paused$.next(false);
  }

  private pause(): void {
    this.audioPlayer.pause();
    this._paused$.next(true);
  }

  private async ensureAudioDataReady() {
    if (!this.audioStorage.get(this.cursorService.position)) {
      await this.preloadHelper.preloadParagraph(
        this.cursorService.position,
        PRELOAD_EXTRA.min
      );
    }
  }

  private cursorPositionIsValid(): boolean {
    return (
      this.cursorService.position <
      (this.openedBook.book ? this.openedBook.book.paragraphs.length : 0)
    );
  }

  public toggle(): void {
    if (this.audioPlayer.paused) {
      if (this.audioPlayer.stopped) {
        this.start();
      } else {
        this.resume();
      }
    } else {
      this.pause();
    }
  }

  public async start(index: number = this.cursorService.position) {
    if (this.openedBook.book) {
      this.audioPlayer.stop();
      this.cursorService.position = index;
      this._paused$.next(false);

      do {
        await this.ensureAudioDataReady();

        this.audioPlayer.setAudio(
          this.audioStorage.get(this.cursorService.position)
        );
        if (await this.audioPlayer.play()) {
          this.cursorService.position++;
        }
      } while (this.cursorPositionIsValid() && !this.audioPlayer.stopped);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
