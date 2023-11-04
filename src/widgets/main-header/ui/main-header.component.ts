import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { AudioPlayService } from 'src/entities/speech';
import { AudioPlayerDirective, MaterialModule } from 'src/shared/ui';

@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MaterialModule, AudioPlayerDirective],
})
export class MainHeaderComponent implements AfterViewInit {
  @Output() menuClick = new EventEmitter<void>();
  @ViewChild('player') player?: AudioPlayerDirective;

  constructor(private playerService: AudioPlayService) {}

  ngAfterViewInit() {
    if (this.player) {
      this.playerService.registerPlayer(this.player);
    }
  }
}
