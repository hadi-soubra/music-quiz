import { Component, DestroyRef, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../player.service';
import { SettingsService } from '../settings.service';
import { COMPOSERS, COMPOSER_BY_ID, Composer, TRACKS, Track } from '../tracks';

interface Choice {
  id: string;
  label: string;
  color?: string;
}

interface Question {
  track: Track;
  choices: Choice[];
  answer: string;
}

interface Result {
  track: Track;
  picked: string;
  correct: boolean;
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

@Component({
  selector: 'app-quiz',
  imports: [RouterLink],
  templateUrl: './quiz.html',
  styleUrl: './quiz.scss',
  host: { '(document:keydown)': 'onKey($event)' },
})
export class Quiz {
  protected readonly player = inject(PlayerService);
  // Snapshot so changing settings mid-round can't scramble the current round.
  private readonly settings = inject(SettingsService).settings();

  protected readonly mode = this.settings.mode;
  protected readonly composerById = COMPOSER_BY_ID;
  protected readonly questions = signal<Question[]>([]);
  protected readonly index = signal(0);
  protected readonly picked = signal<string | null>(null);
  protected readonly results = signal<Result[]>([]);

  protected readonly current = computed<Question | undefined>(() => this.questions()[this.index()]);
  protected readonly finished = computed(() => this.index() >= this.questions().length);
  protected readonly score = computed(() => this.results().filter((r) => r.correct).length);
  protected readonly missed = computed(() => this.results().filter((r) => !r.correct));
  protected readonly isCurrentLoaded = computed(
    () => !!this.current() && this.player.videoId() === this.current()!.track.videoId,
  );
  protected readonly ringLength = 2 * Math.PI * 54;
  private readonly reveal = viewChild<ElementRef<HTMLElement>>('reveal');

  constructor() {
    this.newRound(TRACKS.filter((t) => this.settings.composers.includes(t.composer)));
    inject(DestroyRef).onDestroy(() => this.player.stop());
    // On phones the answer card lands below the fold — bring it into view.
    effect(() => this.reveal()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  }

  protected newRound(tracks: Track[]): void {
    this.player.stop();
    this.questions.set(shuffle(tracks).map((t) => this.buildQuestion(t)));
    this.index.set(0);
    this.picked.set(null);
    this.results.set([]);
  }

  protected retryMissed(): void {
    this.newRound(this.missed().map((r) => r.track));
    this.playCurrent();
  }

  protected restart(): void {
    this.newRound(this.questions().map((q) => q.track));
    this.playCurrent();
  }

  protected togglePlay(): void {
    if (!this.current()) return;
    if (this.isCurrentLoaded()) this.player.toggle();
    else this.playCurrent();
  }

  /** Start the current question's clip; `randomSpot` forces a new random position. */
  protected playCurrent(randomSpot = this.settings.start === 'random'): void {
    const q = this.current();
    if (!q) return;
    const length = this.settings.snippet;
    const latest = Math.max(0, q.track.duration - (length || 30) - 3);
    const start = randomSpot ? Math.floor(3 + Math.random() * Math.max(0, latest - 3)) : 0;
    this.player.play(q.track.videoId, Math.min(start, latest), this.picked() ? 0 : length);
  }

  protected answer(choiceId: string): void {
    const q = this.current();
    if (!q || this.picked()) return;
    this.picked.set(choiceId);
    this.results.update((r) => [
      ...r,
      { track: q.track, picked: choiceId, correct: choiceId === q.answer },
    ]);
  }

  protected next(): void {
    if (!this.picked()) return;
    this.picked.set(null);
    this.index.update((i) => i + 1);
    if (this.finished()) this.player.stop();
    else this.playCurrent();
  }

  protected listen(track: Track): void {
    if (this.player.videoId() === track.videoId) this.player.toggle();
    else this.player.play(track.videoId);
  }

  protected labelFor(result: Result): string {
    return this.mode === 'composer'
      ? COMPOSER_BY_ID[result.picked as Composer['id']].name
      : (TRACKS.find((t) => t.id === result.picked)?.title ?? '');
  }

  protected composerOf(track: Track): Composer {
    return COMPOSER_BY_ID[track.composer];
  }

  protected percent(): number {
    const total = this.questions().length;
    return total ? Math.round((this.score() / total) * 100) : 0;
  }

  protected verdict(): string {
    const p = this.percent();
    if (p === 100) return 'Perfect. You’re ready.';
    if (p >= 80) return 'Nearly there — review the misses.';
    if (p >= 50) return 'Getting there. Study the hints and go again.';
    return 'Keep practising — try the Study page first.';
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    // Let a keyboard-focused button handle its own Space/Enter.
    if (e.target instanceof HTMLButtonElement && (e.key === ' ' || e.key === 'Enter')) return;

    const q = this.current();
    if (e.key === ' ') {
      e.preventDefault();
      this.togglePlay();
    } else if (e.key === 'Enter') {
      this.next();
    } else if (q && /^[1-9]$/.test(e.key)) {
      const choice = q.choices[Number(e.key) - 1];
      if (choice) this.answer(choice.id);
    }
  }

  private buildQuestion(track: Track): Question {
    if (this.mode === 'composer') {
      return {
        track,
        answer: track.composer,
        choices: COMPOSERS.map((c) => ({ id: c.id, label: c.name, color: c.color })),
      };
    }
    // Piece mode: the right title plus three others, preferring pieces in the selected pool.
    const others = shuffle(TRACKS.filter((t) => t.id !== track.id)).sort(
      (a, b) =>
        Number(this.settings.composers.includes(b.composer)) -
        Number(this.settings.composers.includes(a.composer)),
    );
    return {
      track,
      answer: track.id,
      choices: shuffle([track, ...others.slice(0, 3)]).map((t) => ({ id: t.id, label: t.title })),
    };
  }
}
