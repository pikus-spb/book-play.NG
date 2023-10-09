import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule, UploadFileDirective } from 'src/shared/ui';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.less'],
  standalone: true,
  imports: [RouterModule, MaterialModule, UploadFileDirective],
})
export class MainMenuComponent {
  fileUploaded(files?: FileList) {
    if (files && files.length > 0) {
      console.log(files[0].name);
    }
  }
}
