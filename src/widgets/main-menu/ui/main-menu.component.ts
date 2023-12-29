import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatListItem } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { filter } from 'rxjs';

import { OpenedBookService } from 'src/features/opened-book';
import {
  Events,
  EventsStateService,
  MaterialModule,
  UploadFileDirective,
} from 'src/shared/ui';

import { FileUploadService } from '../api/file-upload.service';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterModule, MaterialModule, UploadFileDirective],
})
export class MainMenuComponent {
  @ViewChild('uploadButton') uploadButton?: MatListItem;

  constructor(
    private fileService: FileUploadService,
    private eventStates: EventsStateService,
    public openedBookService: OpenedBookService
  ) {
    this.eventStates
      .get$(Events.runUploadFile)
      .pipe(
        takeUntilDestroyed(),
        filter(value => value)
      )
      .subscribe(() => {
        this.uploadButton?._elementRef.nativeElement.click();
      });
  }

  fileUploaded(files?: FileList) {
    this.fileService.parseNewFile(files);
  }
}
