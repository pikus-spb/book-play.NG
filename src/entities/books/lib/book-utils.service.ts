import { Injectable } from '@angular/core';
import { BookDescription } from 'src/entities/books';
import { BookData } from 'src/entities/fb2';

@Injectable({
  providedIn: 'root',
})
export class BookUtilsService {
  public getAuthorDisplayName(book: BookDescription): string {
    return `${book.authorFirstName[0]}.${book.authorLastName}`;
  }

  public getBookFullDisplayName(book: BookData): string {
    return `${book.author.first} ${book.author.last} - ${book.bookTitle}`;
  }

  public getAuthorFullDisplayName(book: BookDescription): string {
    return `${book.authorFirstName} ${book.authorLastName}`;
  }
}
