import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Links } from '../model/links';

@Injectable({
  providedIn: 'root',
})
export class LinksService {
  constructor(private http: HttpClient) {}

  get(): Observable<Links> {
    return this.http
      .get<Links>('/entities/links/api/links.json')
      .pipe(map(this.sortBySectionName));
  }

  private sortBySectionName(links: Links): Links {
    return links.sort((sectionA, sectionB) => {
      return sectionA.name.localeCompare(sectionB.name);
    });
  }
}
