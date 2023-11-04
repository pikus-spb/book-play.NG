import { Injectable } from '@angular/core';
import { AudioPlayerDirective } from '../../../shared/ui';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayService {
  private player?: AudioPlayerDirective;

  public registerPlayer(player: AudioPlayerDirective): void {
    this.player = player;
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
