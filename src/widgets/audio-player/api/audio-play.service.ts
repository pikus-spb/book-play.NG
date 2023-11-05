import { Injectable } from '@angular/core';
import { concatMap, first, Observable, of, tap } from 'rxjs';

import { OpenedBookService } from 'src/features/opened-book';
import { BookData } from 'src/entities/fb2';
import { AudioPlayerDirective } from 'src/shared/ui';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayService {
  private player?: AudioPlayerDirective;

  public readonly canPlay$?: Observable<boolean>;

  constructor(private bookService: OpenedBookService) {
    this.canPlay$ = this.bookService.book$.pipe(
      concatMap((book: BookData | null) => {
        if (!book) {
          return of(false);
        }
        if (this.player) {
          return this.player.canPlay$;
        }
        return of(false);
      })
    );
  }

  public registerPlayer(player: AudioPlayerDirective): void {
    this.player = player;
    this.player.onDestroy$
      .pipe(
        first(),
        tap(() => {
          this.player = undefined;
        })
      )
      .subscribe();
  }

  public setAudio(base64Data: string): void {
    this.player?.setAudio(base64Data);
  }

  public play(): void {
    this.player?.play();
  }

  public pause(): void {
    this.player?.pause();
  }

  public toggle(): void {
    this.player?.toggle();
  }
}
