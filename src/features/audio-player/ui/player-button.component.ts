import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
} from '@angular/core';

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

  @HostListener('document:keyup.Space')
  public click() {
    const activeNode = document.activeElement as HTMLElement;
    if (activeNode) {
      if (!['input', 'textarea'].includes(activeNode.nodeName.toLowerCase())) {
        activeNode.blur(); // исключаем лишние клики
        this.autoPlay.toggle();
      }
    } else {
      this.autoPlay.toggle();
    }
  }
}
