import { Injectable, OnDestroy } from '@angular/core';
import { mergeMap, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AudioService } from 'src/features/audio-player';
import { OpenedBookService } from 'src/features/opened-book';
import { Base64HelperService } from 'src/entities/base64';
import { AudioSpeechService } from 'src/entities/speech';
import { CursorPositionStoreService } from '../../../entities/cursor';

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
    private cursorService: CursorPositionStoreService
  ) {
    this.cursorService.position$
      .pipe(
        mergeMap(() => {
          return this.openedBook.book$;
        }),
        tap(() => {
          this.setActiveParagraph(this.cursorService.position);
        }),
        takeUntil(this.destroyed$)
      )
      .subscribe();
  }

  public autoPlay(index: number) {
    // TODO:
  }

  public setActiveParagraph(index: number) {
    const data = this.openedBook.getBook()?.paragraphs;
    if (data && data.length > 0) {
      this.audioSpeechService
        .getVoice(data[index])
        .pipe(
          switchMap((blob: Blob) => {
            return this.base64Helper.blobToBase64(blob);
          }),
          tap((base64audio: string) => {
            this.audioService.setAudio(base64audio);
          }),
          takeUntil(this.destroyed$)
        )
        .subscribe();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}
