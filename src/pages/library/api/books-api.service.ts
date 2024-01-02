import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, shareReplay } from 'rxjs';

import { BookDescription, Book } from '../model/books-model';

const API_URL = 'http://book-play.ru:8081';
const RETRY_NUMBER = 3;

enum RequestSuffix {
  all = '/get-all',
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
