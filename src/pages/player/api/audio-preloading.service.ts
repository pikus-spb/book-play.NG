import { Injectable } from '@angular/core';
import { first, firstValueFrom, Observable, switchMap, tap } from 'rxjs';

import { OpenedBookService } from 'src/features/opened-book';
import { Base64HelperService } from 'src/entities/base64';
import { SpeechService } from 'src/entities/speech';

import { AudioStorageService } from '../model/audio-storage.service';

export const PRELOAD_EXTRA = {
  min: 0,
  default: 2,
};

@Injectable({
  providedIn: 'root',
})
export class AudioPreloadingService {
  constructor(
    private openedBook: OpenedBookService,
    private audioStorage: AudioStorageService,
    private speechService: SpeechService,
    private base65Helper: Base64HelperService
  ) {}

  private fetchAudio(index: number): Observable<string> {
    return this.speechService
      .getVoice(this.openedBook.book?.paragraphs[index] ?? '')
      .pipe(
        switchMap((blob: Blob) => {
          return this.base65Helper.blobToBase64(blob);
        }),
        tap((base64audio: string) => {
          this.audioStorage.set(index, base64audio);
        }),
        first()
      );
  }

  public async preloadParagraph(
    index: number,
    extra = PRELOAD_EXTRA.default
  ): Promise<void> {
    const data = this.openedBook.book?.paragraphs;

    if (data && data.length > 0 && index >= 0) {
      for (let i = index; i <= index + extra && i < data.length; i++) {
        const savedAudio = this.audioStorage.get(i);
        if (!savedAudio) {
          await firstValueFrom(this.fetchAudio(i));
        }
      }
    }
  }
}
