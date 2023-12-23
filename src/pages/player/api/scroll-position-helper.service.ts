import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { OpenedBookService } from 'src/features/opened-book';
import { viewportScroller } from 'src/features/viewport-scroller';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { Events, EventsStateService } from 'src/shared/ui';

@Injectable({
  providedIn: 'root',
})
export class ScrollPositionHelperService {
  constructor(
    private eventStateService: EventsStateService,
    private cursorService: CursorPositionStoreService,
    private openedBook: OpenedBookService
  ) {}

  public cursorPositionIsValid(): boolean {
    return (
      this.cursorService.position <
      (this.openedBook.book ? this.openedBook.book.paragraphs.length : 0)
    );
  }

  public async scrollToIndex(cursorIndex: number): Promise<void> {
    if (viewportScroller) {
      this.eventStateService.add(Events.scrollingIntoView, true);
      await firstValueFrom(viewportScroller.scrollToIndex(cursorIndex));
      this.eventStateService.add(Events.scrollingIntoView, false);
    }
  }
}
