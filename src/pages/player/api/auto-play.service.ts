import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, tap } from 'rxjs';

import { OpenedBookService } from 'src/features/opened-book';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { AudioPlayerService } from 'src/shared/api';
import { LoadingService } from 'src/shared/ui';

import { AudioStorageService } from '../model/audio-storage.service';
import { AudioPreloadingService } from './audio-preloading.service';

const DEFAULT_PRELOAD_EXTRA = 2;

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
    private loadingService: LoadingService
  ) {
    this.cursorService.position$
      .pipe(
        tap((position: number) => {
          this.setCurrentParagraph(position);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  public autoPlay(index: number) {
    // TODO:
  }

  public async setCurrentParagraph(index: number) {
    this.loadingService.loading = true;
    await this.preloadHelper.preloadParagraph(index, DEFAULT_PRELOAD_EXTRA);
    this.loadingService.loading = false;

    this.audioPlayer.setAudio(this.audioStorage.get(index));
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
