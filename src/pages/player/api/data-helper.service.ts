import { Injectable } from '@angular/core';
import {
  AudioPreloadingService,
  PRELOAD_EXTRA,
} from 'src/pages/player/api/audio-preloading.service';
import { AudioStorageService } from 'src/pages/player/model/audio-storage.service';
import { CursorPositionStoreService } from 'src/entities/cursor';
import { Events, EventsStateService } from 'src/shared/ui';

@Injectable({
  providedIn: 'root',
})
export class DataHelperService {
  constructor(
    private audioStorage: AudioStorageService,
    private eventStateService: EventsStateService,
    private cursorService: CursorPositionStoreService,
    private preloadHelper: AudioPreloadingService
  ) {}

  public async ensureAudioDataReady() {
    if (!this.audioStorage.get(this.cursorService.position)) {
      this.eventStateService.add(Events.loading);

      await this.preloadHelper.preloadParagraph(
        this.cursorService.position,
        PRELOAD_EXTRA.min
      );

      this.eventStateService.remove(Events.loading);
    }
  }
}
