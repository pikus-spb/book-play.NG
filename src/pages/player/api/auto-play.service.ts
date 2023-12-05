import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  firstValueFrom,
  fromEvent,
  Observable,
  shareReplay,
  Subject,
  tap,
  timer,
} from 'rxjs';

import { PARAGRAPH_CLASS_PREFIX } from 'src/features/book-paragraph';
import { OpenedBookService } from 'src/features/opened-book';
import { viewportScroller } from 'src/features/viewport-scroller';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { BookData } from 'src/entities/fb2';
import { AudioPlayerService } from 'src/shared/api';

import { Events, EventsStateService } from '../../../shared/ui';
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

  constructor(
    private openedBook: OpenedBookService,
    private audioPlayer: AudioPlayerService,
    private cursorService: CursorPositionStoreService,
    private audioStorage: AudioStorageService,
    private preloadHelper: AudioPreloadingService,
    private eventStateService: EventsStateService
  ) {
    this.cursorService.position$
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.showActiveParagraph(this.position);
          this.preloadHelper.preloadParagraph(this.position);
        })
      )
      .subscribe();

    this.openedBook.book$
      .pipe(
        takeUntilDestroyed(),
        tap((book: BookData | null) => {
          if (book) {
            this.showActiveParagraph(this.position);
            this.preloadHelper.preloadParagraph(this.position);
          }
        })
      )
      .subscribe();

    fromEvent(window, 'resize')
      .pipe(
        takeUntilDestroyed(),
        tap(() => {
          this.showActiveParagraph(this.position);
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
      this.eventStateService.add(Events.scrolling, true);
      await firstValueFrom(viewportScroller.scrollToIndex(cursorIndex));
      this.eventStateService.add(Events.scrolling, false);
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

  private getParagraphNode(index: number): HTMLElement | null {
    return document.body.querySelector(`.${PARAGRAPH_CLASS_PREFIX}${index}`);
  }

  private updateActiveCSSClass(element: HTMLElement): void {
    document.body.querySelector('p.active')?.classList.remove('active');
    element.classList.add('active');
  }

  public async showActiveParagraph(index = this.position) {
    await firstValueFrom(timer(100));

    let node = this.getParagraphNode(index);

    if (viewportScroller && !node) {
      await this.scrollToIndex(index);
      await firstValueFrom(timer(100));

      node = this.getParagraphNode(index);
    }
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.updateActiveCSSClass(node as HTMLElement);
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
