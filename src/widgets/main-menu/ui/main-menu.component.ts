import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
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
  constructor(private fileService: FileUploadService) {}

  fileUploaded(files?: FileList) {
    this.fileService.parseNewFile(files);
  }
}
