import { Injectable, effect, signal } from '@angular/core';
import { COMPOSERS, ComposerId } from './tracks';

export type QuizMode = 'composer' | 'piece';
export type StartPoint = 'beginning' | 'random';

export interface Settings {
  mode: QuizMode;
  start: StartPoint;
  /** Seconds of music per question; 0 = whole piece. */
  snippet: number;
  /** Only pieces by these composers are asked. */
  composers: ComposerId[];
}

const KEY = 'composer-quiz-settings';

const DEFAULTS: Settings = {
  mode: 'composer',
  start: 'random',
  snippet: 20,
  composers: COMPOSERS.map((c) => c.id),
};

function load(): Settings {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return saved ? { ...DEFAULTS, ...saved } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly settings = signal<Settings>(load());

  constructor() {
    effect(() => {
      const value = JSON.stringify(this.settings());
      try {
        localStorage.setItem(KEY, value);
      } catch {
        // Storage unavailable (private mode etc.) — settings just won't persist.
      }
    });
  }

  update(patch: Partial<Settings>): void {
    this.settings.update((s) => ({ ...s, ...patch }));
  }

  toggleComposer(id: ComposerId): void {
    const current = this.settings().composers;
    const next = current.includes(id) ? current.filter((c) => c !== id) : [...current, id];
    if (next.length) this.update({ composers: next });
  }
}
