import { Injectable } from '@angular/core';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
if (!window['AudioContext']) {
  window['AudioContext'] = window['webkitAudioContext'];
}

const AUDIO_PRESET = [
  {
    frequency: 20,
    gain: 30,
  },
  {
    frequency: 40,
    gain: 20,
  },
  {
    frequency: 60,
    gain: 10,
  },
  {
    frequency: 80,
    gain: 5,
  },
  {
    frequency: 20000,
    gain: -20,
  },
  {
    frequency: 150000,
    gain: -15,
  },
];

@Injectable({
  providedIn: 'root',
})
export class EqualizerService {
  private context = new AudioContext();

  private createFilter(frequency: number, gain: number): AudioNode {
    const filter = this.context.createBiquadFilter();

    filter.type = 'peaking'; // тип фильтра
    filter.frequency.value = frequency; // частота
    filter.Q.value = 1; // Q-factor
    filter.gain.value = gain;

    return filter as AudioNode;
  }

  private createFilters() {
    const filters = AUDIO_PRESET.map(setting =>
      this.createFilter(setting.frequency, setting.gain)
    );

    filters.reduce((prev: AudioNode, curr: AudioNode) => {
      prev.connect(curr);
      return curr;
    });

    return filters;
  }

  public equalize(audio: HTMLAudioElement) {
    const source = this.context.createMediaElementSource(audio);
    const filters = this.createFilters();

    source.connect(filters[0] as AudioNode);
    filters[filters.length - 1].connect(this.context.destination);
  }
}
