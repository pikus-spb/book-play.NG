import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, tap } from 'rxjs';

import { OpenedBookService } from 'src/features/opened-book';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { AudioPlayerService } from 'src/shared/api';
import { LoadingService } from 'src/shared/ui';

import { AudioStorageService } from '../model/audio-storage.service';
import { AudioPreloadingService } from './audio-preloading.service';

const DEFAULT_PRELOAD_EXTRA = {
  zero: 0,
  min: 1,
  default: 3,
};

@Injectable({
  providedIn: 'root',
})
export class AutoPlayService implements OnDestroy {
  private destroyed$: Subject<void> = new Subject();

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
      this.autoPlay();
    } else {
      // TODO: stop auto play
      this.audioPlayer.pause();
    }
  }

  public async autoPlay(index: number = this.cursorService.position) {
    if (this.openedBook.book) {
      this.cursorService.position = index;

      await this.preloadHelper.preloadParagraph(
        index,
        DEFAULT_PRELOAD_EXTRA.min
      );

      while (
        this.cursorService.position < this.openedBook.book.paragraphs.length
      ) {
        this.preloadHelper.preloadParagraph(
          this.cursorService.position + DEFAULT_PRELOAD_EXTRA.default
        );

        if (!this.audioStorage.get(this.cursorService.position)) {
          await this.preloadHelper.preloadParagraph(
            this.cursorService.position,
            DEFAULT_PRELOAD_EXTRA.zero
          );
        }
        this.audioPlayer.setAudio(
          this.audioStorage.get(this.cursorService.position)
        );
        await this.audioPlayer.play();
        this.cursorService.position++;
      }
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
