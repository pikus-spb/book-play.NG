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

  @HostListener('document:keydown.Space', ['$event'])
  public click(event: Event) {
    const node = event.target as HTMLElement;
    if (node) {
      if (!['input', 'textarea'].includes(node.nodeName.toLowerCase())) {
        event.preventDefault();
        this.autoPlay.toggle();
      }
    }
  }
}
