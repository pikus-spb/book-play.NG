import { Injectable } from '@angular/core';

export interface AuthorName {
  first: string;
  middle?: string;
  last: string;
}

@Injectable()
export class Fb2XmlHelperService {
  public getAuthorName(xml: XMLDocument): AuthorName {
    const authorFirstName =
      xml.documentElement?.querySelector('author first-name')?.innerHTML;
    const authorMiddleName =
      xml?.documentElement?.querySelector('author middle-name')?.innerHTML;
    const authorLastName =
      xml?.documentElement?.querySelector('author last-name')?.innerHTML;

    return {
      first: authorFirstName,
      middle: authorMiddleName,
      last: authorLastName,
    } as AuthorName;
  }

  public getBookTitle(xml: XMLDocument): string {
    return xml.documentElement?.querySelector('book-title')?.innerHTML;
  }

  public getBookTitlePicture(xml: XMLDocument): string | null {
    const imageElement = xml?.documentElement?.querySelector('coverpage image');
    if (imageElement != null) {
      const srcAttribute = Array.from(imageElement.attributes)
        .find(attr => {
          return Boolean(attr.localName.match('href'));
        })
        ?.value.substr(1);

      if (srcAttribute != null) {
        const binary = xml.getElementById(srcAttribute);
        const imageType = binary?.getAttribute('content-type');
        return `data:${imageType};base64,${binary?.innerHTML}`;
      }
    }
    return null;
  }

  public getParagraphs(xml: XMLDocument): string[] {
    return Array.from(xml.documentElement?.querySelectorAll('body p')).map(
      (item: Element) => item.innerHTML
    );
  }
}
