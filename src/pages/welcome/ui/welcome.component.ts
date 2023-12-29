import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Events, EventsStateService } from 'src/shared/ui';

@Component({
  selector: 'welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less'],
})
export class WelcomeComponent {
  constructor(private eventStates: EventsStateService) {}

  public runFileUpload(): void {
    this.eventStates.add(Events.runUploadFile, true);
  }
}
