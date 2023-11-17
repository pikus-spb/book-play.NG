import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AudioPlayerService } from 'src/shared/api';
import { MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'player-button',
  templateUrl: './player-button.component.html',
  styleUrls: ['./player-button.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MaterialModule],
})
export class PlayerButtonComponent {
  constructor(public audioPlayer: AudioPlayerService) {}
}
