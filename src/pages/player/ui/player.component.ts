import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, firstValueFrom, Observable, tap } from 'rxjs';
import { BooksApiService } from 'src/pages/library/api/books-api.service';

import { BookCanvasComponent } from 'src/widgets/book-canvas';
import { OpenedBookService } from 'src/features/opened-book';
import { BookData } from 'src/entities/fb2';
import { TextParserService } from 'src/entities/fb2/api/text-parser.service';
import { MaterialModule } from 'src/shared/ui';

import { AutoPlayService } from '../api/auto-play.service';
import { DomHelperService } from '../api/dom-helper.service';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MaterialModule, BookCanvasComponent],
  standalone: true,
})
export class PlayerComponent implements OnInit, OnDestroy {
  public book$?: Observable<BookData | null>;

  constructor(
    private openedBookService: OpenedBookService,
    private autoPlay: AutoPlayService,
    private router: Router,
    private route: ActivatedRoute,
    private domHelper: DomHelperService,
    private booksApi: BooksApiService,
    private fb2Parser: TextParserService
  ) {
    this.router.events
      .pipe(
        takeUntilDestroyed(),
        filter(event => {
          return (
            event instanceof NavigationEnd &&
            this.router.url.match('/player') !== null
          );
        }),
        tap(async () => {
          this.openedBookService.update(null);
          await this.loadBookFromLibraryIfAny();
          this.domHelper.showActiveParagraph();
        })
      )
      .subscribe();

    this.book$ = this.openedBookService.book$;
  }

  private async loadBookFromLibraryIfAny() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const observable = this.booksApi.getById(id);
      observable.subscribe(book => {
        const bookData = this.fb2Parser.parse(book.content);
        this.openedBookService.update(bookData);
      });
      await firstValueFrom(observable);
    }
  }

  public playParagraph(index: number): void {
    this.autoPlay.start(index);
  }

  async ngOnInit() {
    this.book$ = this.openedBookService.book$;
    this.openedBookService.update(null);
    await this.loadBookFromLibraryIfAny();
    this.domHelper.showActiveParagraph();
  }

  ngOnDestroy() {
    this.autoPlay.ngOnDestroy();
  }
}
