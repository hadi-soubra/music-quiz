import { Component, DestroyRef, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../player.service';
import { SettingsService } from '../settings.service';
import { COMPOSERS, COMPOSER_BY_ID, Composer, ComposerId, TRACKS, Track } from '../tracks';

interface Result {
  track: Track;
  picked: ComposerId;
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

  protected readonly composers = COMPOSERS;
  protected readonly tracks = signal<Track[]>([]);
  protected readonly index = signal(0);
  protected readonly picked = signal<ComposerId | null>(null);
  protected readonly results = signal<Result[]>([]);

  protected readonly current = computed<Track | undefined>(() => this.tracks()[this.index()]);
  protected readonly finished = computed(() => this.index() >= this.tracks().length);
  protected readonly score = computed(() => this.results().filter((r) => r.correct).length);
  protected readonly missed = computed(() => this.results().filter((r) => !r.correct));
  protected readonly isCurrentLoaded = computed(
    () => !!this.current() && this.player.videoId() === this.current()!.videoId,
  );
  protected readonly ringLength = 2 * Math.PI * 54;
  private readonly reveal = viewChild<ElementRef<HTMLElement>>('reveal');

  constructor() {
    this.newRound(TRACKS.filter((t) => this.settings.composers.includes(t.composer)));
    inject(DestroyRef).onDestroy(() => this.player.stop());
    // On phones the answer card lands below the fold, so bring it into view.
    effect(() => this.reveal()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  }

  protected newRound(tracks: Track[]): void {
    this.player.stop();
    this.tracks.set(shuffle(tracks));
    this.index.set(0);
    this.picked.set(null);
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
    this.player.play(track.videoId, Math.min(start, latest), this.picked() ? 0 : length);
  }

  protected answer(id: ComposerId): void {
    const track = this.current();
    if (!track || this.picked()) return;
    this.picked.set(id);
    this.results.update((r) => [...r, { track, picked: id, correct: id === track.composer }]);
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

    if (e.key === ' ') {
      e.preventDefault();
      this.togglePlay();
    } else if (e.key === 'Enter') {
      this.next();
    } else if (/^[1-9]$/.test(e.key)) {
      const composer = COMPOSERS[Number(e.key) - 1];
      if (composer) this.answer(composer.id);
    }
  }
}
