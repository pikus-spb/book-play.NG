import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PostHelperService {
  public makePostParams(options: object) {
    return Object.keys(options)
      .map((key: string) => `${key}=${options[key]}`)
      .join('&');
  }
}
