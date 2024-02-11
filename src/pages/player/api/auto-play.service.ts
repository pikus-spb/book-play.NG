import { Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  debounceTime,
  filter,
  firstValueFrom,
  fromEvent,
  Observable,
  shareReplay,
  tap,
} from 'rxjs';

import { DomHelperService } from 'src/pages/player/api/dom-helper.service';
import { OpenedBookService } from 'src/features/opened-book';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { SpeechService } from 'src/entities/speech';
import { AudioPlayerService } from 'src/shared/api';
import { Events, EventsStateService } from 'src/shared/ui';

import { AudioStorageService } from '../model/audio-storage.service';
import { AudioPreloadingService } from './audio-preloading.service';
import { DataHelperService } from './data-helper.service';
import { ScrollPositionHelperService } from './scroll-position-helper.service';

@Injectable({
  providedIn: 'root',
})
export class AutoPlayService {
  private _paused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  public paused$: Observable<boolean> = this._paused$.pipe(shareReplay(1));

  constructor(
    private router: Router,
    private openedBook: OpenedBookService,
    private audioPlayer: AudioPlayerService,
    private speechService: SpeechService,
    private audioStorage: AudioStorageService,
    private eventStateService: EventsStateService,
    private dataHelper: DataHelperService,
    private preloadingService: AudioPreloadingService,
    private scrollPositionHelper: ScrollPositionHelperService,
    private cursorService: CursorPositionStoreService,
    private domHelper: DomHelperService,
    private preloadHelper: AudioPreloadingService
  ) {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(event => {
          return event instanceof NavigationEnd;
        }),
        tap(async () => {
          if (!this.router.url.match('player')) {
            this.stop();
          }
        })
      )
      .subscribe();

    this.cursorService.position$
      .pipe(
        takeUntilDestroyed(),
        tap(async () => {
          this.domHelper.showActiveParagraph();
          this.preloadHelper.preloadParagraph(this.cursorService.position);
        })
      )
      .subscribe();

    fromEvent(window, 'resize')
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.domHelper.showActiveParagraph();
        })
      )
      .subscribe();

    this.openedBook.book$
      .pipe(
        takeUntilDestroyed(),
        filter(book => Boolean(book)),
        debounceTime(300),
        tap(() => {
          this.stop();
          this.domHelper.showActiveParagraph();
        })
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

  public stop(): void {
    this.audioPlayer.stop();
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

  public async start(index?: number) {
    if (this.preloadingService.initialized) {
      this.speechService.cancelAllVoiceRequests();
    }
    if (index && index >= 0) {
      this.cursorService.position = index;
    }
    this._paused$.next(false);
    this.eventStateService.remove(Events.loading, true);

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
