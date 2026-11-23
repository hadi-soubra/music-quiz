import { Component, DestroyRef, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../player.service';
import { SettingsService } from '../settings.service';
import { matchComposer } from '../guess';
import { COMPOSER_BY_ID, Composer, ComposerId, TRACKS, Track } from '../tracks';

interface Result {
  track: Track;
  /** What was typed; empty when they gave up. */
  guess: string;
  correct: boolean;
  /** Right composer, but not spelled exactly. */
  misspelled: boolean;
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

  protected readonly tracks = signal<Track[]>([]);
  protected readonly index = signal(0);
  protected readonly guess = signal('');
  /** The current question's result, once answered. */
  protected readonly answered = signal<Result | null>(null);
  protected readonly results = signal<Result[]>([]);

  protected readonly current = computed<Track | undefined>(() => this.tracks()[this.index()]);
  protected readonly finished = computed(() => this.index() >= this.tracks().length);
  protected readonly score = computed(() => this.results().filter((r) => r.correct).length);
  protected readonly missed = computed(() => this.results().filter((r) => !r.correct));
  protected readonly misspelled = computed(() => this.results().filter((r) => r.misspelled));
  protected readonly isCurrentLoaded = computed(
    () => !!this.current() && this.player.videoId() === this.current()!.videoId,
  );
  protected readonly ringLength = 2 * Math.PI * 54;
  private readonly reveal = viewChild<ElementRef<HTMLElement>>('reveal');
  private readonly box = viewChild<ElementRef<HTMLInputElement>>('box');

  constructor() {
    this.newRound(TRACKS.filter((t) => this.settings.composers.includes(t.composer)));
    inject(DestroyRef).onDestroy(() => this.player.stop());
    // On phones the answer card lands below the fold, so bring it into view.
    effect(() => this.reveal()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    // Ready to type on each question. Skipped on touch screens, where the keyboard would cover the record.
    const canType = matchMedia('(pointer: fine)').matches;
    effect(() => {
      this.index();
      if (canType) this.box()?.nativeElement.focus({ preventScroll: true });
    });
  }

  protected newRound(tracks: Track[]): void {
    this.player.stop();
    this.tracks.set(shuffle(tracks));
    this.index.set(0);
    this.guess.set('');
    this.answered.set(null);
    this.results.set([]);
  }

  protected retryMissed(): void {
    this.newRound(this.missed().map((r) => r.track));
    this.playCurrent();
  }

  protected restart(): void {
    this.newRound(this.tracks());
    this.playCurrent();
  }

  protected togglePlay(): void {
    if (!this.current()) return;
    if (this.isCurrentLoaded()) this.player.toggle();
    else this.playCurrent();
  }

  /** Start the current question's clip; `randomSpot` forces a new random position. */
  protected playCurrent(randomSpot = this.settings.start === 'random'): void {
    const track = this.current();
    if (!track) return;
    const length = this.settings.snippet;
    const latest = Math.max(0, track.duration - (length || 30) - 3);
    const start = randomSpot ? Math.floor(3 + Math.random() * Math.max(0, latest - 3)) : 0;
    this.player.play(track.videoId, Math.min(start, latest), this.answered() ? 0 : length);
  }

  protected onSubmit(e: Event): void {
    e.preventDefault();
    const guess = this.guess().trim();
    if (guess) this.answer(guess);
  }

  /** Record the answer for the current question; an empty guess means "don't know". */
  protected answer(guess: string): void {
    const track = this.current();
    if (!track || this.answered()) return;
    const match = guess ? matchComposer(guess) : null;
    const correct = match?.composer === track.composer;
    const result = { track, guess, correct, misspelled: correct && match!.misspelled };
    this.answered.set(result);
    this.results.update((r) => [...r, result]);
  }

  protected next(): void {
    if (!this.answered()) return;
    this.answered.set(null);
    this.guess.set('');
    this.index.update((i) => i + 1);
    if (this.finished()) this.player.stop();
    else this.playCurrent();
  }

  protected listen(track: Track): void {
    if (this.player.videoId() === track.videoId) this.player.toggle();
    else this.player.play(track.videoId);
  }

  protected composerOf(id: ComposerId): Composer {
    return COMPOSER_BY_ID[id];
  }

  protected percent(): number {
    const total = this.tracks().length;
    return total ? Math.round((this.score() / total) * 100) : 0;
  }

  protected verdict(): string {
    const p = this.percent();
    if (p === 100) return 'Perfect. You’re ready.';
    if (p >= 80) return 'Nearly there. Review the misses.';
    if (p >= 50) return 'Getting there. Study the hints and go again.';
    return 'Keep practising. Try the Study page first.';
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    // Let a keyboard-focused button handle its own Space/Enter.
    if (e.target instanceof HTMLButtonElement && (e.key === ' ' || e.key === 'Enter')) return;
    const box = this.box()?.nativeElement;
    const typing = !!box && e.target === box;

    if (e.key === 'Enter') {
      // Before answering, Enter in the box submits the form instead.
      if (this.answered()) {
        e.preventDefault();
        this.next();
      }
    } else if (e.key === ' ') {
      // Space types normally once a name is started; a leading space is never needed.
      if (typing && this.guess() && !this.answered()) return;
      e.preventDefault();
      this.togglePlay();
    } else if (!typing && box && !this.answered() && e.key.length === 1) {
      // Start typing from anywhere on the page.
      box.focus({ preventScroll: true });
    }
  }
}
