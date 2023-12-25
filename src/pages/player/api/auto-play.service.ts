import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  Observable,
  shareReplay,
  Subject,
} from 'rxjs';

import { OpenedBookService } from 'src/features/opened-book';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { SpeechService } from 'src/entities/speech';
import { AudioPlayerService } from 'src/shared/api';
import { Events, EventsStateService } from 'src/shared/ui';

import { AudioStorageService } from '../model/audio-storage.service';
import { AudioPreloadingService } from './audio-preloading.service';
import { DataHelperService } from './data-helper.service';
import { EventsHelperService } from './events-helper.service';
import { ScrollPositionHelperService } from './scroll-position-helper.service';

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
    private speechService: SpeechService,
    private cursorService: CursorPositionStoreService,
    private audioStorage: AudioStorageService,
    private eventStateService: EventsStateService,
    private eventsHelper: EventsHelperService,
    private dataHelper: DataHelperService,
    private preloadingService: AudioPreloadingService,
    private scrollPositionHelper: ScrollPositionHelperService
  ) {
    this.eventsHelper.attachEvents();
  }

  private resume(): void {
    this.audioPlayer.play();
    this._paused$.next(false);
  }

  private pause(): void {
    this.audioPlayer.pause();
    this._paused$.next(true);
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
      if (this.preloadingService.initialized) {
        this.speechService.cancelAllVoiceRequests();
      }
      this.cursorService.position = index;
      this._paused$.next(false);
      this.eventStateService.add(Events.loading, false);

      do {
        const isScrollingNow = await firstValueFrom(
          this.eventStateService.get$(Events.scrollingIntoView)
        );
        if (isScrollingNow) {
          // wait until scrolling is false
          await firstValueFrom(
            this.eventStateService
              .get$(Events.scrollingIntoView)
              .pipe(filter(value => !value))
          );
        }

        await this.dataHelper.ensureAudioDataReady();

        this.audioPlayer.setAudio(
          this.audioStorage.get(this.cursorService.position)
        );

        if (await this.audioPlayer.play()) {
          this.cursorService.position++;
        }
      } while (
        this.scrollPositionHelper.cursorPositionIsValid() &&
        !this.audioPlayer.stopped
      );
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
