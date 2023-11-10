import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { mergeMap, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AudioService } from 'src/features/audio-player';
import { OpenedBookService } from 'src/features/opened-book';
import { Base64HelperService } from 'src/entities/base64';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { AudioSpeechService } from 'src/entities/speech';
import { AudioStorageService } from '../model/audio-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AutoPlayService implements OnDestroy {
  private destroyed$: Subject<void> = new Subject();

  constructor(
    private openedBook: OpenedBookService,
    private audioSpeechService: AudioSpeechService,
    private base64Helper: Base64HelperService,
    private audioService: AudioService,
    private cursorService: CursorPositionStoreService,
    private audioStorage: AudioStorageService
  ) {
    this.cursorService.position$
      .pipe(
        mergeMap(() => {
          return this.openedBook.book$;
        }),
        tap(() => {
          this.setActiveParagraph(this.cursorService.position);
        }),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  public autoPlay(index: number) {
    // TODO:
  }

  public setActiveParagraph(index: number) {
    const data = this.openedBook.book?.paragraphs;
    if (data && data.length > 0) {
      const savedAudio = this.audioStorage.get(index);
      if (savedAudio) {
        this.audioService.setAudio(savedAudio);
      } else {
        this.audioSpeechService
          .getVoice(data[index])
          .pipe(
            switchMap((blob: Blob) => {
              return this.base64Helper.blobToBase64(blob);
            }),
            tap((base64audio: string) => {
              this.audioStorage.set(index, base64audio);
              this.audioService.setAudio(base64audio);
            }),
            takeUntil(this.destroyed$)
          )
          .subscribe();
      }
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
