import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
  firstValueFrom,
  fromEvent,
  map,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Events, EventsStateService, MaterialModule } from 'src/shared/ui';
import { Base64HelperService } from '../../../entities/base64';
import { SpeechService } from '../../../entities/speech';

@Component({
  selector: 'voice',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoiceComponent implements AfterViewInit {
  @ViewChild('input') input!: ElementRef;

  public mp3Base64Data$: Subject<string> = new BehaviorSubject('');
  public text = '';
  public valid$: Subject<boolean> = new BehaviorSubject(false);

  constructor(
    private speechService: SpeechService,
    private base64Helper: Base64HelperService,
    private eventsState: EventsStateService
  ) {}

  async voice() {
    this.eventsState.add(Events.loading, true);

    const data = await firstValueFrom(
      this.speechService.getVoice(this.text).pipe(
        switchMap((blob: Blob) => {
          return this.base64Helper.blobToBase64(blob);
        })
      )
    );
    this.mp3Base64Data$.next(data);

    this.eventsState.add(Events.loading, false);
  }

  ngAfterViewInit() {
    fromEvent<KeyboardEvent>(this.input.nativeElement, 'input')
      .pipe(
        map(event => (event.target as HTMLInputElement).value),
        distinctUntilChanged(),
        tap((value: string) => {
          value = value.trim();
          this.text = value;
          this.valid$.next(value.length > 0);
        })
      )
      .subscribe();
  }
}
