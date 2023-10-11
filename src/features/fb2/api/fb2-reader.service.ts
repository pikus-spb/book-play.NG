import { Injectable } from '@angular/core';
import { first, map, Observable, switchMap } from 'rxjs';
import { AuthorName, Fb2XmlHelperService } from './fb2-xml-helper.service';
import { FileReaderHelperService } from './file-reader-helper.service';

export interface BookData {
  author: AuthorName;
  bookTitle: string;
  bookTitlePicture: string | null;
  paragraphs: string[];
}

@Injectable()
export class Fb2ReaderService {
  constructor(
    private xmlHelper: Fb2XmlHelperService,
    private fileHelper: FileReaderHelperService
  ) {}

  public readBook(file: Blob): Observable<BookData> {
    return this.fileHelper
      .detectEncoding(file)
      .pipe(
        first(),
        switchMap((encoding: string) => {
          return this.fileHelper.readFb2File(file, encoding);
        })
      )
      .pipe(
        first(),
        map((text: string) => {
          return this.parseBook(text);
        })
      );
  }

  private parseBook(text: string): BookData {
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'text/xml') as XMLDocument;

    const author = this.xmlHelper.getAuthorName(xml);
    const bookTitle = this.xmlHelper.getBookTitle(xml);
    const bookTitlePicture = this.xmlHelper.getBookTitlePicture(xml);
    const paragraphs = this.xmlHelper.getParagraphs(xml);
    //this.embedFootnotes(xml); // TODO: footnotes

    return {
      author,
      bookTitle,
      bookTitlePicture,
      paragraphs,
    } as BookData;
  }
  // private embedFootnotes(xml: XMLDocument) {
  //   Array.from(xml.documentElement?.querySelectorAll('a')).forEach(
  //     (linkElement: Element) => {
  //       const src = Array.from(linkElement.attributes).find(attr => {
  //         return Boolean(attr.localName.match('href'));
  //       })?.value;
  //       if (src && src.startsWith('#')) {
  //         let content = Array.from(xml.querySelectorAll(`${src}`))
  //           .map((p: Element) => this.cleanHTML(p.innerHTML))
  //           .join('');
  //         content = content.replace(/\.$/, ''); // remove possible extra tags and trailing dot
  //
  //         const noteElement = xml.createElement('i');
  //         noteElement.innerHTML = ` * - ${content} - * `;
  //
  //         linkElement.replaceWith(noteElement);
  //       }
  //     }
  //   );
  // }
}
