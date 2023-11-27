import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  delay,
  firstValueFrom,
  fromEvent,
  Observable,
  shareReplay,
  Subject,
  tap,
} from 'rxjs';

import { PARAGRAPH_CLASS_PREFIX } from 'src/features/book-paragraph';
import { OpenedBookService } from 'src/features/opened-book';
import { viewportScroller } from 'src/features/viewport-scroller';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { BookData } from 'src/entities/fb2';
import { AudioPlayerService } from 'src/shared/api';

import { AudioStorageService } from '../model/audio-storage.service';
import {
  AudioPreloadingService,
  PRELOAD_EXTRA,
} from './audio-preloading.service';

@Injectable({
  providedIn: 'root',
})

// TODO: split logic? "S"_OLID
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
        takeUntilDestroyed(),
        tap(() => {
          this.makeParagraphActive(this.position);
          this.preloadHelper.preloadParagraph(this.position);
        })
      )
      .subscribe();

    this.openedBook.book$
      .pipe(
        takeUntilDestroyed(),
        delay(100), // give control to event loop and wait for ui to render
        tap(async (book: BookData | null) => {
          if (book) {
            await this.scrollToIndex(this.position);
            this.makeParagraphActive(this.position);
            this.preloadHelper.preloadParagraph(this.position);
          }
        })
      )
      .subscribe();

    fromEvent(window, 'resize')
      .pipe(
        takeUntilDestroyed(),
        tap(async () => {
          await this.scrollToIndex(this.position);
          this.makeParagraphActive(this.position);
        })
      )
      .subscribe();
  }

  private get position(): number {
    return this.cursorService.position;
  }

  private set position(position: number) {
    this.cursorService.position = position;
  }

  private async scrollToIndex(cursorIndex: number): Promise<void> {
    if (viewportScroller) {
      await firstValueFrom(viewportScroller.scrollToIndex(cursorIndex));
    }
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
    if (!this.audioStorage.get(this.position)) {
      await this.preloadHelper.preloadParagraph(
        this.position,
        PRELOAD_EXTRA.min
      );
    }
  }

  private cursorPositionIsValid(): boolean {
    return (
      this.position <
      (this.openedBook.book ? this.openedBook.book.paragraphs.length : 0)
    );
  }

  private makeParagraphActive(index: number) {
    const node = document.body.querySelector(
      `.${PARAGRAPH_CLASS_PREFIX}${index}`
    );
    if (node != null) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (node as HTMLElement).focus();
    }
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

  public async start(index: number = this.position) {
    if (this.openedBook.book) {
      this.audioPlayer.stop();
      this.position = index;
      this._paused$.next(false);

      do {
        await this.ensureAudioDataReady();

        this.audioPlayer.setAudio(this.audioStorage.get(this.position));

        if (await this.audioPlayer.play()) {
          this.position++;
        }
      } while (this.cursorPositionIsValid() && !this.audioPlayer.stopped);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
