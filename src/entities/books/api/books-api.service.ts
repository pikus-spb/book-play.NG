import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, shareReplay } from 'rxjs';

import { BookDescription, Book } from '../model/books-model';

const protocol = document.location.protocol;
const port = protocol === 'https:' ? 8443 : 8080;
const API_URL = protocol + '//book-play.ru:' + port;
const RETRY_NUMBER = 3;

enum RequestSuffix {
  // all = '/get-all',
  letters = '/get-author-letters',
  byLetter = '/get-authors-by-letter/',
  byId = '/get-by-id/',
}

@Injectable({
  providedIn: 'root',
})
export class BooksApiService {
  private requestCache: Map<string, Observable<any | undefined>> = new Map<
    string,
    Observable<any>
  >();

  constructor(private http: HttpClient) {}

  /* @deprecated: Не использовать! (очень тяжелый метод)
  public getAll(): Observable<BookDescription[]> {
    if (this.requestCache.get(RequestSuffix.all) === undefined) {
      const observable = this.http
        .get(API_URL + RequestSuffix.all)
        .pipe(retry(RETRY_NUMBER), shareReplay(1));

      this.requestCache.set(RequestSuffix.all, observable);
    }

    return this.requestCache.get(RequestSuffix.all) as Observable<
      BookDescription[]
    >;
  }
*/

  public getAllLetters(): Observable<string[]> {
    if (this.requestCache.get(RequestSuffix.letters) === undefined) {
      const observable = this.http
        .get(API_URL + RequestSuffix.letters)
        .pipe(retry(RETRY_NUMBER), shareReplay(1));

      this.requestCache.set(RequestSuffix.letters, observable);
    }

    return this.requestCache.get(RequestSuffix.letters) as Observable<string[]>;
  }

  public getAuthorsByLetter(letter: string): Observable<BookDescription[]> {
    const suffix = RequestSuffix.byLetter + letter;
    if (this.requestCache.get(suffix) === undefined) {
      const observable = this.http
        .get(API_URL + suffix)
        .pipe(retry(RETRY_NUMBER), shareReplay(1));

      this.requestCache.set(suffix, observable);
    }

    return this.requestCache.get(suffix) as Observable<BookDescription[]>;
  }

  public getById(id: string): Observable<Book> {
    const suffix = RequestSuffix.byId + id;

    if (this.requestCache.get(suffix) === undefined) {
      const observable = this.http
        .get(API_URL + suffix)
        .pipe(retry(RETRY_NUMBER), shareReplay(1));

      this.requestCache.set(suffix, observable);
    }

    return this.requestCache.get(suffix) as Observable<Book>;
  }
}
