import { Injectable } from '@angular/core';
import { first, firstValueFrom, Observable, switchMap, tap } from 'rxjs';

import { OpenedBookService } from 'src/features/opened-book';
import { Base64HelperService } from 'src/entities/base64';
import { SpeechService } from 'src/entities/speech';

import { AudioStorageService } from '../model/audio-storage.service';

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

  public preloadParagraph(index: number, extra = 0): Promise<any> {
    const data = this.openedBook.book?.paragraphs;
    const promises: Promise<any>[] = [Promise.resolve()];

    if (data && data.length > 0 && index >= 0 && index < data.length) {
      for (let i = index; i <= index + extra; i++) {
        const savedAudio = this.audioStorage.get(i);
        if (!savedAudio) {
          promises.push(firstValueFrom(this.fetchAudio(i)));
        }
      }
    }

    return Promise.all(promises);
  }
}
