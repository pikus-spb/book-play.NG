import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.less'],
  standalone: true,
  imports: [RouterModule, MaterialModule],
})
export class MainMenuComponent {}
