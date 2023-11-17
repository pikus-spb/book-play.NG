import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AudioPlayerService } from 'src/shared/api';
import { MaterialModule } from 'src/shared/ui';
// TODO: fix hierarchy
import { AutoPlayService } from '../../../pages/player/api/auto-play.service';

@Component({
  selector: 'player-button',
  templateUrl: './player-button.component.html',
  styleUrls: ['./player-button.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MaterialModule],
})
export class PlayerButtonComponent {
  constructor(
    public audioPlayer: AudioPlayerService,
    public autoPlay: AutoPlayService
  ) {}
}
