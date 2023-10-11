import { Injectable } from '@angular/core';
import { first, map, Observable } from 'rxjs';

import { BookData } from './../model/fb2-book.types';
import { FileReaderService } from './file-reader.service';
import { TextParserService } from './text-parser.service';

@Injectable()
export class Fb2ReaderService {
  constructor(
    private fb2Parser: TextParserService,
    private fileHelper: FileReaderService
  ) {}

  public readBook(file: Blob): Observable<BookData> {
    return this.fileHelper.readFile(file).pipe(
      first(),
      map((text: string) => {
        return this.fb2Parser.parse(text);
      })
    );
  }
}
