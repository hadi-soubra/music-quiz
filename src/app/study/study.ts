import { Component, DestroyRef, inject } from '@angular/core';
import { PlayerService } from '../player.service';
import { COMPOSERS, TRACKS, Track } from '../tracks';

@Component({
  selector: 'app-study',
  templateUrl: './study.html',
  styleUrl: './study.scss',
})
export class Study {
  protected readonly player = inject(PlayerService);
  protected readonly groups = COMPOSERS.map((composer) => ({
    composer,
    tracks: TRACKS.filter((t) => t.composer === composer.id),
  }));

  constructor() {
    inject(DestroyRef).onDestroy(() => this.player.stop());
  }

  protected isPlaying(track: Track): boolean {
    return this.player.playing() && this.player.videoId() === track.videoId;
  }

  protected listen(track: Track): void {
    if (this.player.videoId() === track.videoId) this.player.toggle();
    else this.player.play(track.videoId);
  }

  protected time(seconds: number): string {
    const s = Math.floor(seconds);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }
}
