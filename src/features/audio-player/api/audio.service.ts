import { Injectable } from '@angular/core';
import { first, tap } from 'rxjs';

import { AudioPlayerDirective } from 'src/shared/ui';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private player?: AudioPlayerDirective;

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
