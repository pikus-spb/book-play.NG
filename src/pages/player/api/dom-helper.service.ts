import { inject, Injectable, Injector } from '@angular/core';
import { firstValueFrom, timer } from 'rxjs';
import { PARAGRAPH_CLASS_PREFIX } from 'src/features/book-paragraph';
import { viewportScroller } from 'src/features/viewport-scroller';
import { CursorPositionStoreService } from 'src/entities/cursor';

import { EventsHelperService } from './events-helper.service';
import { ScrollPositionHelperService } from './scroll-position-helper.service';

@Injectable({
  providedIn: 'root',
})
export class DomHelperService {
  private get eventsHelper(): EventsHelperService {
    return this.injector.get(EventsHelperService);
  }

  constructor(
    private cursorService: CursorPositionStoreService,
    private scrollPositionHelper: ScrollPositionHelperService,
    private injector: Injector
  ) {}

  public updateActiveCSSClass(element: HTMLElement | null): void {
    document.body.querySelector('p.active')?.classList.remove('active');
    element?.classList.add('active');
  }

  public getParagraphNode(index: number): HTMLElement | null {
    return document.body.querySelector(`.${PARAGRAPH_CLASS_PREFIX}${index}`);
  }

  public async showActiveParagraph(index = this.cursorService.position) {
    await firstValueFrom(timer(100));

    let node = this.getParagraphNode(index);

    if (viewportScroller && !node) {
      await this.scrollPositionHelper.scrollToIndex(index);
      await firstValueFrom(timer(100));

      node = this.getParagraphNode(index);
    }
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.updateActiveCSSClass(node as HTMLElement);
    }

    if (viewportScroller) {
      this.eventsHelper.attachScrollingEvent(); // TODO: find a better place
    }
  }
}
