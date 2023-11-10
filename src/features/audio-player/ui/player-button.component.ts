import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ViewChild,
} from '@angular/core';

import { AudioPlayerDirective, MaterialModule } from 'src/shared/ui';
import { AudioService } from '../api/audio.service';

@Component({
  selector: 'player-button',
  templateUrl: './player-button.component.html',
  styleUrls: ['./player-button.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MaterialModule, AudioPlayerDirective],
})
export class PlayerButtonComponent implements AfterViewInit {
  @ViewChild('player') player?: AudioPlayerDirective;

  constructor(public audioService: AudioService) {}

  ngAfterViewInit() {
    if (this.player) {
      this.audioService.registerPlayer(this.player);
    }
  }
}
