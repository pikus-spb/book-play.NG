import { Injectable } from '@angular/core';
import { first, Observable, Subject, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileReaderService {
  private detectEncoding(
    file: Blob,
    defaultEncoding = 'UTF-8'
  ): Observable<string> {
    const result = new Subject<string>();
    const reader = new FileReader();
    reader.onload = (fileEvent: Event) => {
      const content = (fileEvent.target as FileReader).result as string;
      let detectedEncoding = content?.match(/encoding="([^"]+)"/)?.[1];
      if (detectedEncoding == null) {
        detectedEncoding = defaultEncoding;
      }
      result.next(detectedEncoding);
    };
    reader.readAsBinaryString(file);

    return result;
  }

  public readFile(file: Blob): Observable<string> {
    return this.detectEncoding(file).pipe(
      first(),
      switchMap((encoding: string) => {
        const result = new Subject<string>();
        const reader = new FileReader();
        reader.onload = (fileEvent: Event) => {
          const text = (fileEvent.target as FileReader).result as string;
          result.next(text);
        };
        reader.readAsText(file, encoding);

        return result;
      })
    );
  }
}
