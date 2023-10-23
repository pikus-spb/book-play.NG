import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PostHelperService } from './post-helper.service';

const AUDIO_API_URL = 'https://tts.voicetech.yandex.net/generate';
const AUDIO_API_DEFAULT_OPTIONS = Object.freeze({
  key: '069b6659-984b-4c5f-880e-aaedcfd84102',
  format: 'mp3',
  lang: 'ru',
  speed: '0.9',
  emotion: 'neutral',
  quality: 'lo',
  speaker: 'ermil',
});
const AUDIO_HEADERS = new HttpHeaders({
  'Content-Type': 'application/x-www-form-urlencoded',
});

@Injectable()
export class AudioSpeechService {
  constructor(
    private http: HttpClient,
    private postHelper: PostHelperService
  ) {}

  public voice(text: string, speaker: string, speed: string): Observable<Blob> {
    text = encodeURIComponent(text);

    const options = {
      ...AUDIO_API_DEFAULT_OPTIONS,
      text,
      speaker,
      speed,
    };

    const postParams = this.postHelper.makePostParams(options);

    return this.http.post(AUDIO_API_URL, postParams, {
      headers: AUDIO_HEADERS,
      responseType: 'blob',
    });
  }
}
