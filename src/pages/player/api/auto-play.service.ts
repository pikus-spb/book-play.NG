import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, shareReplay, Subject, tap } from 'rxjs';

import { OpenedBookService } from 'src/features/opened-book';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { AudioPlayerService } from 'src/shared/api';
import { LoadingService } from 'src/shared/ui';

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

  constructor(
    private openedBook: OpenedBookService,
    private audioPlayer: AudioPlayerService,
    private cursorService: CursorPositionStoreService,
    private audioStorage: AudioStorageService,
    private preloadHelper: AudioPreloadingService,
    private loadingService: LoadingService // TODO:
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

  public toggle(): void {
    if (this.audioPlayer.paused) {
      if (this.audioPlayer.stopped) {
        this.play();
      } else {
        this.audioPlayer.play();
        this._paused$.next(false);
      }
    } else {
      this.audioPlayer.pause();
      this._paused$.next(true);
    }
  }

  public async play(index: number = this.cursorService.position) {
    if (this.openedBook.book) {
      this.audioPlayer.stop();

      this._paused$.next(false); // TODO: check audio service for paused$ - is it neeeded now?
      this.cursorService.position = index;

      do {
        if (!this.audioStorage.get(this.cursorService.position)) {
          await this.preloadHelper.preloadParagraph(
            this.cursorService.position,
            PRELOAD_EXTRA.min
          );
        }
        this.audioPlayer.setAudio(
          this.audioStorage.get(this.cursorService.position)
        );
        this.cursorService.position++;
        await this.audioPlayer.play();
      } while (
        this.cursorService.position < this.openedBook.book.paragraphs.length &&
        !this.audioPlayer.stopped
      );
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
