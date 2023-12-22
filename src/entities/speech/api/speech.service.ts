import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, shareReplay } from 'rxjs';

import { HttpUtilsService } from 'src/shared/lib';

const AUDIO_API_URL = 'https://pikus-dev.space/tts-api/tts.php';
const AUDIO_HEADERS = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded',
});
const RETRY_NUMBER = 3;

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  private dictionary: Record<string, Observable<Blob>> = {};

  constructor(
    private http: HttpClient,
    private httpUtils: HttpUtilsService
  ) {}

  private _getVoice(text: string): Observable<Blob> {
    text = encodeURIComponent(text);

    const options = { text };

    const postParams = this.httpUtils.createQueryParameters(options);

    return this.http
      .post(AUDIO_API_URL, postParams, {
        headers: AUDIO_HEADERS,
        responseType: 'blob',
      })
      .pipe(
        retry(RETRY_NUMBER),
        shareReplay(1),
        catchError((err: Error, caught: Observable<Blob>) => {
          console.error(err);
          console.error(`Audio API did not respond ${RETRY_NUMBER} times`);
          return caught;
        })
      );
  }

  public getVoice(text: string): Observable<Blob> {
    if (!this.dictionary[text]) {
      this.dictionary[text] = this._getVoice(text);
    }

    return this.dictionary[text];
  }
}
