import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class FileReaderHelperService {
  public detectEncoding(file: Blob): Observable<string> {
    const result = new Subject<string>();
    const reader = new FileReader();
    reader.onload = (fileEvent: any) => {
      const content = fileEvent.target.result;
      const detectedEncoding = content.match(/encoding="([^"]+)"/)[1];
      result.next(detectedEncoding);
    };
    reader.readAsBinaryString(file);

    return result;
  }

  public readFb2File(file: Blob, encoding: string): Observable<string> {
    const result = new Subject<string>();
    const reader = new FileReader();
    reader.onload = (fileEvent: Event) => {
      const text = (fileEvent.target as FileReader).result as string;
      result.next(text);
    };
    reader.readAsText(file, encoding);

    return result;
  }
}
