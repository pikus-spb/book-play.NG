import { Injectable } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { AudioService } from 'src/features/audio-player';
import { OpenedBookService } from 'src/features/opened-book';
import { Base64HelperService } from 'src/entities/base64';
import { AudioSpeechService } from 'src/entities/speech';

@Injectable({
  providedIn: 'root',
})
export class AutoPlayService {
  constructor(
    private openedBook: OpenedBookService,
    private audioSpeechService: AudioSpeechService,
    private base64Helper: Base64HelperService,
    private audioService: AudioService
  ) {}

  // TODO: this is POC
  public playParagraph(index: number) {
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
            this.audioService.play();
          })
        )
        .subscribe();
    }
  }
}
