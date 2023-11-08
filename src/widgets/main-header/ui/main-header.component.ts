import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { PlayerButtonComponent } from 'src/features/audio-player';
import { MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MaterialModule, PlayerButtonComponent],
})
export class MainHeaderComponent {
  @Output() menuClick = new EventEmitter<void>();
}
