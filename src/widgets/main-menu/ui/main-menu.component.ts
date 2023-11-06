import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OpenedBookService } from 'src/features/opened-book';
import { MaterialModule, UploadFileDirective } from 'src/shared/ui';
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
  constructor(
    private fileService: FileUploadService,
    public openedBookService: OpenedBookService
  ) {}

  fileUploaded(files?: FileList) {
    this.fileService.parseNewFile(files);
  }
}
