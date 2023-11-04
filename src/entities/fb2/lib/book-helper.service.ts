import { Injectable } from '@angular/core';
import { BookData } from '../model/fb2-book.types';

@Injectable({
  providedIn: 'root',
})
export class BookHelperService {
  public getBookHashKey(book: BookData): string {
    return `${book.author.first}${book.author.middle}${book.author.last}${book.bookTitle}${book.paragraphs.length}`;
  }
}
