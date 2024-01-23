import { Injectable } from '@angular/core';
import { BookDescription } from 'src/entities/books';

@Injectable({
  providedIn: 'root',
})
export class BookUtilsService {
  public getAuthorDisplayName(book: BookDescription): string {
    return `${book.authorFirstName[0]}.${book.authorLastName}`;
  }

  public getAuthorFullDisplayName(book: BookDescription): string {
    return `${book.authorFirstName} ${book.authorLastName}`;
  }
}
