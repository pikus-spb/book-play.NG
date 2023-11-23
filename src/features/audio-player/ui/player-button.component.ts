import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AutoPlayService } from 'src/pages/player/api/auto-play.service'; // TODO: fix dependency hierarchy
import { MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'player-button',
  templateUrl: './player-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MaterialModule],
})
export class PlayerButtonComponent {
  constructor(public autoPlay: AutoPlayService) {}
}
