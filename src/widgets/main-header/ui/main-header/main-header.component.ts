import { Component, EventEmitter, Output } from '@angular/core';
import { MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.less'],
  standalone: true,
  imports: [MaterialModule],
})
export class MainHeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
}
